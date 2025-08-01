import { useState } from 'react';
import { useNavigate } from 'react-router';

import { ContentLayout } from '@/components/layouts/content-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input/input';
import { useCreateRanking } from '@/features/ranking/api/create-ranking';
import CardSwap, { Card } from '@/features/ranking/card-swap';

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
        <div className="relative mx-auto flex min-h-screen w-full max-w-[1920px] flex-col items-center justify-center overflow-hidden md:px-16">
          <div className="flex w-full max-w-4xl flex-col items-center gap-8">
            <h1 className="text-h1 w-full text-center font-bold tracking-tight">
              Descubra quem está interessado na sua empresa!
            </h1>
            <p className="text-title2 mx-auto text-balance text-center">
              Descubra clientes e parceiros que já demonstram interesse no seu
              negócio. Insira o nome da sua empresa e explore as oportunidades.
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
                    placeholder="Digite o nome da empresa"
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
          <CardSwap
            cardDistance={60}
            verticalDistance={70}
            delay={8000}
            pauseOnHover={true}
          >
            <Card>
              <h3>Card 1</h3>
              <p>Your content here</p>
            </Card>
            <Card>
              <h3>Card 2</h3>
              <p>Your content here</p>
            </Card>
            <Card>
              <h3>Card 3</h3>
              <p>Your content here</p>
            </Card>
          </CardSwap>
        </div>
      </ContentLayout>
    </>
  );
};

export default HomeRoute;
