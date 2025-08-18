import { useCallback, useEffect, useRef, useState } from 'react';

type VideoCanvasProps = {
  src?: string;
  className?: string;
};

function VideoCanvas({ src = '', className = '' }: VideoCanvasProps) {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // State
  const [hasStartedScrubbing, setHasStartedScrubbing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [frameCache, setFrameCache] = useState<ImageData[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [debugInfo, setDebugInfo] = useState('');

  const setupCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const canvasContainer = canvasContainerRef.current;

    if (!canvas || !canvasContainer) return;

    const rect = canvasContainer.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    setCanvasWidth(width);
    setCanvasHeight(height);

    canvas.width = width;
    canvas.height = height;
  }, []);

  const setupResizeObserver = useCallback(() => {
    const canvasContainer = canvasContainerRef.current;
    const canvas = canvasRef.current;

    if (!canvasContainer) return;

    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasWidth(width);
        setCanvasHeight(height);

        if (canvas) {
          canvas.width = width;
          canvas.height = height;

          // Redraw current frame if frames are loaded
          if (framesLoaded && frameCache.length > 0) {
            const frameIndex = Math.floor(scrollProgress * (frameCache.length - 1));
            const clampedIndex = Math.max(0, Math.min(frameCache.length - 1, frameIndex));
            if (contextRef.current) {
              contextRef.current.putImageData(frameCache[clampedIndex], 0, 0);
            }
          }
        }
      }
    });

    resizeObserverRef.current.observe(canvasContainer);
  }, [framesLoaded, frameCache, scrollProgress]);

  const preloadFrames = useCallback(async () => {
    const video = videoRef.current;
    const context = contextRef.current;

    if (!video || !context) {
      console.warn('Video or context not available for frame preloading');
      return;
    }

    if (!video.duration || video.duration === 0) {
      console.warn('Video duration not available');
      return;
    }

    const duration = video.duration;
    const fps = 30; // Assuming 30fps, adjust based on your video
    const totalFramesCount = Math.floor(duration * fps);

    // Limit frames for memory management (max 200 frames for better performance)
    const maxFrames = Math.min(totalFramesCount, 200);

    const newFrameCache: ImageData[] = [];
    setLoadingProgress(0);

    // Create a temporary canvas for frame extraction
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempContext = tempCanvas.getContext('2d');

    if (!tempContext) {
      console.error('Failed to get 2D context from temporary canvas');
      return;
    }

    console.log(`Starting to preload ${maxFrames} frames from video (duration: ${duration}s)`);

    try {
      for (let i = 0; i < maxFrames; i++) {
        const timePosition = (i / (maxFrames - 1)) * duration;

        // Seek to the frame position
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`Timeout seeking to frame ${i}`));
          }, 5000); // 5 second timeout per frame

          video.onseeked = () => {
            clearTimeout(timeout);
            try {
              // Draw frame to temporary canvas
              tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

              // Calculate cover-style positioning (fill entire canvas)
              const videoAspect = video.videoWidth / video.videoHeight;
              const canvasAspect = tempCanvas.width / tempCanvas.height;

              let drawWidth, drawHeight, offsetX, offsetY;

              if (videoAspect > canvasAspect) {
                // Video is wider - scale to height and crop sides
                drawHeight = tempCanvas.height;
                drawWidth = drawHeight * videoAspect;
                offsetX = (tempCanvas.width - drawWidth) / 2;
                offsetY = 0;
              } else {
                // Video is taller - scale to width and crop top/bottom
                drawWidth = tempCanvas.width;
                drawHeight = drawWidth / videoAspect;
                offsetX = 0;
                offsetY = (tempCanvas.height - drawHeight) / 2;
              }

              tempContext.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

              // Extract and store frame data
              const frameData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
              newFrameCache.push(frameData);

              // Update progress
              setLoadingProgress((i + 1) / maxFrames);

              resolve();
            } catch (error) {
              clearTimeout(timeout);
              reject(error);
            }
          };

          video.onerror = () => {
            clearTimeout(timeout);
            reject(new Error(`Error seeking to frame ${i}`));
          };

          video.currentTime = timePosition;
        });
      }

      setFrameCache(newFrameCache);
      setFramesLoaded(true);
      setLoadingProgress(1);

      console.log(`Successfully preloaded ${newFrameCache.length} frames`);

      // Draw the first frame
      if (newFrameCache.length > 0 && context) {
        context.putImageData(newFrameCache[0], 0, 0);
      }
    } catch (error) {
      console.error('Error during frame preloading:', error);
      setLoadingProgress(0);
      setFramesLoaded(false);
    }
  }, [canvasWidth, canvasHeight]);

  const initializeVideo = useCallback(async () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    try {
      // Get canvas context
      contextRef.current = canvas.getContext('2d');

      // Create video element
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      videoRef.current = video;

      // Set up video loading
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          // Set initial frame
          video.currentTime = 0;
          resolve();
        };

        video.onerror = () => {
          console.error('Error loading video:', src);
          reject(new Error('Failed to load video'));
        };

        video.src = src;
      });

      // Start preloading frames after video metadata is loaded
      await preloadFrames();
    } catch (error) {
      console.error('Failed to initialize video:', error);
    }
  }, [src, preloadFrames]);

  const handleScroll = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;

    if (!canvas || !context || !framesLoaded || frameCache.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;

    let progress = 0;

    // Check if element is completely off-screen
    if (rect.bottom <= 0 || rect.top >= windowHeight) {
      // Element is completely outside viewport (above or below) - video at start (0%)
      progress = 0;
    } else {
      // Element is in viewport - calculate progress based on scroll position
      // Progress should be 0% when element just enters viewport and 100% when fully visible

      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        // Element is larger than viewport and fully covers it
        progress = 1;
      } else if (rect.top >= 0 && rect.bottom <= windowHeight) {
        // Element is fully visible within viewport
        progress = 1;
      } else if (rect.top > 0) {
        // Element is entering from bottom
        const visibleHeight = windowHeight - rect.top;
        progress = Math.min(1, visibleHeight / elementHeight);
      } else {
        // Element is exiting from top
        const visibleHeight = rect.bottom;
        progress = Math.min(1, visibleHeight / elementHeight);
      }
    }

    // Clamp progress between 0 and 1
    progress = Math.max(0, Math.min(1, progress));
    setScrollProgress(progress);

    // Update debug info
    setDebugInfo(
      `Progress: ${(progress * 100).toFixed(1)}% | Frame: ${Math.floor(
        progress * (frameCache.length - 1),
      )} | Rect: top=${rect.top.toFixed(0)}, bottom=${rect.bottom.toFixed(0)}`,
    );

    // Use preloaded frames for instant scrubbing
    const frameIndex = Math.floor(progress * (frameCache.length - 1));
    const clampedIndex = Math.max(0, Math.min(frameCache.length - 1, frameIndex));

    // Draw the frame instantly from cache
    context.putImageData(frameCache[clampedIndex], 0, 0);
  }, [framesLoaded, frameCache]);

  const setupIntersectionObserver = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !hasStartedScrubbing) {
          setHasStartedScrubbing(true);
          window.addEventListener('scroll', handleScroll, { passive: true });
          // Trigger initial scroll calculation
          handleScroll();
        } else if (!entry.isIntersecting && hasStartedScrubbing) {
          // Stop scrubbing when element is no longer near the viewport
          const rect = canvas.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Stop if element is far above or below viewport (with more generous margin)
          if (rect.bottom < -windowHeight || rect.top > windowHeight * 2) {
            setHasStartedScrubbing(false);
            window.removeEventListener('scroll', handleScroll);
          } else {
            // Still trigger scroll update even when not intersecting to handle off-screen cases
            handleScroll();
          }
        }
      },
      {
        threshold: [0, 0.1, 1],
        rootMargin: `${window.innerHeight}px 0px ${window.innerHeight}px 0px`,
      },
    );

    intersectionObserverRef.current.observe(canvas);
  }, [hasStartedScrubbing, handleScroll]);

  const cleanup = useCallback(() => {
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
    }

    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    if (hasStartedScrubbing) {
      window.removeEventListener('scroll', handleScroll);
    }

    if (videoRef.current) {
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
  }, [hasStartedScrubbing, handleScroll]);

  // Component lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContainer = canvasContainerRef.current;

    if (!canvas || !canvasContainer || !src) return;

    setupCanvasSize();
    setupResizeObserver();
    void initializeVideo();
    setupIntersectionObserver();

    return cleanup;
  }, [
    src,
    setupCanvasSize,
    setupResizeObserver,
    initializeVideo,
    setupIntersectionObserver,
    cleanup,
  ]);

  return (
    <div ref={canvasContainerRef} className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="block object-cover w-full h-full"
        style={{ imageRendering: 'auto' }}
      >
        Your browser does not support the canvas element.
      </canvas>

      {!framesLoaded && loadingProgress > 0 && (
        <div className="flex absolute inset-0 justify-center items-center text-white bg-black bg-opacity-75">
          <div className="text-center">
            <div className="mb-2">Loading frames...</div>
            <div className="overflow-hidden w-48 h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress * 100}%` }}
              />
            </div>
            <div className="mt-2 text-sm">{Math.round(loadingProgress * 100)}%</div>
          </div>
        </div>
      )}

      {/* Debug Info - Remove this in production */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="absolute top-2 left-2 p-2 font-mono text-xs text-white bg-black bg-opacity-75 rounded">
          {debugInfo}
        </div>
      )}
    </div>
  );
}

export default VideoCanvas;
