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
      <div className="relative col-span-full pb-0 w-full">
        <LogoHero />
        <AnimatedTitle />
      </div>
      <div className="grid-base col-span-full w-full pt-[180px]">
        <div className="col-span-1 col-start-3">
          <div className="w-full rounded-base aspect-square">
            <Title level={TitleLevel.H2Regular}>A full stack for the onchain economy</Title>
          </div>
        </div>
        <div className="col-span-1 col-start-4">
          <div className="w-full rounded-base 5 aspect-square">
            <Text variant={TextVariant.Body}>
              Base is a full stack for the onchain economy— empowering builders, creators, and
              people everywhere to build apps, grow businesses, create what they love, and earn
              onchain.
            </Text>
          </div>
        </div>
      </div>
    </Container>
  );
}
