import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ClassicRenderer } from './classic-renderer';
import { Form } from '@/lib/types';

const mockForm: Form = {
  userId: 'user-1',
  title: 'Test Form',
  style: 'classic',
  isPublished: true,
  questions: [
    {
      id: 'q1',
      type: 'short_text',
      title: 'What is your name?',
      required: true,
    },
    {
      id: 'q2',
      type: 'email',
      title: 'What is your email?',
      required: false,
    },
  ],
};

describe('ClassicRenderer', () => {
  it('renders all questions', () => {
    render(<ClassicRenderer form={mockForm} onSubmit={() => {}} />);
    expect(screen.getByText('What is your name?')).toBeInTheDocument();
    expect(screen.getByText('What is your email?')).toBeInTheDocument();
  });

  it('shows error when required field is empty on submit', () => {
    render(<ClassicRenderer form={mockForm} onSubmit={() => {}} />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('calls onSubmit with answers when valid', () => {
    const handleSubmit = vi.fn();
    render(<ClassicRenderer form={mockForm} onSubmit={handleSubmit} />);
    
    const nameInput = screen.getByPlaceholderText('Your answer');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    fireEvent.click(screen.getByText('Submit'));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      q1: 'John Doe',
    });
  });
});
