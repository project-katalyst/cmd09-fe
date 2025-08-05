import * as React from 'react';

import { Head } from '../seo';
import { Aurora } from '../ui/aurora/aurora';

type ContentLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className="relative flex flex-col">
        <div className="absolute inset-0 -z-10">
          <Aurora
            colorStops={['#7cff67', '#B19EEF', '#5227ff']}
            blend={0.5}
            amplitude={1.0}
            speed={1.0}
          />
        </div>
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
