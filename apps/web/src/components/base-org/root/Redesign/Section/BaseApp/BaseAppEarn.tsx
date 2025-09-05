import { motion, spring } from 'motion/react';
import { itemContentVariants } from '..';
import { useState, useEffect } from 'react';
import NumberFlow from '@number-flow/react';
import Image from 'next/image';
import { ImageType } from 'apps/web/src/components/base-org/root/Redesign/Section';

import ImageAsset1 from './social-img.png';
const img1 = ImageAsset1 as ImageType;

export function BaseAppEarn() {
  const [isHovered, setIsHovered] = useState(false);
  const [count, setCount] = useState(0);
  const targetCount = 14200;

  useEffect(() => {
    if (isHovered) {
      // Reset count when hover starts
      setCount(0);

      // Animate count from 0 to target
      const duration = 2000; // 2 seconds
      const startTime = Date.now();

      const animateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Use easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * targetCount);

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animateCount);
        }
      };

      requestAnimationFrame(animateCount);
    }
  }, [isHovered]);

  return (
    <div
      className="group flex h-full w-full items-end justify-end p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* <motion.div
        className="rounded-md bg-base-green p-2 font-mono text-5xl text-base-black"
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 1 : 0.8,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      >
        ${count.toLocaleString()}
      </motion.div> */}

      <div className="flex scale-95 flex-col gap-4 rounded-md bg-white p-2 text-lg transition-all duration-300 group-hover:scale-100">
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={img1.src}
            alt="Base App"
            width={img1.width}
            height={img1.height}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex gap-3 text-base-gray-200">
          <div className="flex items-center gap-2">
            {/* comments */}
            <svg
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.68288 15.111L2.82843 18.2998L6.44754 17.3301L7.06243 17.5735C7.97053 17.9329 8.96209 18.1313 10.0049 18.1313C14.4231 18.1313 18.0049 14.5496 18.0049 10.1313C18.0049 5.71307 14.4231 2.13135 10.0049 2.13135C5.58658 2.13135 2.00485 5.71307 2.00485 10.1313C2.00485 11.693 2.45028 13.1444 3.22016 14.3727L3.68288 15.111ZM0 21.1283L1.52553 15.4349C0.56195 13.8976 0.00485241 12.0795 0.00485241 10.1313C0.00485241 4.6085 4.48201 0.131348 10.0049 0.131348C15.5277 0.131348 20.0049 4.6085 20.0049 10.1313C20.0049 15.6542 15.5277 20.1314 10.0049 20.1314C8.70599 20.1314 7.46496 19.8837 6.32641 19.4331L0 21.1283Z"
                fill="#717886"
              />
            </svg>
            <span className="w-6">
              <AnimatedCount
                initialCount={2}
                targetCount={10}
                isActive={isHovered}
                prefix=""
                suffix=""
              />
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* repost */}
            <svg
              style={{
                filter: isHovered
                  ? 'drop-shadow(0 0 8px #008c38)'
                  : 'drop-shadow(0 0 0px #008c3800)',
              }}
              className="transition-all duration-300 group-hover:rotate-[540deg]"
              width="24"
              height="20"
              viewBox="0 0 24 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-base-gray-200 group-hover:fill-[#008c38]"
                d="M6.22018 4.85153C7.59585 3.18992 9.6743 2.13135 12 2.13135C16.1421 2.13135 19.5 5.48921 19.5 9.63135L17 9.63135L20.5 13.6313L24 9.63135H21.5C21.5 4.38464 17.2467 0.131348 12 0.131348C9.12213 0.131348 6.54315 1.411 4.801 3.43235L6.22018 4.85153Z"
              />
              <path
                className="fill-base-gray-200 group-hover:fill-[#008c38]"
                d="M12 17.1313C14.3257 17.1313 16.4042 16.0728 17.7798 14.4112L19.199 15.8303C17.4569 17.8517 14.8779 19.1313 12 19.1313C6.75329 19.1313 2.5 14.8781 2.5 9.63135H0L3.5 5.63135L7 9.63135L4.5 9.63135C4.5 13.7735 7.85786 17.1313 12 17.1313Z"
              />
            </svg>
            <span className="w-6">
              <AnimatedCount
                initialCount={6}
                targetCount={24}
                isActive={isHovered}
                prefix=""
                suffix=""
              />
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* heart */}
            <svg
              style={{
                filter: isHovered
                  ? 'drop-shadow(0 0 8px #FF2728)'
                  : 'drop-shadow(0 0 0px #FF272800)',
              }}
              className="transition-all duration-300 group-hover:scale-110"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.66823 9.52364L9.99896 18L18.338 9.52364C20.554 7.34727 20.554 3.81273 18.338 1.63636C17.8132 1.12091 17.1884 0.703636 16.4969 0.425454C15.8055 0.139091 15.0724 0 14.3226 0C13.5728 0 12.8397 0.139091 12.1483 0.425454C11.4568 0.703636 10.832 1.12091 10.3072 1.63636L9.99896 1.93091L9.69905 1.63636C9.17422 1.12091 8.54941 0.703636 7.85796 0.425454C7.16651 0.147273 6.43341 0 5.68364 0C4.93387 0 4.20077 0.147273 3.50932 0.425454C2.81787 0.703636 2.19306 1.12091 1.66823 1.63636C-0.556076 3.80455 -0.556076 7.34727 1.66823 9.52364ZM9.99967 15.1475L3.08093 8.10778L3.06695 8.0941C1.64284 6.70068 1.64677 4.45027 3.06427 3.06854L3.06963 3.06327C3.41461 2.72446 3.81906 2.45663 4.25581 2.28092C4.71821 2.09489 5.1984 2 5.68364 2C6.16888 2 6.64907 2.09489 7.11148 2.28092C7.54822 2.45663 7.95268 2.72447 8.29765 3.06327L9.9799 4.71545L11.6988 3.07287L11.7086 3.06327C12.0536 2.72446 12.458 2.45663 12.8948 2.28092L12.9042 2.27714L12.9136 2.27326C13.3511 2.09204 13.823 2 14.3226 2C14.8222 2 15.2941 2.09204 15.7317 2.27326L15.741 2.27714L15.7504 2.28092C16.1872 2.45663 16.5916 2.72446 16.9366 3.06327C18.3545 4.45577 18.3545 6.70423 16.9366 8.09673L16.9244 8.10877L9.99967 15.1475Z"
                fill="#717886"
              />
              <path
                className="opacity-0 transition-all duration-300 group-hover:opacity-100"
                d="M1.66823 9.52364L9.99896 18L18.338 9.52364C20.554 7.34727 20.554 3.81273 18.338 1.63636C17.8132 1.12091 17.1884 0.703636 16.4969 0.425454C15.8055 0.139091 15.0724 0 14.3226 0C13.5728 0 12.8397 0.139091 12.1483 0.425454C11.4568 0.703636 10.832 1.12091 10.3072 1.63636L9.99896 1.93091L9.69905 1.63636C9.17422 1.12091 8.54941 0.703636 7.85796 0.425454C7.16651 0.147273 6.43341 0 5.68364 0C4.93387 0 4.20077 0.147273 3.50932 0.425454C2.81787 0.703636 2.19306 1.12091 1.66823 1.63636C-0.556076 3.80455 -0.556076 7.34727 1.66823 9.52364Z"
                fill="#FF2728"
              />
            </svg>

            <span className="w-6">
              <AnimatedCount
                initialCount={12}
                targetCount={95}
                isActive={isHovered}
                prefix=""
                suffix=""
              />
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* pulse */}
            <svg
              style={{
                filter: isHovered
                  ? 'drop-shadow(0 0 8px #005eff)'
                  : 'drop-shadow(0 0 0px #005eff00)',
              }}
              width="22"
              className="transition-all duration-300 group-hover:scale-110"
              height="18"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-base-gray-200 group-hover:fill-[#005eff]"
                d="M13.9942 3.62856L8.93633 17.1163L7.0694 17.1312L4.17198 9.76519H0V7.76519L5.53444 7.76514L7.97772 13.9766L13.0637 0.414062L14.9377 0.417837L17.6593 7.76518H22V9.76519L16.2673 9.76519L13.9942 3.62856Z"
              />
            </svg>
            <span className="w-6">
              <AnimatedCount
                initialCount={20}
                targetCount={106}
                isActive={isHovered}
                prefix=""
                suffix=""
              />
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* share */}
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7.82838L9 3.82838L9 16.4142H11L11 3.82847L15 7.82847V5.00005L9.99995 0L5 4.99995V7.82838Z"
                fill="#717886"
              />
              <path d="M2 13.4142V18.4142H18V13.4142H20V20.4142H0V13.4142H2Z" fill="#717886" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AnimatedCountProps {
  targetCount: number;
  duration?: number;
  isActive: boolean;
  initialCount?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

function AnimatedCount({
  targetCount,
  initialCount = 0,
  duration = 600,
  isActive,
  className = '',
  prefix = '',
  suffix = '',
}: AnimatedCountProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (isActive) {
      // Reset count when animation starts
      // setCount(0);

      setCount(targetCount);

      // // Animate count from 0 to target
      // const startTime = Date.now();

      // const animateCount = () => {
      //   const elapsed = Date.now() - startTime;
      //   const progress = Math.min(elapsed / duration, 1);

      //   // Use easing function for smooth animation
      //   const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      //   const currentCount = Math.floor(easeOutQuart * targetCount);

      //   setCount(currentCount);

      //   if (progress < 1) {
      //     requestAnimationFrame(animateCount);
      //   }
      // };

      // requestAnimationFrame(animateCount);
    } else {
      setCount(initialCount);
    }
  }, [isActive, targetCount, duration]);

  return (
    <span className={className}>
      {/* {prefix}
      {count.toLocaleString()}
      {suffix} */}
      <NumberFlow willChange value={count} locales="en-US" />
    </span>
  );
}
