import { cn } from '@/lib/utils';

export const XIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-5 text-secondary', className)}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        className="fill-[#d02f2f]"
        strokeWidth="1.5"
      />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
};
