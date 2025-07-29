export const paths = {
  root: {
    path: '/',
    getHref: () => '/',
  },
  home: {
    path: '',
    getHref: (redirectTo?: string | null | undefined) =>
      `/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
  },
  ranking: {
    path: 'ranking',
    getHref: () => '/ranking',
  },
} as const;
