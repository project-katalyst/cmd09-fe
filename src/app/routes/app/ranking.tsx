import { useState } from 'react';
import { useLocation } from 'react-router';

import { Prism } from '@/components/background/prism';
import { ContentLayout } from '@/components/layouts/content-layout';
import AnimatedList from '@/features/ranking/components/animated-list';
import { BusinessCategorizationPrompt } from '@/features/ranking/components/business-prompt';

const RankingRoute = () => {
  const location = useLocation();
  const rankingData = location.state;
  const [isValid, setIsValid] = useState(false);

  if (!rankingData) return null;

  return (
    <ContentLayout title="Ranking">
      {/* <Spotlight /> */}
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
    </ContentLayout>
  );
};

export default RankingRoute;
