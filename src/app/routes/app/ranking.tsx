import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Prism } from '@/components/background/prism';
import { ContentLayout } from '@/components/layouts/content-layout';
import { paths } from '@/config/paths';
import { useGetScores } from '@/features/home/api/get-score';
import AnimatedList from '@/features/ranking/components/animated-list';
import { BusinessCategorizationPrompt } from '@/features/ranking/components/business-prompt';

const RankingRoute = () => {
  const navigate = useNavigate();

  const storedInput = sessionStorage.getItem('rankingInput');
  const rankingInput = storedInput ? JSON.parse(storedInput) : null;

  const cachedResult = JSON.parse(
    sessionStorage.getItem('rankingResult') || 'null',
  );

  const [showRanking, setShowRanking] = useState(!!cachedResult);

  const getScoresMutation = useGetScores({
    mutationConfig: {
      onSuccess: (data) => {
        sessionStorage.setItem('rankingResult', JSON.stringify(data));
        setShowRanking(true);
      },
    },
  });

  const handleConfirm = (tags: Record<string, string[]>) => {
    if (!rankingInput) return;
    getScoresMutation.mutate({
      data: {
        tags: tags,
        ebitda: rankingInput.ebitda,
      },
    });
  };

  useEffect(() => {
    if (!rankingInput) {
      navigate(paths.home.getHref(), { replace: true });
    }
  }, [rankingInput, navigate]);

  if (!rankingInput) return null;

  const rankingDataToShow = getScoresMutation.data || cachedResult;

  return (
    <ContentLayout title="Ranking">
      <div className="absolute inset-0 -z-10">
        <Prism
          animationType="3drotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.2}
          glow={0.5}
        />
      </div>
      <div className="mx-4 my-8 max-w-7xl sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">
        {!showRanking ? (
          <BusinessCategorizationPrompt
            initialTags={rankingInput.tags}
            onConfirm={handleConfirm}
            isLoading={getScoresMutation.isPending}
          />
        ) : (
          <div className="bg-glass rounded-3xl p-6 shadow-sm backdrop-blur-[30px]">
            <AnimatedList
              items={rankingDataToShow?.Scores}
              onItemSelect={(item, index) => console.log(item, index)}
              showGradients={false}
              enableArrowNavigation={true}
              displayScrollbar={true}
            />
          </div>
        )}
      </div>
    </ContentLayout>
  );
};

export default RankingRoute;
