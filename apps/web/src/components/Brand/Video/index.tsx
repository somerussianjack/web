'use client';

import Text from 'apps/web/src/components/base-org/typography/TextRedesign';
import { TextVariant } from 'apps/web/src/components/base-org/typography/TextRedesign/types';
import Title from 'apps/web/src/components/base-org/typography/TitleRedesign';
import { TitleLevel } from 'apps/web/src/components/base-org/typography/TitleRedesign/types';
import Container from 'apps/web/src/components/base-org/Container';
import { Aside } from '../Aside';
import { RichTextContent } from 'apps/web/src/utils/richTextContent';
import { useEffect, useRef } from 'react';
import classNames from 'classnames';

export type SvgImport = {
  src: string;
  width: number;
  height: number;
};

export type VideoGridItemProps = {
  videoSrc: string;
  posterSrc?: string;
  tag?: RichTextContent;
  loop?: boolean;
  style?: React.CSSProperties;
};

export function VideoPlayer({ videoSrc, posterSrc, tag, loop = true, style }: VideoGridItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) {
            video.src = videoSrc;
          }
          video.play().catch(() => {
            // some browsers might block autoplay, ignore error
          });
        }
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [videoSrc]);

  return (
    <div className="relative w-full h-full">
      {tag && (
        <span className="grid absolute top-2 left-2 place-items-center px-2 h-6 w-fit">
          <Text variant={TextVariant.CaptionMono} as="span" className="!text-base-gray-200">
            {tag}
          </Text>
        </span>
      )}
      <video
        ref={videoRef}
        poster={posterSrc}
        style={style}
        className="object-cover w-full h-full bg-transparent rounded-lg"
        loop={loop}
        muted
        playsInline
        preload="none"
      />
    </div>
  );
}

export type VideoComponentProps = {
  id: string;
  prefix?: string;
  title: RichTextContent;
  description?: RichTextContent;
  videos: VideoGridItemProps[];
  fullWidth?: boolean;
};

export function VideoComponent({
  id,
  prefix,
  title,
  description,
  videos = [],
  fullWidth = false,
}: VideoComponentProps) {
  const numVideos = videos.length;

  const getGridClass = () => {
    if (fullWidth) {
      if (numVideos === 2) {
        return 'md:grid-cols-2';
      }
      if (numVideos === 3) {
        return 'md:grid-cols-3';
      }
      if (numVideos >= 4) {
        return 'md:grid-cols-4';
      }
    } else if (numVideos > 1) {
      return 'md:grid-cols-2';
    }
    return null;
  };

  const videoGridContent = (
    <div
      className={classNames(
        'grid h-full w-full grid-cols-1 gap-x-8 gap-y-6 md:gap-y-12',
        getGridClass(),
        {
          '[&>*]:aspect-square': numVideos >= 4,
        },
      )}
    >
      {videos.map((video, index) => (
        <VideoPlayer key={`${video.videoSrc}-${video.tag ?? index}`} {...video} />
      ))}
    </div>
  );

  if (fullWidth) {
    return (
      <Container className="border-t border-[#0A0B0D] pt-4 md:pt-5" id={id}>
        <div className="col-span-full mb-4 grid w-full flex-1 grid-cols-12 gap-x-[min(2.25vw,_32px)] md:mb-8 lg:col-span-9 lg:grid-cols-9">
          <div className="flex flex-col col-span-full gap-2 items-start pb-4 md:col-span-3 md:pb-0">
            {prefix && (
              <Text variant={TextVariant.Body} as="span" className="text-base-gray-200">
                {prefix}
              </Text>
            )}
            <Title level={TitleLevel.H5Regular} as="h5">
              {title}
            </Title>
          </div>
          <div className="flex flex-col col-span-full gap-2 items-start md:col-span-9 lg:col-span-6">
            {description && (
              <Text variant={TextVariant.Body} as="span">
                {description}
              </Text>
            )}
          </div>
        </div>
        <div className="flex-1 col-span-full w-full h-full lg:col-span-9">{videoGridContent}</div>
      </Container>
    );
  }
  return (
    <Container className="border-t border-[#0A0B0D] pt-4 md:pt-5" id={id}>
      <Aside prefix={prefix} title={title} description={description} />
      <div className="relative flex-1 col-span-full gap-8 h-full md:col-span-9 lg:col-span-6">
        {videoGridContent}
      </div>
    </Container>
  );
}
