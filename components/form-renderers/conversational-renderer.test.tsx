import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConversationalRenderer } from './conversational-renderer';
import { Form } from '@/lib/types';

const mockForm: Form = {
  userId: 'user-1',
  title: 'Test Form',
  style: 'conversational',
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

describe('ConversationalRenderer', () => {
  it('renders the first question initially', () => {
    render(<ConversationalRenderer form={mockForm} onSubmit={() => {}} />);
    expect(screen.getByText('What is your name?')).toBeInTheDocument();
  });

  it('shows error when required field is empty and clicking next', async () => {
    render(<ConversationalRenderer form={mockForm} onSubmit={() => {}} />);
    fireEvent.click(screen.getByText('OK'));
    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  it('moves to the next question when valid', async () => {
    render(<ConversationalRenderer form={mockForm} onSubmit={() => {}} />);
    
    const input = screen.getByPlaceholderText('Type your answer...');
    fireEvent.change(input, { target: { value: 'John Doe' } });
    
    fireEvent.click(screen.getByText('OK'));
    
    await waitFor(() => {
      expect(screen.getByText('What is your email?')).toBeInTheDocument();
    });
  });

  it('calls onSubmit on the last question', async () => {
    const handleSubmit = vi.fn();
    render(<ConversationalRenderer form={mockForm} onSubmit={handleSubmit} />);
    
    // Question 1
    fireEvent.change(screen.getByPlaceholderText('Type your answer...'), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByText('OK'));
    
    // Wait for Question 2
    const emailInput = await screen.findByPlaceholderText('email@example.com');
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        q1: 'John Doe',
        q2: 'john@example.com',
      });
    });
  });
});
