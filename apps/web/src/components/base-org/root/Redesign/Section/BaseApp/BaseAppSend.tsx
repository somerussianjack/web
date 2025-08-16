import { ImageType } from 'apps/web/src/components/base-org/root/Redesign/Section';
import Image from 'next/image';

import Avatar1 from './tba-avatar-1.png';
import Avatar2 from './tba-avatar-2.png';
import USA from './tba-usa.png';
import HK from './tba-hk.png';

const avatar1 = Avatar1 as ImageType;
const avatar2 = Avatar2 as ImageType;
const usa = USA as ImageType;
const hk = HK as ImageType;

export function BaseAppSend() {
  return (
    <div className="flex justify-center items-center w-full h-full group">
      <svg
        width="504"
        height="500"
        className="h-full w-full scale-[0.98] transition-all duration-200 group-hover:scale-[0.95]"
        viewBox="0 0 504 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M252 498.123C390.071 498.123 502 387.042 502 250.016C502 112.99 390.071 1.90894 252 1.90894C113.929 1.90894 2 112.99 2 250.016C2 387.042 113.929 498.123 252 498.123Z"
          stroke="#DEE1E7"
          strokeWidth="3"
          strokeMiterlimit="10"
        />
        <path d="M34.5988 129.075H468.841" stroke="#DEE1E7" strokeWidth="3" strokeMiterlimit="10" />
        <path d="M34.5988 378.025H468.841" stroke="#DEE1E7" strokeWidth="3" strokeMiterlimit="10" />
        <path
          d="M251.996 494.772C323.605 494.772 381.655 385.19 381.655 250.015C381.655 114.839 323.605 5.25769 251.996 5.25769C180.388 5.25769 122.338 114.839 122.338 250.015C122.338 385.19 180.388 494.772 251.996 494.772Z"
          stroke="#DEE1E7"
          strokeWidth="3"
          strokeMiterlimit="10"
        />
        <path d="M251.994 0V500" stroke="#DEE1E7" strokeWidth="3" strokeMiterlimit="10" />
      </svg>
      <div className="flex absolute inset-0 justify-center items-center w-full h-full">
        <div className="grid grid-cols-2 w-2/3">
          <div className="col-span-1">
            <div
              className="bg-neutral-200 relative aspect-square translate-x-[12%] translate-y-[12%] rounded-lg
					transition-all duration-300 group-hover:translate-y-[88%]"
            >
              <Image
                className="object-cover w-full h-full rounded-xl"
                src={avatar1.src}
                alt="Avatar"
                width={avatar1.width}
                height={avatar1.height}
              />
              <div
                className="bg-red-500 absolute -right-[10%] -top-[10%] aspect-square w-[20%] rounded-full
						transition-all duration-300 group-hover:right-[90%]"
              >
                <Image
                  className="object-cover w-full h-full"
                  src={usa.src}
                  alt="Avatar"
                  width={usa.width}
                  height={usa.height}
                />
              </div>
              <div className="absolute top-full">
                <p>$130.00</p>
                <p>130 USDC</p>
              </div>
            </div>
          </div>
          <div className="col-span-1 col-start-2 row-start-2">
            <div
              className="bg-neutral-200 relative aspect-square translate-x-[-12%] translate-y-[-12%] rounded-lg
					transition-all duration-300 group-hover:translate-y-[-88%]"
            >
              <Image
                className="object-cover w-full h-full rounded-xl"
                src={avatar2.src}
                alt="Avatar"
                width={avatar2.width}
                height={avatar2.height}
              />
              <div
                className="bg-red-500 absolute -right-[10%] -top-[10%] aspect-square w-[20%] rounded-full
						transition-all duration-300 group-hover:right-[90%]"
              >
                <Image
                  className="object-cover w-full h-full"
                  src={hk.src}
                  alt="Avatar"
                  width={hk.width}
                  height={hk.height}
                />
              </div>
              <div className="absolute top-full transition-all duration-300 group-hover:translate-x-[30%]">
                <p>Emma</p>
                <p>emmaonchain.base.eth</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute flex aspect-square w-[8%] items-center justify-center rounded-br-lg rounded-tl-lg bg-white transition-all duration-300
			group-hover:rounded-bl-lg group-hover:rounded-br-none
			group-hover:rounded-tl-none group-hover:rounded-tr-lg"
        >
          <svg
            className="transition-all duration-300 group-hover:-rotate-180"
            width="10"
            height="14"
            viewBox="0 0 10 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.65329 10.3574L9.5412 6.46949V8.56412L4.9127 13.1926L0.28418 8.5641V6.46947L4.17217 10.3575L4.17217 0.111206H5.65329L5.65329 10.3574Z"
              fill="#0A0B0D"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
