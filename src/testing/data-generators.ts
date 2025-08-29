import {
  randCompanyName,
  randParagraph,
  randUuid,
  randUrl,
  randImg,
  randProductCategory,
  randNumber,
} from '@ngneat/falso';

const generateRanking = () => ({
  id: randUuid() + Math.random(),
  url: randUrl(),
  tags: Array.from({ length: 5 }, () => randProductCategory()),
  businesses: Array.from({ length: 10 }, () => ({
    name: randCompanyName(),
    description: randParagraph(),
    logo: randImg(),
    score: randNumber({ min: 0, max: 100 }),
    url: randUrl(),
  })),
  createdAt: Date.now(),
});

export const createRanking = <
  T extends Partial<ReturnType<typeof generateRanking>>,
>(
  overrides?: T,
) => {
  return { ...generateRanking(), ...overrides };
};
