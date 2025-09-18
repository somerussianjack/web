'use client';

import { useErrors } from 'apps/web/contexts/Errors';
import { useUsernameProfile } from 'apps/web/src/components/Basenames/UsernameProfileContext';
import useBasenameChain from 'apps/web/src/hooks/useBasenameChain';
import useWriteContractWithReceipt, {
  WriteTransactionWithReceiptStatus,
} from 'apps/web/src/hooks/useWriteContractWithReceipt';
import { buildBasenameReclaimContract, getTokenIdFromBasename } from 'apps/web/src/utils/usernames';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ContractFunctionParameters, Hash, isAddress, namehash, encodeFunctionData } from 'viem';
import { useAccount, useSignMessage } from 'wagmi';
import L2ResolverAbi from 'apps/web/src/abis/L2Resolver';
import BaseRegistrarAbi from 'apps/web/src/abis/BaseRegistrarAbi';
import ReverseRegistrarAbi from 'apps/web/src/abis/ReverseRegistrarAbi';
import UpgradeableRegistrarControllerAbi from 'apps/web/src/abis/UpgradeableRegistrarControllerAbi';
import {
  USERNAME_BASE_REGISTRAR_ADDRESSES,
  USERNAME_L2_REVERSE_REGISTRAR_ADDRESSES,
  USERNAME_REVERSE_REGISTRAR_ADDRESSES,
  USERNAME_L2_RESOLVER_ADDRESSES,
  UPGRADEABLE_REGISTRAR_CONTROLLER_ADDRESSES,
} from 'apps/web/src/addresses/usernames';
import useWriteContractsWithLogs, {
  BatchCallsStatus,
} from 'apps/web/src/hooks/useWriteContractsWithLogs';
import useBasenameResolver from 'apps/web/src/hooks/useBasenameResolver';
import useCapabilitiesSafe from 'apps/web/src/hooks/useCapabilitiesSafe';
import L2ReverseRegistrarAbi from 'apps/web/src/abis/L2ReverseRegistrarAbi';
import {
  convertChainIdToCoinTypeUint,
  signReverseRecordMessage,
} from 'apps/web/src/utils/usernames';

type ProfileTransferOwnershipProviderProps = {
  children?: ReactNode;
};

export enum OwnershipSteps {
  Search = 'search',
  OwnershipOverview = 'ownership-overview',
  SignatureCollection = 'signature-collection',
  WalletRequests = 'wallet-requests',
  Success = 'success',
}

export type OwnershipSettings = {
  id: 'setAddr' | 'reclaim' | 'setName' | 'safeTransferFrom';
  name: string;
  description: string;
  status: WriteTransactionWithReceiptStatus;
  contractFunction: () => Promise<void>;
};

export type ProfileTransferOwnershipContextProps = {
  ownershipSettings: OwnershipSettings[];
  isSuccess: boolean;
  currentOwnershipStep: OwnershipSteps;
  setCurrentOwnershipStep: Dispatch<SetStateAction<OwnershipSteps>>;
  recipientAddress: string;
  setRecipientAddress: Dispatch<SetStateAction<string>>;
  batchTransactionsEnabled: boolean;
  batchCallsStatus: BatchCallsStatus;
  batchCallsIsLoading: boolean;
  ownershipTransactionHash?: Hash;
  isEOA: boolean;
  signatureError: Error | null;
  collectSignature: () => Promise<void>;
  signatureCollected: boolean;
};

export const ProfileTransferOwnershipContext = createContext<ProfileTransferOwnershipContextProps>({
  ownershipSettings: [],
  isSuccess: false,
  currentOwnershipStep: OwnershipSteps.Search,
  setCurrentOwnershipStep: () => undefined,
  recipientAddress: '',
  setRecipientAddress: () => undefined,
  batchTransactionsEnabled: false,
  batchCallsStatus: BatchCallsStatus.Idle,
  batchCallsIsLoading: false,
  ownershipTransactionHash: undefined,
  isEOA: false,
  signatureError: null,
  collectSignature: async () => undefined,
  signatureCollected: false,
});

