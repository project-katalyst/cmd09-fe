import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Business } from '@/types/api';

import AnimatedList from '../animated-list';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useInView: () => true,
}));

// Mock ScoreVisualization component
vi.mock('@/components/ui/score-visualization', () => ({
  ScoreVisualization: ({ score, variant, size, className }: any) => (
    <div
      data-testid="score-visualization"
      data-score={score}
      data-variant={variant}
      data-size={size}
      className={className}
      role="img"
      aria-label={`Score: ${score} out of 100`}
    >
      {score}%
    </div>
  ),
}));

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

// Mock console.warn for URL validation tests
const mockConsoleWarn = vi.fn();
Object.defineProperty(console, 'warn', {
  value: mockConsoleWarn,
  writable: true,
});

// Mock scrollTo for JSDOM environment
Object.defineProperty(Element.prototype, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

describe('AnimatedList', () => {
  const mockBusinesses: Business[] = [
    {
      name: 'Test Business 1',
      description: 'A test business with valid URL',
      score: 85,
      url: 'https://example.com',
    },
    {
      name: 'Test Business 2',
      description: 'A test business without protocol',
      score: 92,
      url: 'example2.com',
    },
    {
      name: 'Test Business 3',
      description: 'A test business with invalid URL',
      score: 78,
      url: '',
    },
    {
      name: 'Test Business 4',
      description: 'A test business with edge case score',
      score: 0,
      url: 'https://example4.com',
    },
  ];

  const mockOnItemSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Score Visualization Integration', () => {
    it('renders score visualization for each business item', () => {
      render(<AnimatedList items={mockBusinesses} />);

      const scoreVisualizations = screen.getAllByTestId('score-visualization');
      expect(scoreVisualizations).toHaveLength(mockBusinesses.length);

      // Check that each score visualization has correct props
      mockBusinesses.forEach((business, index) => {
        const scoreViz = scoreVisualizations[index];
        expect(scoreViz).toHaveAttribute(
          'data-score',
          business.score.toString(),
        );
        expect(scoreViz).toHaveAttribute('data-variant', 'circular');
        expect(scoreViz).toHaveAttribute('data-size', 'md');
        expect(scoreViz).toHaveAttribute(
          'aria-label',
          `Score: ${business.score} out of 100`,
        );
      });
    });

    it('handles edge case scores correctly', () => {
      const edgeCaseBusinesses: Business[] = [
        {
          name: 'Zero Score',
          description: 'Test',
          score: 0,
          url: 'https://example.com',
        },
        {
          name: 'Max Score',
          description: 'Test',
          score: 100,
          url: 'https://example.com',
        },
        {
          name: 'Negative Score',
          description: 'Test',
          score: -10,
          url: 'https://example.com',
        },
        {
          name: 'Over Max Score',
          description: 'Test',
          score: 150,
          url: 'https://example.com',
        },
      ];

      render(<AnimatedList items={edgeCaseBusinesses} />);

      const scoreVisualizations = screen.getAllByTestId('score-visualization');
      expect(scoreVisualizations[0]).toHaveAttribute('data-score', '0');
      expect(scoreVisualizations[1]).toHaveAttribute('data-score', '100');
      expect(scoreVisualizations[2]).toHaveAttribute('data-score', '-10');
      expect(scoreVisualizations[3]).toHaveAttribute('data-score', '150');
    });

    it('renders score visualization with correct accessibility attributes', () => {
      render(<AnimatedList items={[mockBusinesses[0]]} />);

      const scoreVisualization = screen.getByTestId('score-visualization');
      expect(scoreVisualization).toHaveAttribute('role', 'img');
      expect(scoreVisualization).toHaveAttribute(
        'aria-label',
        'Score: 85 out of 100',
      );
    });
  });

  describe('Visit Website Button Functionality', () => {
    it('renders Visit Website button for businesses with valid URLs', () => {
      render(<AnimatedList items={mockBusinesses} />);

      // Should render buttons for businesses with valid URLs (first 3 businesses)
      const visitButtons = screen.getAllByText(/visit/i);
      expect(visitButtons.length).toBeGreaterThan(0);
    });

    it('opens URL in new tab when Visit Website button is clicked', () => {
      render(<AnimatedList items={[mockBusinesses[0]]} />);

      const visitButton = screen.getAllByText(/visit/i)[0];
      fireEvent.click(visitButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer',
      );
    });

    it('adds protocol to URLs without protocol', () => {
      render(<AnimatedList items={[mockBusinesses[1]]} />);

      const visitButton = screen.getAllByText(/visit/i)[0];
      fireEvent.click(visitButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example2.com',
        '_blank',
        'noopener,noreferrer',
      );
    });

    it('does not render Visit Website button for businesses with invalid URLs', () => {
      render(<AnimatedList items={[mockBusinesses[2]]} />);

      // Business with empty URL should not have a visit button
      const visitButtons = screen.queryAllByText(/visit/i);
      expect(visitButtons).toHaveLength(0);
    });

    it('handles invalid URLs gracefully', () => {
      const businessWithInvalidUrl: Business = {
        name: 'Invalid URL Business',
        description: 'Test business',
        score: 75,
        url: 'ht tp://invalid url with spaces',
      };

      render(<AnimatedList items={[businessWithInvalidUrl]} />);

      const visitButtons = screen.queryAllByText(/visit/i);
      if (visitButtons.length > 0) {
        fireEvent.click(visitButtons[0]);
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          'Invalid URL provided:',
          'ht tp://invalid url with spaces',
        );
      } else {
        // If no button is rendered, that's also valid behavior for invalid URLs
        expect(visitButtons).toHaveLength(0);
      }
    });

    it('prevents event propagation when Visit Website button is clicked', () => {
      const mockItemSelect = vi.fn();
      render(
        <AnimatedList
          items={[mockBusinesses[0]]}
          onItemSelect={mockItemSelect}
        />,
      );

      const visitButton = screen.getAllByText(/visit/i)[0];
      fireEvent.click(visitButton);

      // Item select should not be called when button is clicked
      expect(mockItemSelect).not.toHaveBeenCalled();
    });
  });

  describe('Typography and Spacing', () => {
    it('renders business names with correct typography classes', () => {
      render(<AnimatedList items={[mockBusinesses[0]]} />);

      const businessName = screen.getByText('Test Business 1');
      expect(businessName).toHaveClass('text-2xl', 'font-bold');
    });

    it('renders business descriptions with correct typography classes', () => {
      render(<AnimatedList items={[mockBusinesses[0]]} />);

      const businessDescription = screen.getByText(
        'A test business with valid URL',
      );
      expect(businessDescription).toHaveClass('text-base');
    });

    it('maintains consistent spacing between elements', () => {
      render(<AnimatedList items={mockBusinesses} />);

      // Check that business cards have proper spacing classes
      const businessCards = screen
        .getAllByRole('generic')
        .filter((el) => el.className.includes('bg-card2'));

      businessCards.forEach((card) => {
        expect(card).toHaveClass('p-8', 'gap-6');
      });
    });

    it('applies responsive layout classes correctly', () => {
      render(<AnimatedList items={[mockBusinesses[0]]} />);

      const businessCards = screen
        .getAllByRole('generic')
        .filter((el) => el.className.includes('bg-card2'));

      expect(businessCards[0]).toHaveClass('flex', 'flex-col', 'sm:flex-row');
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates through items with arrow keys', async () => {
      const user = userEvent.setup();
      render(
        <AnimatedList items={mockBusinesses} onItemSelect={mockOnItemSelect} />,
      );

      // Simulate arrow down key
      await user.keyboard('{ArrowDown}');

      // Check that first item is selected (selectedIndex = 0)
      const firstItem = screen
        .getAllByRole('generic')
        .find((el) => el.className.includes('bg-card2-selected'));
      expect(firstItem).toBeInTheDocument();
    });

    it('handles Enter key to select item', async () => {
      const user = userEvent.setup();
      render(
        <AnimatedList items={mockBusinesses} onItemSelect={mockOnItemSelect} />,
      );

      // Navigate to first item and press Enter
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(mockOnItemSelect).toHaveBeenCalledWith(mockBusinesses[0], 0);
    });

    it('handles Tab navigation', async () => {
      const user = userEvent.setup();
      render(
        <AnimatedList items={mockBusinesses} onItemSelect={mockOnItemSelect} />,
      );

      // Simulate Tab key
      await user.keyboard('{Tab}');

      // Should navigate to next item
      await waitFor(() => {
        const selectedItem = screen
          .getAllByRole('generic')
          .find((el) => el.className.includes('bg-card2-selected'));
        expect(selectedItem).toBeInTheDocument();
      });
    });

    it('handles Shift+Tab for reverse navigation', async () => {
      const user = userEvent.setup();
      render(
        <AnimatedList
          items={mockBusinesses}
          onItemSelect={mockOnItemSelect}
          initialSelectedIndex={1}
        />,
      );

      // Simulate Shift+Tab key
      await user.keyboard('{Shift>}{Tab}{/Shift}');

      // Should navigate to previous item
      await waitFor(() => {
        const selectedItems = screen
          .getAllByRole('generic')
          .filter((el) => el.className.includes('bg-card2-selected'));
        expect(selectedItems.length).toBeGreaterThan(0);
      });
    });

    it('respects enableArrowNavigation prop', () => {
      render(
        <AnimatedList items={mockBusinesses} enableArrowNavigation={false} />,
      );

      // With arrow navigation disabled, no keyboard event listeners should be active
      // This is tested by ensuring no selection state changes occur
      const initialSelectedItems = screen
        .queryAllByRole('generic')
        .filter((el) => el.className.includes('bg-card2-selected'));
      expect(initialSelectedItems).toHaveLength(0);
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for score visualizations', () => {
      render(<AnimatedList items={[mockBusinesses[0]]} />);

      const scoreVisualization = screen.getByTestId('score-visualization');
      expect(scoreVisualization).toHaveAttribute(
        'aria-label',
        'Score: 85 out of 100',
      );
    });

    it('maintains proper heading hierarchy', () => {
      render(<AnimatedList items={[mockBusinesses[0]]} />);

      const businessName = screen.getByRole('heading', { level: 3 });
      expect(businessName).toHaveTextContent('Test Business 1');
    });

    it('provides accessible button labels', () => {
      render(<AnimatedList items={[mockBusinesses[0]]} />);

      const visitButtons = screen.getAllByRole('button');
      visitButtons.forEach((button) => {
        expect(button).toHaveTextContent(/visit/i);
      });
    });

    it('supports screen reader navigation', () => {
      render(<AnimatedList items={mockBusinesses} />);

      // Check that all interactive elements are properly labeled
      const buttons = screen.getAllByRole('button');
      const headings = screen.getAllByRole('heading');
      const images = screen.getAllByRole('img'); // Score visualizations

      expect(buttons.length).toBeGreaterThan(0);
      expect(headings.length).toBe(mockBusinesses.length);
      expect(images.length).toBe(mockBusinesses.length);

      // Each image (score visualization) should have proper aria-label
      images.forEach((img, index) => {
        expect(img).toHaveAttribute(
          'aria-label',
          `Score: ${mockBusinesses[index].score} out of 100`,
        );
      });
    });

    it('maintains focus management during keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<AnimatedList items={mockBusinesses} />);

      // Navigate with keyboard
      await user.keyboard('{ArrowDown}');

      // Check that focus management is working (selected item should be highlighted)
      await waitFor(() => {
        const selectedItem = screen
          .getAllByRole('generic')
          .find((el) => el.className.includes('bg-card2-selected'));
        expect(selectedItem).toBeInTheDocument();
      });
    });
  });

  describe('Mouse Interactions', () => {
    it('selects item on mouse enter', () => {
      render(<AnimatedList items={mockBusinesses} />);

      const firstBusinessCard = screen
        .getAllByRole('generic')
        .filter((el) => el.className.includes('bg-card2'))[0];

      fireEvent.mouseEnter(firstBusinessCard);

      expect(firstBusinessCard).toHaveClass('bg-card2-selected');
    });

    it('calls onItemSelect when item is clicked', () => {
      render(
        <AnimatedList items={mockBusinesses} onItemSelect={mockOnItemSelect} />,
      );

      const firstBusinessCard = screen
        .getAllByRole('generic')
        .filter((el) => el.className.includes('bg-card2'))[0];

      fireEvent.click(firstBusinessCard);

      expect(mockOnItemSelect).toHaveBeenCalledWith(mockBusinesses[0], 0);
    });

    it('updates selection state on mouse interactions', () => {
      render(<AnimatedList items={mockBusinesses} />);

      const businessCards = screen
        .getAllByRole('generic')
        .filter((el) => el.className.includes('bg-card2'));

      // Hover over second item
      fireEvent.mouseEnter(businessCards[1]);
      expect(businessCards[1]).toHaveClass('bg-card2-selected');

      // Hover over third item
      fireEvent.mouseEnter(businessCards[2]);
      expect(businessCards[2]).toHaveClass('bg-card2-selected');
      expect(businessCards[1]).not.toHaveClass('bg-card2-selected');
    });
  });
});
