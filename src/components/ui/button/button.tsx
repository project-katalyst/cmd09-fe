import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group relative overflow-hidden font-semibold disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'rounded-xl bg-primary text-primary-foreground shadow',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'rounded-xl border border-primary/20 bg-transparent shadow-sm transition-all duration-700 hover:border-primary/50',
        secondary: 'bg-card2 rounded-xl border-none shadow-sm',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-6 py-3 text-base',
        sm: 'p-3 text-xs',
        lg: 'h-12 rounded-md px-8 text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), 'group')}
        ref={ref}
        {...props}
      >
        <span className="relative flex size-full items-center justify-center overflow-hidden">
          <span className="block transition-all duration-700 ease-custom-bezier md:group-hover:-translate-y-full md:group-hover:opacity-0">
            {isLoading ? 'Carregando...' : children}
          </span>
          <span className="absolute top-full block w-full text-center transition-all duration-700 ease-custom-bezier md:group-hover:-translate-y-full md:group-hover:opacity-100">
            {isLoading ? 'Carregando...' : children}
          </span>
        </span>
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
