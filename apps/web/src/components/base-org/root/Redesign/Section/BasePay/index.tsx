'use client';

import {
  ImageType,
  itemContentVariants,
  Section,
} from 'apps/web/src/components/base-org/root/Redesign/Section';
import PrefixAsset from './prefix.svg';
import { motion } from 'motion/react';
// import { VideoPlayer } from 'apps/web/src/components/Brand/Video';
import Image from 'next/image';
import VideoCanvas from './VideoCanvas';

const prefix = PrefixAsset as ImageType;

export function SectionBasePay() {
  return (
    <Section content={content}>
      <motion.div
        className="relative col-span-full h-full max-h-[80svh] w-full items-center justify-center overflow-hidden rounded-lg bg-base-gray-25"
        variants={itemContentVariants}
      >
        {/* <VideoPlayer
          style={{ mixBlendMode: 'multiply' }}
          loop={false}
          scrollScrub
          videoSrc="/videos/basepay-shapes.mp4"
        /> */}

        <VideoCanvas src="/videos/basepay-shapes.mp4" />

        <div className="hidden absolute inset-0 justify-center items-center w-full h-full flex0">
          <div className="relative p-6 h-fit w-fit">
            <Image
              width={300}
              height={300}
              src="/images/base-pay-slide.png"
              alt="Base Pay"
              className="h-auto max-w-[300px] overflow-hidden rounded-xl object-contain"
            />
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

const content = {
  prefix: {
    src: prefix.src,
    alt: 'Base Pay',
    width: prefix.width,
    height: prefix.height,
  },
  title: 'The fastest way to pay with USDC',
  description:
    'Express checkout with global settlement at near-zero cost. Live on Shopify, coming to more stores, and available for every business to accept USDC.',
  cta: {
    label: 'Learn more',
    href: 'https://base.org/pay',
  },
};
