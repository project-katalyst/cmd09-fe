import { useLocation } from 'react-router';

import { ContentLayout } from '@/components/layouts/content-layout';
import AnimatedList from '@/features/ranking/components/animated-list';

const RankingRoute = () => {
  const location = useLocation();
  const rankingData = location.state;

  if (!rankingData) return null;

  return (
    <ContentLayout title="Ranking">
      <div className="mt-4 flex flex-col items-center gap-8">
        <h1>Ranking Page</h1>
        <AnimatedList
          items={rankingData}
          onItemSelect={(item, index) => console.log(item, index)}
          showGradients={false}
          enableArrowNavigation={true}
          displayScrollbar={true}
        />
      </div>
    </ContentLayout>
  );
};

export default RankingRoute;
