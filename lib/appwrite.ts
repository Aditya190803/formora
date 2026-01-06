import { Client, Databases, Account, ID, Query } from 'appwrite';
import { Form, FormResponse, Question } from './types';

const client = new Client();

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';

// Only configure if project ID is set
if (PROJECT_ID) {
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);
}

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const FORMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID || '';
export const RESPONSES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID || '';

// Check if Appwrite is configured
export const isAppwriteConfigured = () => {
  return Boolean(PROJECT_ID && DATABASE_ID && FORMS_COLLECTION_ID && RESPONSES_COLLECTION_ID);
};

export { client, ID, Query };

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  async ensureSession() {
    try {
      return await account.get();
    } catch {
      try {
        return await account.createAnonymousSession();
      } catch (error) {
        console.error('Failed to create anonymous session:', error);
        return null;
      }
    }
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  }
};

// ============================================
// FORMS SERVICE
// ============================================

export const formsService = {
  // Create a new form
  async create(data: Omit<Form, '$id' | 'createdAt' | 'updatedAt'>): Promise<Form> {
    if (!isAppwriteConfigured()) {
      throw new Error('Appwrite is not configured. Please add your credentials to .env.local');
    }
    const now = new Date().toISOString();
    const document = await databases.createDocument(
      DATABASE_ID,
      FORMS_COLLECTION_ID,
      ID.unique(),
      {
        userId: data.userId,
        title: data.title,
        description: data.description || '',
        style: data.style,
        questions: JSON.stringify(data.questions),
        isPublished: data.isPublished,
        collaborators: data.collaborators || [],
        primaryColor: data.primaryColor || '#3b82f6',
        buttonText: data.buttonText || 'Submit',
        slug: data.slug || '',
        limitOneResponse: data.limitOneResponse || false,
        createdAt: now,
        updatedAt: now,
      }
    );
    return {
      ...document,
      questions: JSON.parse(document.questions as string) as Question[],
      collaborators: document.collaborators as string[],
      primaryColor: document.primaryColor as string,
      buttonText: document.buttonText as string,
      slug: document.slug as string,
      limitOneResponse: document.limitOneResponse as boolean,
    } as unknown as Form;
  },

  // Get all forms for a user
  async listByUser(userId: string): Promise<Form[]> {
    if (!isAppwriteConfigured()) {
      console.warn('Appwrite is not configured. Returning empty list.');
      return [];
    }
    const response = await databases.listDocuments(
      DATABASE_ID,
      FORMS_COLLECTION_ID,
      [
        Query.or([
          Query.equal('userId', userId),
          Query.contains('collaborators', userId),
        ]),
        Query.orderDesc('createdAt'),
      ]
    );
    return response.documents.map(doc => ({
      ...doc,
      questions: JSON.parse(doc.questions as string) as Question[],
      collaborators: doc.collaborators as string[],
      primaryColor: doc.primaryColor as string,
      buttonText: doc.buttonText as string,
      slug: doc.slug as string,
      limitOneResponse: doc.limitOneResponse as boolean,
    })) as unknown as Form[];
  },

  // Get a single form by ID
  async getById(formId: string): Promise<Form | null> {
    if (!isAppwriteConfigured()) {
      return null;
    }
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        FORMS_COLLECTION_ID,
        formId
      );
      return {
        ...document,
        questions: JSON.parse(document.questions as string) as Question[],
        collaborators: document.collaborators as string[],
        primaryColor: document.primaryColor as string,
        buttonText: document.buttonText as string,
        slug: document.slug as string,
        limitOneResponse: document.limitOneResponse as boolean,
      } as unknown as Form;
    } catch {
      return null;
    }
  },

  // Get a form by slug
  async getBySlug(slug: string): Promise<Form | null> {
    if (!isAppwriteConfigured()) {
      return null;
    }
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        FORMS_COLLECTION_ID,
        [Query.equal('slug', slug), Query.limit(1)]
      );
      
      if (response.documents.length === 0) {
        return null;
      }

      const doc = response.documents[0];
      return {
        ...doc,
        questions: JSON.parse(doc.questions as string) as Question[],
        collaborators: doc.collaborators as string[],
        primaryColor: doc.primaryColor as string,
        buttonText: doc.buttonText as string,
        slug: doc.slug as string,
        limitOneResponse: doc.limitOneResponse as boolean,
      } as unknown as Form;
    } catch {
      return null;
    }
  },

  // Update a form
  async update(formId: string, data: Partial<Form>): Promise<Form> {
    if (!isAppwriteConfigured()) {
      throw new Error('Appwrite is not configured. Please add your credentials to .env.local');
    }
    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.style !== undefined) updateData.style = data.style;
    if (data.questions !== undefined) updateData.questions = JSON.stringify(data.questions);
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.collaborators !== undefined) updateData.collaborators = data.collaborators;
    if (data.primaryColor !== undefined) updateData.primaryColor = data.primaryColor;
    if (data.buttonText !== undefined) updateData.buttonText = data.buttonText;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.limitOneResponse !== undefined) updateData.limitOneResponse = data.limitOneResponse;

    const document = await databases.updateDocument(
      DATABASE_ID,
      FORMS_COLLECTION_ID,
      formId,
      updateData
    );
    return {
      ...document,
      questions: JSON.parse(document.questions as string) as Question[],
      collaborators: document.collaborators as string[],
      primaryColor: document.primaryColor as string,
      buttonText: document.buttonText as string,
      slug: document.slug as string,
      limitOneResponse: document.limitOneResponse as boolean,
    } as unknown as Form;
  },

  // Delete a form
  async delete(formId: string): Promise<void> {
    if (!isAppwriteConfigured()) {
      throw new Error('Appwrite is not configured. Please add your credentials to .env.local');
    }
    await databases.deleteDocument(DATABASE_ID, FORMS_COLLECTION_ID, formId);
  },

  // Toggle publish status
  async togglePublish(formId: string, isPublished: boolean): Promise<Form> {
    return this.update(formId, { isPublished });
  },
};

