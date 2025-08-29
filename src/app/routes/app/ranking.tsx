import { useState } from 'react';
import { useLocation } from 'react-router';

import { ContentLayout } from '@/components/layouts/content-layout';
import { AuroraBackground } from '@/components/ui/aurora/aurora-background';
import AnimatedList from '@/features/ranking/components/animated-list';
import { BusinessCategorizationPrompt } from '@/features/ranking/components/business-prompt';

const RankingRoute = () => {
  const location = useLocation();
  const rankingData = location.state;
  const [isValid, setIsValid] = useState(false);

  if (!rankingData) return null;

  return (
    <ContentLayout title="Ranking">
      <AuroraBackground className="absolute inset-0">
        <div className="mx-4 my-8 max-w-5xl sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">
          {!isValid ? (
            <BusinessCategorizationPrompt
              tagList={rankingData.tags}
              onConfirm={() => setIsValid(true)}
            />
          ) : (
            <div className="bg-glass rounded-3xl p-6 shadow-sm backdrop-blur-[30px]">
              <AnimatedList
                items={rankingData.businesses}
                onItemSelect={(item, index) => console.log(item, index)}
                showGradients={false}
                enableArrowNavigation={true}
                displayScrollbar={true}
              />
            </div>
          )}
        </div>
      </AuroraBackground>
    </ContentLayout>
  );
};

export default RankingRoute;
