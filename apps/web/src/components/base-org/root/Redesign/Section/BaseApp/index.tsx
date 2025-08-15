'use client';

import {
  Section,
  ImageType,
  itemContentVariants,
} from 'apps/web/src/components/base-org/root/Redesign/Section';
import PrefixAsset from './prefix.svg';
import Image from 'next/image';
import ImageAsset from './asset.png';
import { motion } from 'motion/react';

const img = ImageAsset as ImageType;
const prefix = PrefixAsset as ImageType;

export function SectionBaseApp() {
  return (
    <Section content={content}>
      <div className="grid-base mb-base col-span-full min-h-[300px]">
        <motion.div variants={itemContentVariants} className="col-span-2 row-span-2 w-full h-full">
          <div className="overflow-hidden justify-center items-center w-full h-full rounded-lg bg-base-gray-25">
            <Image
              src={img.src}
              alt="Base App"
              width={img.width}
              height={img.height}
              className="mx-auto w-[70%] translate-y-[15%]"
              draggable={false}
              sizes="(max-width: 768px) 100vw, 450px"
              quality={99}
            />
          </div>
        </motion.div>

        <motion.div className="col-span-1">
          <div className="w-full rounded-base aspect-square bg-base-gray-25">
            <p>PHONE</p>
          </div>
        </motion.div>
        <motion.div variants={itemContentVariants} className="col-span-1">
          <div className="w-full rounded-base aspect-square bg-base-gray-25">
            <p>PHONE</p>
          </div>
        </motion.div>

        <motion.div variants={itemContentVariants} className="col-span-2 col-start-3">
          <div className="w-full rounded-base aspect-square bg-base-gray-25">Big</div>
        </motion.div>
      </div>
    </Section>
  );
}

const content = {
  prefix: {
    src: prefix.src,
    alt: 'Base App',
    width: prefix.width,
    height: prefix.height,
  },
  title: 'Post, trade, chat, and earn — all in one place',
  description:
    'An everything app that brings together a social network, apps, payments, and finance. One place to earn, trade, and chat with everyone, everywhere.',
  cta: {
    label: 'Get Base app',
    href: 'https://base.app/',
  },
};
