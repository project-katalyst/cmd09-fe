import { randCompanyName, randParagraph } from '@ngneat/falso';
import { forwardRef, useMemo } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
  title: string;
  img: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, title, img, ...rest }, ref) => {
    const businessData = useMemo(
      () => ({
        name: randCompanyName(),
        description: randParagraph({ length: 1 }),
      }),
      [],
    );

    return (
      <div
        ref={ref}
        {...rest}
        className={`absolute top-1/2 left-1/2 rounded-xl border bg-muted border-muted-foreground [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
      >
        <p className="rounded-t-lg border border-muted-foreground bg-background p-2 font-bold">
          {title}
        </p>
        <div className="flex h-auto min-h-screen">
          <div className="m-2 flex w-full max-w-4xl justify-center gap-1 rounded-md bg-gray-800 px-4 pt-8">
            <div className="mr-4 flex flex-col gap-2">
              <h3 className="font-bold text-card-foreground">
                {businessData.name}
              </h3>
              <p className="text-justify text-sm text-muted-foreground">
                {businessData.description}
              </p>
            </div>
            <img
              src={img}
              alt={`Logo da ${businessData.name}`}
              className="size-32 rounded-md object-cover ring-2 ring-ring"
            />
          </div>
        </div>
      </div>
    );
  },
);
Card.displayName = 'Card';

export { Card };
