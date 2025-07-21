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
} as const;
