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
        <div className="bg-glass rounded-3xl p-8 shadow-sm backdrop-blur-[30px]">
          <AnimatedList
            items={rankingData}
            onItemSelect={(item, index) => console.log(item, index)}
            showGradients={false}
            enableArrowNavigation={true}
            displayScrollbar={true}
          />
        </div>
      </AuroraBackground>
    </ContentLayout>
  );
};

export default RankingRoute;
