'use client';

import {
  Section,
  ImageType,
  itemContentVariants,
} from 'apps/web/src/components/base-org/root/Redesign/Section';
import PrefixAsset from './prefix.svg';
import Image from 'next/image';

import { BaseAppSocial } from './BaseAppSocial';
import { BaseAppSend } from './BaseAppSend';
import { BaseAppSms } from './BaseAppSms';

import ImageAsset from './base-app-phone.png';
import { motion } from 'motion/react';
import { ParallaxScaleWrapper } from './ParallaxScaleWrapper';

const img = ImageAsset as ImageType;
const prefix = PrefixAsset as ImageType;

export function SectionBaseApp() {
  return (
    <Section content={content}>
      <div className="grid-base mb-base col-span-full min-h-[300px]">
        <motion.div
          variants={itemContentVariants}
          className="col-span-full w-full h-full md:col-span-2 md:row-span-2"
        >
          <div className="overflow-hidden relative justify-center items-center w-full h-full rounded-lg aspect-square bg-base-gray-25 md:aspect-auto">
            <ParallaxScaleWrapper
              parallaxMultiplier={1.05}
              maxScale={1.1}
              startingScale={0.8}
              scrollRange={{ start: 0.8, end: 0.2 }}
            >
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={img.src}
                  alt="Base App"
                  width={img.width}
                  height={img.height}
                  className="mx-auto w-[90%] translate-y-[-2%]"
                  draggable={false}
                  sizes="(max-width: 768px) 100vw, 450px"
                  quality={99}
                />
              </div>
            </ParallaxScaleWrapper>
          </div>
        </motion.div>

        <motion.div className="col-span-2 md:col-span-1">
          <div className="overflow-hidden relative w-full rounded-lg aspect-square bg-base-gray-25">
            <div className="absolute inset-0 w-full h-full">
              <BaseAppSocial />
            </div>
          </div>
        </motion.div>
        <motion.div variants={itemContentVariants} className="col-span-2 md:col-span-1">
          <div className="overflow-hidden relative w-full rounded-lg aspect-square bg-base-gray-25">
            <div className="absolute inset-0 w-full h-full">
              <BaseAppSms />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemContentVariants}
          className="col-span-full md:col-span-2 md:col-start-3"
        >
          <div className="overflow-hidden relative w-full rounded-lg aspect-square bg-base-gray-25">
            <div className="absolute inset-0 w-full h-full">
              <BaseAppSend />
            </div>
          </div>
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
