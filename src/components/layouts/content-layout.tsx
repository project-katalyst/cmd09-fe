import * as React from 'react';

import { Head } from '../seo';

type ContentLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className="mx-auto max-w-[96rem] px-4 py-6 sm:px-6 md:px-8">
        {children}
      </div>
    </>
  );
};
