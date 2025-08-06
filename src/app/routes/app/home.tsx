import { useState } from 'react';
import { useNavigate } from 'react-router';

import { ContentLayout } from '@/components/layouts/content-layout';
import { Aurora } from '@/components/ui/aurora';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input/input';
import { useCreateRanking } from '@/features/submit-url/api/create-ranking';

const HomeRoute = () => {
  const navigate = useNavigate();

  const [url, setUrl] = useState('');

  const createRankingMutation = useCreateRanking({
    mutationConfig: {
      onSuccess: (data) => {
        navigate('/ranking', { state: data.businesses });
      },
    },
  });

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
            <form
              className="w-full max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                createRankingMutation.mutate({ data: { url } });
              }}
            >
              <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  placeholder="Digite a URL da sua empresa"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button
                  type="submit"
                  isLoading={createRankingMutation.isPending}
                >
                  Buscar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};

export default HomeRoute;
