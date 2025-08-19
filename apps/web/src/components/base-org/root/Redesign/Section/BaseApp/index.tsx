'use client';

import {
  Section,
  ImageType,
  itemContentVariants,
} from 'apps/web/src/components/base-org/root/Redesign/Section';
import PrefixAsset from './prefix.svg';
import Image from 'next/image';
import Text from 'apps/web/src/components/base-org/typography/TextRedesign';
import { TextVariant } from 'apps/web/src/components/base-org/typography/TextRedesign/types';

import { BaseAppSocial } from './BaseAppSocial';
import { BaseAppSend } from './BaseAppSend';
import { BaseAppSms } from './BaseAppSms';

import ImageAsset from './base-app-phone.png';
import { motion, spring } from 'motion/react';
import { ParallaxScaleWrapper } from './ParallaxScaleWrapper';
import { useState } from 'react';

const img = ImageAsset as ImageType;
const prefix = PrefixAsset as ImageType;

export function SectionBaseApp() {

  const [phoneIsHovered, setPhoneIsHovered] = useState(false);
  const [socialIsHovered, setSocialIsHovered] = useState(false);
  const [smsIsHovered, setSmsIsHovered] = useState(false);
  const [sendIsHovered, setSendIsHovered] = useState(false);

  return (
    <Section content={content} >
      <div className="grid-base mb-base col-span-full min-h-[300px] md:mb-20">
        <motion.div
          variants={itemContentVariants}
          onMouseEnter={() => setPhoneIsHovered(true)} onMouseLeave={() => setPhoneIsHovered(false)}
          className="col-span-full w-full h-full md:col-span-2 md:row-span-2 flex flex-col relative"
        >
          <motion.div 
          animate={phoneIsHovered ? { backgroundColor: '#F6F6F6' } : { backgroundColor: '#FAFAFA' }}
          transition={{ type: spring, bounce: 0.3, duration: 0.3 }}
          
          className="overflow-hidden relative justify-center items-center w-full h-full rounded-lg aspect-square bg-base-gray-25 md:aspect-auto group">
            <ParallaxScaleWrapper
              parallaxMultiplier={1.05}
              maxScale={1.1}
              startingScale={1.0}
              scrollRange={{ start: 0.99, end: 0.0 }}
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
          </motion.div>
          <div className="md:absolute top-full left-0 py-3 lg:py-4 h-fit block max-w-[95%]">
            <Text variant={TextVariant.Body} className="!text-base-gray-200">
            An everything app that brings together a social network, apps, payments, and finance. One place to earn, trade, and chat with everyone, everywhere.
            </Text>
          </div>
        </motion.div>

        <motion.div 
        onMouseEnter={() => setSocialIsHovered(true)} onMouseLeave={() => setSocialIsHovered(false)}
        className="col-span-2 md:col-span-1">
          <motion.div 
          animate={socialIsHovered ? { backgroundColor: '#F6F6F6' } : { backgroundColor: '#FAFAFA' }}
          transition={{ type: spring, bounce: 0.3, duration: 0.3 }}
          className="overflow-hidden relative w-full rounded-lg aspect-square bg-base-gray-25">
            <div className="absolute inset-0 w-full h-full">
              <BaseAppSocial />
            </div>
          </motion.div>
          <div className="py-3 lg:py-4 h-fit block max-w-[95%]">
            <Text variant={TextVariant.Body} className="!text-base-gray-200">
            Your social network, onchain
            </Text>
          </div>
        </motion.div>
        <motion.div onMouseEnter={() => setSmsIsHovered(true)} onMouseLeave={() => setSmsIsHovered(false)} variants={itemContentVariants} className="col-span-2 md:col-span-1">
          <motion.div 
          animate={smsIsHovered ? { backgroundColor: '#F6F6F6' } : { backgroundColor: '#FAFAFA' }}
          transition={{ type: spring, bounce: 0.3, duration: 0.3 }}
          className="overflow-hidden relative w-full rounded-lg aspect-square bg-base-gray-25">
            <div className="absolute inset-0 w-full h-full">
              <BaseAppSms />
            </div>
          </motion.div>
          <div className="py-3 lg:py-4 h-fit block max-w-[95%]">
            <Text variant={TextVariant.Body} className="!text-base-gray-200">
            Fully encrypted messages
            </Text>
          </div>
        </motion.div>

        <motion.div
          variants={itemContentVariants}
          className="col-span-full md:col-span-2 md:col-start-3 relative"
        >
          <div className="overflow-hidden relative w-full rounded-lg aspect-square bg-base-gray-25">
            <div className="absolute inset-0 w-full h-full">
              <BaseAppSend />
            </div>
          </div>
          <div className="md:absolute top-full left-0 py-3 lg:py-4 h-fit block max-w-[95%]">
            <Text variant={TextVariant.Body} className="!text-base-gray-200">
            Send money globally for free
            </Text>
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
  // description:
  //   'An everything app that brings together a social network, apps, payments, and finance. One place to earn, trade, and chat with everyone, everywhere.',
  cta: {
    label: 'Get Base app',
    href: 'https://base.app/',
  },
};
