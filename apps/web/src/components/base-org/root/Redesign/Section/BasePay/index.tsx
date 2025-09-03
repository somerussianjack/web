'use client';

import {
  ImageType,
  itemContentVariants,
  Section,
} from 'apps/web/src/components/base-org/root/Redesign/Section';
import PrefixAsset from './prefix.svg';
import { motion } from 'motion/react';
import Image from 'next/image';
import VideoCanvas from './VideoCanvas';

const prefix = PrefixAsset as ImageType;

export function SectionBasePay() {
  return (
    <Section content={content}>
      <motion.div
        className="relative col-span-full aspect-[16/12] h-full w-full items-center justify-center overflow-hidden rounded-lg bg-base-gray-25 md:aspect-auto md:max-h-[80svh]"
        variants={itemContentVariants}
      >
        <VideoCanvas className="mix-blend-multiply" src="/videos/basepay-shapes.mp4" />

        <div className="absolute inset-0 flex h-full w-full items-center justify-center">
          <div className="relative h-fit w-fit p-6">
            <Image
              width={300}
              height={300}
              src="/images/base-pay-slide.png"
              alt="Base Pay"
              className="h-auto max-w-[250px] overflow-hidden rounded-xl object-contain md:max-w-[300px]"
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
