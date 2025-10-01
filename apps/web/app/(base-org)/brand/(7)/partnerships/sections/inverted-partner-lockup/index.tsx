import { ImageComponent, SvgImport } from 'apps/web/src/components/Brand/Image';
import SubBrandsLockupSvg from './inverted-partner-lockup.svg';

const svg = SubBrandsLockupSvg as SvgImport;

const images = [
  {
    src: svg.src,
    alt: 'Inverted Partner Lockup',
    width: svg.width,
    height: svg.height,
  },
];

export function InvertedPartnerLockup() {
  return (
    <ImageComponent
      id="inverted-partner-lockup"
      title="Inverted Partner Lockup"
      description={
        <>
          If you’re creating assets for your own launch or submitting them for Base amplification,
          your logo should come first, followed by the Base logo. This shows that Base is supporting
          your launch, while keeping both brands visible.
        </>
      }
      images={images}
    />
  );
}
