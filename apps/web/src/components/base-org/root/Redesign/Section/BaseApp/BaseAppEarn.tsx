import { motion, spring } from 'motion/react';
import { itemContentVariants } from '..';
import { useState, useEffect } from 'react';

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
      className="group flex h-full w-full items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="rounded-md bg-base-blue p-2 font-mono text-5xl text-base-white"
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
      </motion.div>
    </div>
  );
}