export default function ProfileTransferOwnershipProvider({
  children,
}: ProfileTransferOwnershipProviderProps) {
  // Hooks
  const { address } = useAccount();
  const { profileUsername, canReclaim, canSafeTransferFrom, canSetAddr } = useUsernameProfile();
  const { basenameChain } = useBasenameChain(profileUsername);
  const { logError } = useErrors();
  const { signMessageAsync } = useSignMessage();
  const { paymasterService: paymasterServiceEnabled } = useCapabilitiesSafe({
    chainId: basenameChain.id,
  });

  // Fetch resolver address from registry for the basename
  const { data: resolverAddress } = useBasenameResolver({
    username: profileUsername,
  });

  // States
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [currentOwnershipStep, setCurrentOwnershipStep] = useState<OwnershipSteps>(
    OwnershipSteps.Search,
  );
  const [signatureError, setSignatureError] = useState<Error | null>(null);
  const [signatureData, setSignatureData] = useState<{
    coinTypes: readonly bigint[];
    signatureExpiry: bigint;
    signature: `0x${string}`;
  } | null>(null);

  // TODO: Validate that it's not a contract recipient
  const isValidRecipientAddress = isAddress(recipientAddress);
  const tokenId = getTokenIdFromBasename(profileUsername);

  // Determine wallet type - EOA if paymaster service is not enabled
  const isEOA = !paymasterServiceEnabled;
  const signatureCollected = !!signatureData;

  // Signature collection for EOAs
  const collectSignature = useCallback(async () => {
    if (!address || !isEOA) return;

    try {
      setSignatureError(null);

      const nameLabel = ''; // Empty string for removing reverse record
      const signatureData = await signReverseRecordMessage({
        address,
        chainId: basenameChain.id,
        nameLabel,
        signMessageAsync,
      });

      setSignatureData(signatureData);
    } catch (error) {
      logError(error, 'Signature collection failed');
      const msg = error instanceof Error && error.message ? error.message : 'Unknown error';
      setSignatureError(new Error(`Could not prepare reverse record signature: ${msg}`));
    }
  }, [address, isEOA, basenameChain.id, signMessageAsync, logError]);

  // Contract write calls
  // Step 1, set the address records (legacy and ENSIP-11)
  const setAddrContract = useMemo(() => {
    if (!isValidRecipientAddress || !profileUsername || !resolverAddress) return;

    const nodeHash = namehash(profileUsername);

    const legacyAddrData = encodeFunctionData({
      abi: L2ResolverAbi,
      functionName: 'setAddr',
      args: [nodeHash, recipientAddress],
    });

    // Set addr with ENSIP-11 address
    const baseAddrData = encodeFunctionData({
      abi: L2ResolverAbi,
      functionName: 'setAddr',
      args: [nodeHash, BigInt(convertChainIdToCoinTypeUint(basenameChain.id)), recipientAddress],
    });

    return {
      abi: L2ResolverAbi,
      address: resolverAddress,
      args: [nodeHash, [legacyAddrData, baseAddrData]],
      functionName: 'multicallWithNodeCheck',
    } as ContractFunctionParameters;
  }, [
    isValidRecipientAddress,
    profileUsername,
    recipientAddress,
    resolverAddress,
    basenameChain.id,
  ]);

  // Step 2, reclaim the basename
  const reclaimContract = useMemo(() => {
    if (!tokenId || !isValidRecipientAddress) return;
    return buildBasenameReclaimContract(profileUsername, recipientAddress);
  }, [isValidRecipientAddress, profileUsername, recipientAddress, tokenId]);

  // Step 3, safe transfer the basename NFT to the recipient
  const safeTransferFromContract = useMemo(() => {
    if (!tokenId || !isValidRecipientAddress || !address) return;

    return {
      abi: BaseRegistrarAbi,
      address: USERNAME_BASE_REGISTRAR_ADDRESSES[basenameChain.id],
      args: [address, recipientAddress, tokenId],
      functionName: 'safeTransferFrom',
    } as ContractFunctionParameters;
  }, [address, basenameChain.id, isValidRecipientAddress, recipientAddress, tokenId]);

  // Step 4, set the reverse resolution record - context-aware for EOA vs SCW
  const setNameContract = useMemo(() => {
    if (isEOA) {
      // EOA flow: Use UpgradeableRegistrarController with signature
      if (!signatureData) return undefined;

      const nameLabel = ''; // Empty string for removing reverse record
      return {
        abi: UpgradeableRegistrarControllerAbi,
        address: UPGRADEABLE_REGISTRAR_CONTROLLER_ADDRESSES[basenameChain.id],
        args: [
          nameLabel,
          signatureData.signatureExpiry,
          signatureData.coinTypes,
          signatureData.signature,
        ],
        functionName: 'setReverseRecord',
      } as ContractFunctionParameters;
    } else {
      // SCW flow: Use L2ReverseRegistrar
      return {
        abi: L2ReverseRegistrarAbi,
        address: USERNAME_L2_REVERSE_REGISTRAR_ADDRESSES[basenameChain.id],
        args: [''],
        functionName: 'setName',
      } as ContractFunctionParameters;
    }
  }, [basenameChain.id, isEOA, signatureData]);

  // Bundled transaction - Experimental
  const {
    initiateBatchCalls,
    batchCallsEnabled,
    batchCallsStatus,
    batchCallsIsLoading,
    batchCallTransactionHash,
  } = useWriteContractsWithLogs({
    chain: basenameChain,
    eventName: 'basename_send_calls_transfer_ownership',
  });

  // The 4 transactions we got to track
  const {
    initiateTransaction: initiateSafeTransferFrom,
    transactionStatus: safeTransferFromStatus,
    transactionHash: safeTransferFromTransactionHash,
  } = useWriteContractWithReceipt({
    chain: basenameChain,
    eventName: 'basename_safe_transfer_from',
  });

  const { initiateTransaction: initiateReclaim, transactionStatus: reclaimStatus } =
    useWriteContractWithReceipt({
      chain: basenameChain,
      eventName: 'basename_reclaim',
    });

  const { initiateTransaction: initiateSetAddr, transactionStatus: setAddrStatus } =
    useWriteContractWithReceipt({
      chain: basenameChain,
      eventName: 'basename_set_addr',
    });

  const { initiateTransaction: initiateSetName, transactionStatus: setNameStatus } =
    useWriteContractWithReceipt({
      chain: basenameChain,
      eventName: 'basename_set_name',
    });

  // One batched transaction
  const updateViaBatchCalls = useCallback(async () => {
    if (!isValidRecipientAddress) return;
    if (!address) return;
    if (!basenameChain) return;
    if (!batchCallsEnabled) return;

    const contracts = [];

    // Add setAddr and reclaim/safeTransferFrom contracts if available
    if (setAddrContract) contracts.push(setAddrContract);
    if (reclaimContract) contracts.push(reclaimContract);
    if (safeTransferFromContract) contracts.push(safeTransferFromContract);

    // For SCWs, add both reverse record contracts
    if (!isEOA) {
      // Add setNameForAddr contract (similar to useSetPrimaryBasename)
      contracts.push({
        abi: ReverseRegistrarAbi,
        address: USERNAME_REVERSE_REGISTRAR_ADDRESSES[basenameChain.id],
        args: [
          address,
          address,
          USERNAME_L2_RESOLVER_ADDRESSES[basenameChain.id],
          '', // Empty string for removing reverse record
        ],
        functionName: 'setNameForAddr',
      });

      // Add setName contract
      if (setNameContract) contracts.push(setNameContract);
    } else {
      // For EOAs, just add the single setReverseRecord contract
      if (setNameContract) contracts.push(setNameContract);
    }

    if (contracts.length > 0) {
      await initiateBatchCalls({
        contracts,
        account: address,
        chain: basenameChain,
      });
    }
  }, [
    address,
    basenameChain,
    batchCallsEnabled,
    initiateBatchCalls,
    isValidRecipientAddress,
    reclaimContract,
    safeTransferFromContract,
    setAddrContract,
    setNameContract,
    isEOA,
  ]);

  // The 4 Function with safety checks
  const updateSetAddr = useCallback(async () => {
    if (!setAddrContract) return Promise.reject('Invalid setAddrContract');
    await initiateSetAddr(setAddrContract);
  }, [initiateSetAddr, setAddrContract]);

  const updateReclaim = useCallback(async () => {
    if (!reclaimContract) return Promise.reject('Invalid reclaimContract');
    await initiateReclaim(reclaimContract);
  }, [initiateReclaim, reclaimContract]);

  const updateSafeTransferFrom = useCallback(async () => {
    if (!safeTransferFromContract) return Promise.reject('Invalid safeTransferFromContract');
    await initiateSafeTransferFrom(safeTransferFromContract);
  }, [initiateSafeTransferFrom, safeTransferFromContract]);

  const updateSetName = useCallback(async () => {
    if (!setNameContract) return Promise.reject('Invalid setNameContract');
    await initiateSetName(setNameContract);
  }, [initiateSetName, setNameContract]);

  // Function & status we can track and display the edit rec
  const ownershipSettings: OwnershipSettings[] = useMemo(() => {
    const settings: OwnershipSettings[] = [];

    if (canSetAddr) {
      settings.push({
        id: 'setAddr',
        name: 'Address record',
        description: 'Your Basename will resolve to this address.',
        status: setAddrStatus,
        contractFunction: updateSetAddr,
      });
      settings.push({
        id: 'setName',
        name: 'Name record',
        description: 'Your Basename will no longer be displayed with your address.',
        status: setNameStatus,
        contractFunction: updateSetName,
      });
    }

    if (canReclaim) {
      settings.push({
        id: 'reclaim',
        name: 'Profile editing',
        description: 'Transfer editing rights to this address.',
        status: reclaimStatus,
        contractFunction: updateReclaim,
      });
    }

    if (canSafeTransferFrom) {
      settings.push({
        id: 'safeTransferFrom',
        name: 'Token ownership',
        description: 'Transfer the Basename token to this address.',
        status: safeTransferFromStatus,
        contractFunction: updateSafeTransferFrom,
      });
    }

    return settings;
  }, [
    canSetAddr,
    canReclaim,
    canSafeTransferFrom,
    setAddrStatus,
    updateSetAddr,
    setNameStatus,
    updateSetName,
    reclaimStatus,
    updateReclaim,
    safeTransferFromStatus,
    updateSafeTransferFrom,
  ]);

  const ownershipSettingsAreWaiting = useMemo(() => {
    return ownershipSettings.every((ownershipSetting) => {
      return [
        WriteTransactionWithReceiptStatus.Idle,
        WriteTransactionWithReceiptStatus.Success,
      ].includes(ownershipSetting.status);
    });
  }, [ownershipSettings]);

  // Handle signature collection step for EOAs
  useEffect(() => {
    if (currentOwnershipStep !== OwnershipSteps.SignatureCollection) return;
    if (!isEOA) {
      // Skip signature collection for SCWs
      setCurrentOwnershipStep(OwnershipSteps.WalletRequests);
      return;
    }
    if (signatureCollected) {
      // Signature already collected, move to wallet requests
      setCurrentOwnershipStep(OwnershipSteps.WalletRequests);
    }
  }, [currentOwnershipStep, isEOA, signatureCollected]);

  useEffect(() => {
    // Only when the wallet request steps is displaying
    if (currentOwnershipStep !== OwnershipSteps.WalletRequests) return;

    // For EOAs, ensure signature is collected before proceeding
    if (isEOA && !signatureCollected) {
      setCurrentOwnershipStep(OwnershipSteps.SignatureCollection);
      return;
    }

    // Some transactions are loading / failed: return early
    if (!ownershipSettingsAreWaiting) return;

    // Smart wallet - we can batch calls
    if (batchCallsEnabled) {
      updateViaBatchCalls().catch((error) => {
        setCurrentOwnershipStep(OwnershipSteps.OwnershipOverview);
        logError(error, 'Failed to update via sendCalls');
      });

      return;
    }

    // For each ownership setting / wallet transaction
    for (const ownershipSetting of ownershipSettings) {
      // Get the current index & previous ownership setting (if any)
      const currentIndex = ownershipSettings.indexOf(ownershipSetting);
      const previousOwnershipSetting = ownershipSettings[currentIndex - 1];

      // If the setting transaction is Idle and either
      // - Is the first transaction
      // - Previous transaction is successful
      const canCallfunction =
        ownershipSetting.status === WriteTransactionWithReceiptStatus.Idle &&
        (currentIndex === 0 ||
          previousOwnershipSetting.status === WriteTransactionWithReceiptStatus.Success);

      // then call the wallet request function
      if (canCallfunction) {
        ownershipSetting.contractFunction().catch((error) => {
          logError(error, `Failed contractFunction for ${ownershipSetting.id}`);
        });
        break;
      }
    }
  }, [
    batchCallsEnabled,
    currentOwnershipStep,
    logError,
    ownershipSettings,
    ownershipSettingsAreWaiting,
    updateViaBatchCalls,
    isEOA,
    signatureCollected,
  ]);

  const isSuccess = useMemo(
    () =>
      // Smart wallet: One transaction
      batchCallsStatus === BatchCallsStatus.Success ||
      // Other wallet: 4 Transactions are successful
      (ownershipSettings.length > 0 &&
        ownershipSettings.every(
          (ownershipSetting) =>
            ownershipSetting.status === WriteTransactionWithReceiptStatus.Success,
        )),
    [batchCallsStatus, ownershipSettings],
  );

  useEffect(() => {
    if (isSuccess) {
      setCurrentOwnershipStep(OwnershipSteps.Success);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (batchCallsStatus === BatchCallsStatus.Canceled) {
      setCurrentOwnershipStep(OwnershipSteps.OwnershipOverview);
    }
  }, [batchCallsStatus]);

  // Either the batch call hash or the single NFT transaction hash
  const ownershipTransactionHash = (batchCallTransactionHash ?? safeTransferFromTransactionHash) as
    | Hash
    | undefined;

  const value = useMemo(() => {
    return {
      ownershipSettings,
      isSuccess,
      batchTransactionsEnabled: batchCallsEnabled,
      batchCallsStatus,
      batchCallsIsLoading,
      currentOwnershipStep,
      setCurrentOwnershipStep,
      recipientAddress,
      setRecipientAddress,
      ownershipTransactionHash,
      isEOA,
      signatureError,
      collectSignature,
      signatureCollected,
    };
  }, [
    ownershipSettings,
    isSuccess,
    batchCallsEnabled,
    batchCallsStatus,
    batchCallsIsLoading,
    currentOwnershipStep,
    recipientAddress,
    ownershipTransactionHash,
    isEOA,
    signatureError,
    collectSignature,
    signatureCollected,
  ]);

  return (
    <ProfileTransferOwnershipContext.Provider value={value}>
      {children}
    </ProfileTransferOwnershipContext.Provider>
  );
}

export function useProfileTransferOwnership() {
  const context = useContext(ProfileTransferOwnershipContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
}
