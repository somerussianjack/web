import Container from 'apps/web/src/components/base-org/Container';
import { AnimatedTitle } from 'apps/web/src/components/base-org/root/Redesign/Hero/AnimatedTitle';
import { LogoHero } from 'apps/web/src/components/base-org/root/Redesign/Hero/LogoHero';
import Title from 'apps/web/src/components/base-org/typography/TitleRedesign';
import { TitleLevel } from 'apps/web/src/components/base-org/typography/TitleRedesign/types';
import Text from 'apps/web/src/components/base-org/typography/TextRedesign';
import { TextVariant } from 'apps/web/src/components/base-org/typography/TextRedesign/types';

export function Hero() {
  return (
    <Container className="!lg:mb-0 !mb-0 grid-cols-9 gap-y-12">
      <div className="col-span-full flex h-[calc(100vh-80px)] flex-col justify-between">
        <div className="relative col-span-full pb-0 w-full">
          <LogoHero />
          <AnimatedTitle />
        </div>
        <div className="col-span-full w-full grid-base">
          <div className="col-span-2 md:col-span-1 md:col-start-3">
            <div className="w-full">
              <Title level={TitleLevel.H2Regular}>A full stack for the onchain economy</Title>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 md:col-start-4">
            <div className="w-full">
              <Text variant={TextVariant.Body}>
                Base is a full stack for the onchain economy— empowering builders, creators, and
                people everywhere to build apps, grow businesses, create what they love, and earn
                onchain.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
