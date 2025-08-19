import { useLocation } from 'react-router';

import { ContentLayout } from '@/components/layouts/content-layout';
import { AuroraBackground } from '@/components/ui/aurora/aurora-background';
import AnimatedList from '@/features/ranking/components/animated-list';

const RankingRoute = () => {
  const location = useLocation();
  const rankingData = location.state;

  if (!rankingData) return null;

  return (
    <ContentLayout title="Ranking">
      <AuroraBackground className="absolute inset-0">
        <div className="mx-4 my-8 max-w-5xl sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">
          <div className="bg-glass rounded-3xl p-6 shadow-sm backdrop-blur-[30px] sm:p-8 md:p-10 lg:p-12">
            <AnimatedList
              items={rankingData}
              onItemSelect={(item, index) => console.log(item, index)}
              showGradients={false}
              enableArrowNavigation={true}
              displayScrollbar={true}
            />
          </div>
        </div>
      </AuroraBackground>
    </ContentLayout>
  );
};

export default RankingRoute;
