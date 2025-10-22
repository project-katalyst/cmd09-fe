import { motion, useInView } from 'framer-motion';
import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  MouseEventHandler,
  UIEvent,
  useMemo,
} from 'react';

import { Button } from '@/components/ui/button';
import { ScoreVisualization } from '@/components/ui/score-visualization';
import { cn } from '@/lib/utils';
import { Business } from '@/types/api';

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-6 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  items?: Business[];
  onItemSelect?: (item: Business, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items = [],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  displayScrollbar = true,
  initialSelectedIndex = -1,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] =
    useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);
  const summaryRefs = useRef<Map<number, HTMLParagraphElement>>(new Map());
  const [needsMore, setNeedsMore] = useState<Record<number, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {},
  );

  const toggleExpand = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b.Score - a.Score);
  }, [items]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } =
      e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1),
    );
  };

  useEffect(() => {
    const checkTruncation = () => {
      const newNeedsMore: Record<number, boolean> = {};
      summaryRefs.current.forEach((p, index) => {
        if (p && !expandedItems[index]) {
          if (p.scrollHeight > p.clientHeight) {
            newNeedsMore[index] = true;
          }
        }
      });
      setNeedsMore((prev) => ({ ...prev, ...newNeedsMore }));
    };

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(checkTruncation);
    });

    window.addEventListener('resize', checkTruncation);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', checkTruncation);
    };
  }, [sortedItems, expandedItems]);

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(
      `[data-index="${selectedIndex}"]`,
    ) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (
        itemBottom >
        containerScrollTop + containerHeight - extraMargin
      ) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth',
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={`relative w-[inherit] ${className}`}>
      <div
        ref={listRef}
        className={`max-h-[800px] overflow-y-auto px-6 py-8 ${
          displayScrollbar
            ? 'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground'
            : 'scrollbar-none'
        }`}
        onScroll={handleScroll}
      >
        {sortedItems.map((item, index) => {
          const isExpanded = !!expandedItems[index];
          const showButton = !!needsMore[index] || isExpanded;

          return (
            <AnimatedItem
              key={index}
              delay={0.1}
              index={index}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => {
                setSelectedIndex(index);
                if (onItemSelect) {
                  onItemSelect(item, index);
                }
              }}
            >
              <div
                className={cn(
                  'bg-card2 flex flex-col gap-6 rounded-3xl p-8 shadow-sm transition-all duration-300 ease-in-out sm:flex-row sm:gap-8',
                  !isExpanded ? 'sm:h-64' : 'h-auto',
                )}
              >
                <div className="flex items-center justify-between sm:flex-col sm:justify-center sm:gap-4">
                  <div className="mb-2 flex shrink-0 items-center justify-center sm:mb-0">
                    <ScoreVisualization
                      score={item.Score}
                      variant="circular"
                      size="md"
                      className="sm:size-20"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-3">
                  <h3 className="m-0 text-2xl font-bold leading-tight text-primary">
                    {item.Nome}
                  </h3>
                  <p
                    ref={(el) => {
                      if (el) summaryRefs.current.set(index, el);
                      else summaryRefs.current.delete(index);
                    }}
                    className={cn(
                      'm-0 text-base leading-relaxed text-muted-foreground transition-all duration-300',
                      !isExpanded &&
                        'overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:6]',
                    )}
                  >
                    {item.Resumo}
                  </p>
                  {showButton && (
                    <button
                      onClick={(e) => toggleExpand(e, index)}
                      className="mt-1 flex cursor-pointer items-center gap-1.5 self-start rounded-full p-1 text-primary transition-colors duration-200 hover:bg-white/10"
                      aria-label={isExpanded ? 'Show less' : 'Show more'}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                      {isExpanded && (
                        <span className="pr-2 text-sm font-medium">
                          Show less
                        </span>
                      )}
                    </button>
                  )}
                </div>
                <div className="flex items-center">
                  <a
                    href={item.Site}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="outline">Visitar</Button>
                  </a>
                </div>
              </div>
            </AnimatedItem>
          );
        })}
      </div>
      {showGradients && (
        <>
          <div
            className="ease pointer-events-none absolute inset-x-0 top-0 h-[50px] bg-gradient-to-b from-background to-transparent transition-opacity duration-300"
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className="ease pointer-events-none absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-background to-transparent transition-opacity duration-300"
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
    </div>
  );
};

export default AnimatedList;
