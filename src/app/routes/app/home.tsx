import { ContentLayout } from '@/components/layouts/content-layout';
import { Aurora } from '@/components/ui/aurora';
import { InputForm } from '@/features/home/components/input-form';

const HomeRoute = () => {
  return (
    <>
      <ContentLayout title="Home">
        <div className="absolute inset-0 -z-10">
          <Aurora
            colorStops={['#7cff67', '#B19EEF', '#5227ff']}
            blend={0.5}
            amplitude={1.0}
            speed={1.0}
          />
        </div>
        <div className="flex w-full max-w-4xl flex-col items-center gap-8">
          <h1 className="text-h1 w-full text-center font-bold tracking-tight">
            Descubra quem está interessado na sua empresa!
          </h1>
          <p className="text-title2 mx-auto text-balance text-center">
            Descubra clientes e parceiros que já demonstram interesse no seu
            negócio. Insira o site da sua empresa e explore as oportunidades.
          </p>
        </div>
        <div className="h-[160px] w-full md:h-[220px]">
          <div className="flex size-full flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <InputForm />
            </div>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};

export default HomeRoute;
