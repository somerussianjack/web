import Container from 'apps/web/src/components/base-org/Container';
import { AnimatedTitle } from 'apps/web/src/components/base-org/root/Redesign/Hero/AnimatedTitle';
import { LogoHero } from 'apps/web/src/components/base-org/root/Redesign/Hero/LogoHero';

export function Hero() {
  return (
    <Container className="!lg:mb-0 !mb-0 grid-cols-9 gap-y-12">
      <div className="relative col-span-full pb-0 w-full">
        <LogoHero />
        <AnimatedTitle />
      </div>
    </Container>
  );
}
