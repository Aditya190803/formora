import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Models } from 'appwrite';

// Mock environment variables before anything else
vi.hoisted(() => {
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID = 'test-project';
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID = 'test-db';
  process.env.NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID = 'test-forms';
  process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID = 'test-responses';
});

import { formsService, responsesService, isAppwriteConfigured } from './appwrite';
import { databases } from './appwrite';

// Mock Appwrite
vi.mock('appwrite', () => {
  const createDocument = vi.fn();
  const listDocuments = vi.fn();
  const getDocument = vi.fn();
  const updateDocument = vi.fn();
  const deleteDocument = vi.fn();

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Client: vi.fn().mockImplementation(function(this: any) {
      this.setEndpoint = vi.fn().mockReturnThis();
      this.setProject = vi.fn().mockReturnThis();
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Databases: vi.fn().mockImplementation(function(this: any) {
      this.createDocument = createDocument;
      this.listDocuments = listDocuments;
      this.getDocument = getDocument;
      this.updateDocument = updateDocument;
      this.deleteDocument = deleteDocument;
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Account: vi.fn().mockImplementation(function(this: any) {
      this.get = vi.fn();
      this.createAnonymousSession = vi.fn();
    }),
    ID: {
      unique: vi.fn(() => 'unique-id'),
    },
    Query: {
      equal: vi.fn((field, value) => ({ field, value, type: 'equal' })),
      orderDesc: vi.fn((field) => ({ field, type: 'orderDesc' })),
      limit: vi.fn((value) => ({ value, type: 'limit' })),
      or: vi.fn((queries) => ({ queries, type: 'or' })),
      contains: vi.fn((field, value) => ({ field, value, type: 'contains' })),
    },
  };
});

describe('formsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('isAppwriteConfigured returns true when env vars are set', () => {
    expect(isAppwriteConfigured()).toBe(true);
  });

  it('create calls databases.createDocument with correct parameters', async () => {
    const mockForm = {
      userId: 'user-123',
      title: 'Test Form',
      style: 'classic' as const,
      questions: [],
      isPublished: false,
    };

    const mockResponse = {
      $id: 'form-123',
      ...mockForm,
      questions: JSON.stringify([]),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.mocked(databases.createDocument).mockResolvedValue(mockResponse as unknown as Models.Document);

    const result = await formsService.create(mockForm);

    expect(databases.createDocument).toHaveBeenCalledWith(
      'test-db',
      'test-forms',
      'unique-id',
      expect.objectContaining({
        userId: 'user-123',
        title: 'Test Form',
      })
    );
    expect(result.$id).toBe('form-123');
    expect(result.questions).toEqual([]);
  });

  it('listByUser uses Query.or for collaborators', async () => {
    vi.mocked(databases.listDocuments).mockResolvedValue({
      total: 0,
      documents: [],
    } as unknown as Models.DocumentList<Models.Document>);

    await formsService.listByUser('user-123');

    expect(databases.listDocuments).toHaveBeenCalledWith(
      'test-db',
      'test-forms',
      expect.arrayContaining([
        expect.objectContaining({ type: 'or' })
      ])
    );
  });
});

describe('responsesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submit calls databases.createDocument with correct parameters', async () => {
    const mockAnswers = { q1: 'Answer 1' };
    const mockResponse = {
      $id: 'resp-123',
      formId: 'form-123',
      answers: JSON.stringify(mockAnswers),
      submittedAt: new Date().toISOString(),
    };

    vi.mocked(databases.createDocument).mockResolvedValue(mockResponse as unknown as Models.Document);

    const result = await responsesService.submit('form-123', mockAnswers);

    expect(databases.createDocument).toHaveBeenCalledWith(
      'test-db',
      'test-responses',
      'unique-id',
      expect.objectContaining({
        formId: 'form-123',
        answers: JSON.stringify(mockAnswers),
      })
    );
    expect(result.answers).toEqual(mockAnswers);
  });

  it('listByForm calls databases.listDocuments with correct filters', async () => {
    const mockResponses = {
      documents: [
        {
          $id: 'resp-1',
          answers: JSON.stringify({ q1: 'A1' }),
        },
      ],
    };

    vi.mocked(databases.listDocuments).mockResolvedValue(mockResponses as unknown as Models.DocumentList<Models.Document>);

    const result = await responsesService.listByForm('form-123');

    expect(databases.listDocuments).toHaveBeenCalledWith(
      'test-db',
      'test-responses',
      expect.arrayContaining([
        expect.objectContaining({ field: 'formId', value: 'form-123', type: 'equal' }),
      ])
    );
    expect(result[0].answers).toEqual({ q1: 'A1' });
  });
});
