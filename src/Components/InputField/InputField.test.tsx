import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi , test } from 'vitest';
import InputField from './InputField';

describe('InputField Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders with basic props', () => {
      render(
        <InputField
          label="Test Label"
          placeholder="Test Placeholder"
          id="test-input"
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
    });

    it('renders without label', () => {
      render(
        <InputField
          placeholder="No Label Input"
          data-testid="no-label-input"
          value=""
          onChange={() => {}}
        />
      );

      const input = screen.getByPlaceholderText('No Label Input');
      expect(input).toBeInTheDocument();
    });

    it('renders helper text', () => {
      render(
        <InputField
          label="Test"
          helperText="This is helper text"
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('renders error message', () => {
      render(
        <InputField
          label="Test"
          errorMessage="This is an error"
          invalid
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.getByText('This is an error')).toBeInTheDocument();
    });
  });

  // Variant tests
  describe('Variants', () => {
    it('renders filled variant', () => {
      render(
        <InputField variant="filled" data-testid="filled-input" value="" onChange={() => {}} />
      );
      const input = screen.getByTestId('filled-input');
      expect(input).toHaveClass('bg-slate-100');
    });

    it('renders outlined variant (default)', () => {
      render(<InputField data-testid="outlined-input" value="" onChange={() => {}} />);
      const input = screen.getByTestId('outlined-input');
      expect(input).toHaveClass('bg-white');
    });

    it('renders ghost variant', () => {
      render(
        <InputField variant="ghost" data-testid="ghost-input" value="" onChange={() => {}} />
      );
      const input = screen.getByTestId('ghost-input');
      expect(input).toHaveClass('bg-transparent');
    });
  });

  // Size tests
  describe('Sizes', () => {
    it('renders small size', () => {
      render(<InputField size="sm" data-testid="small-input" value="" onChange={() => {}} />);
      const input = screen.getByTestId('small-input');
      expect(input).toHaveClass('h-9');
    });

    it('renders medium size (default)', () => {
      render(<InputField data-testid="medium-input" value="" onChange={() => {}} />);
      const input = screen.getByTestId('medium-input');
      expect(input).toHaveClass('h-11');
    });

    it('renders large size', () => {
      render(<InputField size="lg" data-testid="large-input" value="" onChange={() => {}} />);
      const input = screen.getByTestId('large-input');
      expect(input).toHaveClass('h-13');
    });
  });

  // State tests
  describe('States', () => {
    it('handles disabled state', () => {
      render(<InputField disabled data-testid="disabled-input" value="" onChange={() => {}} />);
      const input = screen.getByTestId('disabled-input');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:cursor-not-allowed');
    });

    it('handles invalid state', () => {
      render(<InputField invalid data-testid="invalid-input" value="" onChange={() => {}} />);
      const input = screen.getByTestId('invalid-input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('handles loading state', () => {
      render(<InputField loading data-testid="loading-input" value="" onChange={() => {}} />);
      const input = screen.getByTestId('loading-input');
      expect(input).toBeDisabled();
      expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    it('calls onChange when value changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<InputField onChange={handleChange} data-testid="interactive-input" value="" />);

      const input = screen.getByTestId('interactive-input');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('shows and hides password', async () => {
      const user = userEvent.setup();

      render(
        <InputField type="password" value="secret" onChange={() => {}} data-testid="password-input" />
      );

      const input = screen.getByTestId('password-input') as HTMLInputElement;
      const toggleButton = screen.getByRole('button', { name: /show password/i });

      expect(input.type).toBe('password');

      await user.click(toggleButton);
      expect(input.type).toBe('text');

      await user.click(toggleButton);
      expect(input.type).toBe('password');
    });

    it('clears value with clear button', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(
        <InputField
          value="test value"
          onChange={handleChange}
          showClearButton
          data-testid="clearable-input"
        />
      );

      const clearButton = screen.getByRole('button', { name: /clear input/i });
      await user.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: '' }),
        })
      );
    });
  });
  // Accessibility tests
  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <InputField 
          label="Accessible Input"
          helperText="Helper text"
          id="accessible-input"
          onChange={() => {}}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'accessible-input-helper');
    });

    it('has proper ARIA attributes for errors', () => {
      render(
        <InputField 
          label="Error Input"
          errorMessage="Error message"
          invalid
          id="error-input"
          onChange={() => {}}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'error-input-error');
    });

    it('password toggle has proper labels', () => {
      render(<InputField type="password" onChange={() => {}} />);
      
      const toggleButton = screen.getByRole('button', { name: /show password/i });
      expect(toggleButton).toHaveAttribute('aria-label', 'Show password');
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    test('handles undefined/null values gracefully', () => {
      render(<InputField value={undefined} onChange={() => {}} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('does not show clear button when disabled', () => {
      render(
        <InputField 
          value="test"
          showClearButton
          disabled
          onChange={() => {}}
        />
      );

      expect(screen.queryByRole('button', { name: /clear input/i })).not.toBeInTheDocument();
    });

    test('does not show clear button when loading', () => {
      render(
        <InputField 
          value="test"
          showClearButton
          loading
          onChange={() => {}}
        />
      );

      expect(screen.queryByRole('button', { name: /clear input/i })).not.toBeInTheDocument();
    });
  });

  // Focus and blur events
  describe('Focus Events', () => {
    test('handles focus and blur events', async () => {
      const user = userEvent.setup();

      render(<InputField data-testid="focus-input" onChange={() => {}} />);
      const input = screen.getByTestId('focus-input');

      await user.click(input);
      expect(input).toHaveFocus();

      await user.tab();
      expect(input).not.toHaveFocus();
    });
  });
});