// ============================================
// RESPONSES SERVICE
// ============================================

export const responsesService = {
  // Submit a response
  async submit(formId: string, answers: Record<string, string | string[]>, ipAddress?: string): Promise<FormResponse> {
    if (!isAppwriteConfigured()) {
      throw new Error('Appwrite is not configured. Please add your credentials to .env.local');
    }
    const document = await databases.createDocument(
      DATABASE_ID,
      RESPONSES_COLLECTION_ID,
      ID.unique(),
      {
        formId,
        answers: JSON.stringify(answers),
        ipAddress: ipAddress || '',
        submittedAt: new Date().toISOString(),
      }
    );
    return {
      ...document,
      answers: JSON.parse(document.answers as string),
      ipAddress: document.ipAddress as string,
    } as unknown as FormResponse;
  },

  // Get all responses for a form
  async listByForm(formId: string): Promise<FormResponse[]> {
    if (!isAppwriteConfigured()) {
      return [];
    }
    const response = await databases.listDocuments(
      DATABASE_ID,
      RESPONSES_COLLECTION_ID,
      [
        Query.equal('formId', formId),
        Query.orderDesc('submittedAt'),
        Query.limit(100),
      ]
    );
    return response.documents.map(doc => ({
      ...doc,
      answers: JSON.parse(doc.answers as string),
      ipAddress: doc.ipAddress as string,
    })) as unknown as FormResponse[];
  },

  // Count responses for a form
  async countByForm(formId: string): Promise<number> {
    if (!isAppwriteConfigured()) {
      return 0;
    }
    const response = await databases.listDocuments(
      DATABASE_ID,
      RESPONSES_COLLECTION_ID,
      [
        Query.equal('formId', formId),
        Query.limit(1),
      ]
    );
    return response.total;
  },

  // Delete a response
  async delete(responseId: string): Promise<void> {
    if (!isAppwriteConfigured()) {
      throw new Error('Appwrite is not configured. Please add your credentials to .env.local');
    }
    await databases.deleteDocument(DATABASE_ID, RESPONSES_COLLECTION_ID, responseId);
  },

  // Delete all responses for a form
  async deleteAllByForm(formId: string): Promise<void> {
    const responses = await this.listByForm(formId);
    await Promise.all(responses.map(r => this.delete(r.$id!)));
  },
};
