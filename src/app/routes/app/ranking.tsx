// src/app/routes/app/ranking.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Prism } from '@/components/background/prism';
import { ContentLayout } from '@/components/layouts/content-layout';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useGetScores } from '@/features/home/api/get-score';
import AnimatedList from '@/features/ranking/components/animated-list';
import { BusinessCategorizationPrompt } from '@/features/ranking/components/business-prompt';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: 'easeInOut' },
} as const;

const RankingRoute = () => {
  const navigate = useNavigate();

  const storedInput = sessionStorage.getItem('rankingInput');
  const rankingInput = storedInput ? JSON.parse(storedInput) : null;

  const cachedResult = JSON.parse(
    sessionStorage.getItem('rankingResult') || 'null',
  );

  const [step, setStep] = useState(cachedResult ? 'ranking' : 'prompt');
  const [rankingData, setRankingData] = useState(cachedResult);

  const getScoresMutation = useGetScores({
    mutationConfig: {
      onSuccess: (data) => {
        sessionStorage.setItem('rankingResult', JSON.stringify(data));
        setRankingData(data);
        setStep('dealSize');
        // O setTimeout foi removido daqui
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

  const rankingDataToShow = getScoresMutation.data || rankingData;

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
        <AnimatePresence mode="wait">
          {step === 'prompt' && (
            <motion.div
              key="prompt"
              initial={variants.initial}
              animate={variants.animate}
              exit={variants.exit}
              transition={variants.transition}
            >
              <BusinessCategorizationPrompt
                initialTags={rankingInput.tags}
                onConfirm={handleConfirm}
                isLoading={getScoresMutation.isPending}
              />
            </motion.div>
          )}

          {step === 'dealSize' && (
            <motion.div
              key="dealSize"
              initial={variants.initial}
              animate={variants.animate}
              exit={variants.exit}
              transition={variants.transition}
              className="bg-glass mx-auto flex min-h-[400px] flex-col items-center justify-center gap-8 rounded-3xl p-8 text-center shadow-sm backdrop-blur-[30px]"
            >
              {rankingDataToShow?.['Deal Size'] ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex w-full flex-col items-center"
                >
                  <p className="text-h1 text-balance font-bold tracking-tight">
                    Segundo nossas estimativas, a sua empresa deve ser vendida
                    por aproximadamente:
                  </p>
                  <p className="text-h1 mt-8 font-bold text-primary">
                    {formatCurrency(rankingDataToShow['Deal Size'])}
                  </p>
                  <Button onClick={() => setStep('ranking')} className="mt-10">
                    Ver Ranking
                  </Button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-h1 font-bold tracking-tight">
                    Calculando Oportunidades...
                  </h2>
                  <Spinner size="lg" />
                </>
              )}
            </motion.div>
          )}

          {step === 'ranking' && rankingDataToShow && (
            <motion.div
              key="ranking"
              initial={variants.initial}
              animate={variants.animate}
              exit={variants.exit}
              transition={variants.transition}
            >
              <div className="bg-glass rounded-3xl p-6 shadow-sm backdrop-blur-[30px]">
                <AnimatedList
                  items={rankingDataToShow.Scores}
                  onItemSelect={(item) =>
                    window.open(item.Site, '_blank', 'noopener,noreferrer')
                  }
                  showGradients={false}
                  enableArrowNavigation={true}
                  displayScrollbar={true}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ContentLayout>
  );
};

export default RankingRoute;
