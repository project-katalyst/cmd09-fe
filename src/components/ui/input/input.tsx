import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'w-full rounded-full border px-4 py-3 text-primary disabled:opacity-50 placeholder:text-muted-foreground bg-input/30 border-input shadow-sm transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
