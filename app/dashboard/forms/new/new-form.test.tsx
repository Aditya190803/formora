import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import NewFormPage from './page';
import { useRouter } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import { formsService } from '@/lib/appwrite';
import { Form } from '@/lib/types';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock Stack Auth
vi.mock('@stackframe/stack', () => ({
  useUser: vi.fn(),
}));

// Mock Appwrite service
vi.mock('@/lib/appwrite', () => ({
  formsService: {
    create: vi.fn(),
  },
  authService: {
    ensureSession: vi.fn(),
  },
  isAppwriteConfigured: vi.fn(() => true),
}));

// Mock Sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('NewFormPage', () => {
  const mockPush = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (useUser as Mock).mockReturnValue({ id: 'user-123' });
  });

  it('renders the form builder', () => {
    render(<NewFormPage />);
    expect(screen.getByText('UNTITLED FORM')).toBeInTheDocument();
    expect(screen.getByText('Add Question')).toBeInTheDocument();
  });

  it('can add a question', () => {
    render(<NewFormPage />);
    fireEvent.click(screen.getByText('Add Question'));
    fireEvent.click(screen.getByText('Short Text'));
    
    expect(screen.getByPlaceholderText('ENTER YOUR QUESTION...')).toBeInTheDocument();
  });

  it('can save a form', async () => {
    vi.mocked(formsService.create).mockResolvedValue({ $id: 'form-123' } as unknown as Form);
    
    render(<NewFormPage />);
    
    // Edit title
    fireEvent.click(screen.getByText('UNTITLED FORM'));
    const titleInput = screen.getByDisplayValue('');
    fireEvent.change(titleInput, { target: { value: 'My New Form' } });
    fireEvent.blur(titleInput);
    
    // Add a question (required for saving)
    fireEvent.click(screen.getByText('Add Question'));
    fireEvent.click(screen.getByText('Short Text'));
    const questionInput = screen.getByPlaceholderText('ENTER YOUR QUESTION...');
    fireEvent.change(questionInput, { target: { value: 'What is your name?' } });

    fireEvent.click(screen.getByText('Publish'));
    
    await waitFor(() => {
      expect(formsService.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'My New Form',
        userId: 'user-123',
      }));
    });
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/forms');
  });
});
