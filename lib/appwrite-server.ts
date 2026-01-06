import { Client, Databases, ID, Query } from 'node-appwrite';

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const API_KEY = process.env.APPWRITE_API_KEY || '';
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

export const databases = new Databases(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const FORMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID || '';
export const RESPONSES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID || '';

export { ID, Query };
