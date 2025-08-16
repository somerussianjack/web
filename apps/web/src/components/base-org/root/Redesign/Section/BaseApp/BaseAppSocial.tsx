import { ImageType } from 'apps/web/src/components/base-org/root/Redesign/Section';
import Image from 'next/image';

import ImageAsset1 from './social-asset-1.png';
import ImageAssetLike from './social-asset-like.png';

const img1 = ImageAsset1 as ImageType;
const img2 = ImageAssetLike as ImageType;

export function BaseAppSocial() {
  return (
    <div className="flex justify-center items-center w-full h-full group">
      <div>
        <Image
          src={img1.src}
          alt="Base App"
          width={img1.width}
          height={img1.height}
          className="mx-auto w-[50%] translate-x-[30%] rotate-[10deg] transition-all duration-300 group-hover:translate-x-[40%] group-hover:rotate-[12deg]"
          draggable={false}
          sizes="(max-width: 768px) 100vw, 650px"
          quality={99}
        />
      </div>
      <div className="flex absolute inset-0 justify-center items-center w-full h-full">
        <Image
          src={img1.src}
          alt="Base App"
          width={img1.width}
          height={img1.height}
          className="mx-auto w-[50%] transition-all duration-300 group-hover:rotate-[-8deg]"
          draggable={false}
          sizes="(max-width: 768px) 100vw, 650px"
          quality={99}
        />
      </div>
      <div className="flex absolute inset-0 z-20 justify-center items-center w-full h-full">
        <Image
          src={img2.src}
          alt="Base App"
          width={img2.width}
          height={img2.height}
          className="mx-auto w-[20%] origin-center translate-x-[-100%] translate-y-[10%] rotate-[-10deg] transition-all duration-300 group-hover:rotate-[0deg] group-hover:scale-150"
          draggable={false}
          sizes="(max-width: 768px) 100vw, 450px"
          quality={99}
        />
      </div>
    </div>
  );
}
