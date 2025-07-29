import { ContentLayout } from '@/components/layouts/content-layout';
import AnimatedList from '@/features/ranking/components/animated-list';

const RankingRoute = () => {
  const items = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10',
  ];
  return (
    <ContentLayout title="Ranking">
      <div className="mt-4 flex flex-col items-center gap-8">
        <h1>Ranking Page</h1>
        <AnimatedList
          items={items}
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
