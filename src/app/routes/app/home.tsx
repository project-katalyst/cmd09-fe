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
        <div className="relative mt-40 h-[600px] overflow-hidden rounded-xl border">
          <div className="mx-32 flex h-full items-center">
            <div className="flex flex-col items-center gap-8">
              <form
                className="flex flex-col items-center gap-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  createRankingMutation.mutate({ data: { url } });
                }}
              >
                <h1 className="text-3xl font-bold">
                  Descubra quem está interessado na sua empresa!
                </h1>
                <Input
                  type="text"
                  placeholder="Digite o nome da empresa"
                  className="bg-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button
                  type="submit"
                  className="mt-4"
                  isLoading={createRankingMutation.isPending}
                >
                  Buscar
                </Button>
              </form>
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
        </div>
      </ContentLayout>
    </>
  );
};

export default HomeRoute;
