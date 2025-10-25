import { Prism } from '@/components/background/prism';
import { ContentLayout } from '@/components/layouts/content-layout';
import { InputForm } from '@/features/home/components/input-form';

const HomeRoute = () => {
  return (
    <>
      <ContentLayout title="Home">
        <div className="absolute inset-0 -z-10">
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
          />
        </div>
        <div className="absolute inset-0 -z-10"></div>
        <div className="flex w-full max-w-4xl flex-col items-center gap-8">
          <h1 className="text-h1 w-full text-center font-bold tracking-tight">
            Descubra quem está interessado na sua empresa!
          </h1>
          <p className="text-title2 mx-auto text-balance text-center">
            Descubra clientes e parceiros que já demonstram interesse no seu
            negócio. Insira o site da sua empresa e explore as oportunidades.
          </p>
        </div>
        <div className="mt-8 h-[160px] w-full md:h-[220px]">
          <div className="flex size-full flex-col items-center justify-center">
            <div className="w-full max-w-sm">
              <InputForm />
            </div>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};

export default HomeRoute;
