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
      <div className="flex flex-col">
        <div className="mx-auto grid w-full max-w-[1920px] grid-cols-12 gap-2 self-center px-6 md:gap-4 md:px-10 lg:px-12 xl:gap-6 xl:px-20">
          <div className="col-span-12">
            <div className="flex max-w-full flex-col items-center">
              <div className="relative mx-auto flex min-h-screen w-full max-w-[1920px] flex-col items-center justify-center overflow-hidden md:px-16">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
