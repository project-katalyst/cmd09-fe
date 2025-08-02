import {
  randCompanyName,
  randParagraph,
  randUuid,
  randUrl,
  randImg,
} from '@ngneat/falso';

const generateRanking = () => ({
  id: randUuid() + Math.random(),
  url: randUrl(),
  businesses: Array.from({ length: 10 }, () => ({
    name: randCompanyName(),
    description: randParagraph(),
    logo: randImg(),
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
