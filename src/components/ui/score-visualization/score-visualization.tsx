import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const scoreVisualizationVariants = cva(
  'relative flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'size-12',
        md: 'size-16',
        lg: 'size-20',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface ScoreVisualizationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scoreVisualizationVariants> {
  score: number;
  variant: 'circular';
}

const ScoreVisualization = React.forwardRef<
  HTMLDivElement,
  ScoreVisualizationProps
>(({ className, score, variant, size, ...props }, ref) => {
  // Normalize score to 0-100 range and handle edge cases
  const normalizedScore = React.useMemo(() => {
    if (typeof score !== 'number' || isNaN(score)) return 0;
    return Math.max(0, Math.min(100, score));
  }, [score]);

  // Calculate circle properties based on size
  const circleProps = React.useMemo(() => {
    const sizeMap = {
      sm: { radius: 18, strokeWidth: 3, fontSize: 'text-xs' },
      md: { radius: 24, strokeWidth: 4, fontSize: 'text-sm' },
      lg: { radius: 30, strokeWidth: 5, fontSize: 'text-base' },
    };
    return sizeMap[size || 'md'];
  }, [size]);

  const { radius, strokeWidth, fontSize } = circleProps;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (normalizedScore / 100) * circumference;

  if (variant !== 'circular') {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(scoreVisualizationVariants({ size, className }))}
      role="img"
      aria-label={`Score: ${normalizedScore} out of 100`}
      {...props}
    >
      <svg
        className="-rotate-90"
        width="100%"
        height="100%"
        viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
      >
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="rgba(124, 255, 103, 0.9)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          style={{
            transitionDelay: '200ms',
          }}
        />
      </svg>

      {/* Score text */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center font-semibold text-white transition-all duration-500 ease-out',
          fontSize,
        )}
        style={{
          transitionDelay: '800ms',
        }}
      >
        {Math.round(normalizedScore)}%
      </div>
    </div>
  );
});

ScoreVisualization.displayName = 'ScoreVisualization';

export { ScoreVisualization, scoreVisualizationVariants };
