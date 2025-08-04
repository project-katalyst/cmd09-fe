import { useState } from 'react';
import { useNavigate } from 'react-router';

import { ContentLayout } from '@/components/layouts/content-layout';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/ui/footer';
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
        <div className="w-full max-w-6xl items-center justify-center">
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
        <Footer />
      </ContentLayout>
    </>
  );
};

export default HomeRoute;
