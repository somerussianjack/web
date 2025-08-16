'use client';

import { ImageType, Section } from 'apps/web/src/components/base-org/root/Redesign/Section';
import PrefixAsset from './prefix.svg';
import { Terminal } from './Terminal';
// import FaultyTerminal from './FaultyTerminal';

const prefix = PrefixAsset as ImageType;

export function SectionBaseBuilders() {
  return (
    <Section content={content}>
      <div className="relative col-span-full flex max-h-[700px] min-h-[500px] w-full items-center justify-center overflow-hidden rounded-lg md:min-h-[600px] md:bg-base-gray-25 lg:min-h-[600px] xl:min-h-[600px]">
        <div className="z-[9999]">
          <Terminal />
        </div>
        <div className="absolute inset-0 w-full h-full">
          {/* <FaultyTerminal
            className="w-full h-full"
            scale={3}
            noiseAmp={1}
            curvature={0.0}
            brightness={1.2}
            scanlineIntensity={0.0}
            tint="#8F8FFF"
          /> */}
        </div>
      </div>
    </Section>
  );
}

const content = {
  prefix: {
    src: prefix.src,
    alt: 'Base Build',
    width: prefix.width,
    height: prefix.height,
  },
  title: 'From idea to app to business',
  description:
    'Base gives builders the tools they need to build, grow, and earn from their apps, at every stage.',
  cta: {
    label: 'Start Building',
    href: 'https://base.org/build',
  },
};
