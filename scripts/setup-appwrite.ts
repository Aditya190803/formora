import { Client, Databases, ID, Permission, Role, IndexType } from 'node-appwrite';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

// Configuration
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';

if (!APPWRITE_PROJECT_ID) {
  console.error('Error: NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set');
  console.log('\nPlease set it in your .env.local file');
  process.exit(1);
}

if (!APPWRITE_API_KEY) {
  console.error('Error: APPWRITE_API_KEY is not set');
  console.log('\nTo get an API key:');
  console.log('1. Go to your Appwrite project dashboard');
  console.log('2. Click on Settings -> API Keys');
  console.log('3. Create a new API key with database scopes');
  process.exit(1);
}

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_NAME = 'formora';
const FORMS_COLLECTION_NAME = 'forms';
const RESPONSES_COLLECTION_NAME = 'responses';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createDatabase() {
  console.log('\nCreating database...');
  
  try {
    const database = await databases.create(ID.unique(), DATABASE_NAME);
    console.log('Database created:', database.$id);
    return database.$id;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 409) {
      console.log('Database already exists, fetching...');
      const dbList = await databases.list();
      const existing = dbList.databases.find(db => db.name === DATABASE_NAME);
      if (existing) {
        console.log('Using existing database:', existing.$id);
        return existing.$id;
      }
    }
    throw error;
  }
}

async function createFormsCollection(databaseId: string) {
  console.log('\nCreating forms collection...');
  
  let collectionId: string;
  
  try {
    const collection = await databases.createCollection(
      databaseId,
      ID.unique(),
      FORMS_COLLECTION_NAME,
      [
        Permission.create(Role.users()),
        Permission.read(Role.any()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    collectionId = collection.$id;
    console.log('Collection created:', collectionId);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 409) {
      console.log('Collection already exists, fetching...');
      const colList = await databases.listCollections(databaseId);
      const existing = colList.collections.find(col => col.name === FORMS_COLLECTION_NAME);
      if (existing) {
        collectionId = existing.$id;
        console.log('Using existing collection:', collectionId);
        return collectionId;
      }
    }
    throw error;
  }

  console.log('Creating attributes...');

  await databases.createStringAttribute(databaseId, collectionId, 'userId', 255, true);
  await sleep(1500);
  
  await databases.createStringAttribute(databaseId, collectionId, 'title', 255, true);
  await sleep(1500);
  
  await databases.createStringAttribute(databaseId, collectionId, 'description', 1000, false, '');
  await sleep(1500);
  
  await databases.createEnumAttribute(databaseId, collectionId, 'style', ['classic', 'conversational', 'marketing', 'neo_brutalism', 'minimal'], true, 'conversational');
  await sleep(1500);
  
  await databases.createStringAttribute(databaseId, collectionId, 'questions', 100000, true);
  await sleep(1500);
  
  await databases.createBooleanAttribute(databaseId, collectionId, 'isPublished', true, false);
  await sleep(1500);
  
  await databases.createStringAttribute(databaseId, collectionId, 'createdAt', 30, true);
  await sleep(1500);
  
  await databases.createStringAttribute(databaseId, collectionId, 'updatedAt', 30, true);
  await sleep(1500);

  try {
    console.log('Creating primaryColor attribute...');
    await databases.createStringAttribute(databaseId, collectionId, 'primaryColor', 7, false, '#3b82f6');
    await sleep(1500);
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 409) console.log('primaryColor attribute already exists');
    else throw e;
  }

  try {
    console.log('Creating buttonText attribute...');
    await databases.createStringAttribute(databaseId, collectionId, 'buttonText', 50, false, 'Submit');
    await sleep(1500);
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 409) console.log('buttonText attribute already exists');
    else throw e;
  }

  try {
    console.log('Creating collaborators attribute...');
    await databases.createStringAttribute(databaseId, collectionId, 'collaborators', 255, false, undefined, true);
    await sleep(1500);
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 409) console.log('Collaborators attribute already exists');
    else throw e;
  }

  try {
    console.log('Creating slug attribute...');
    await databases.createStringAttribute(databaseId, collectionId, 'slug', 255, false);
    await sleep(1500);
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === 409) console.log('slug attribute already exists');
    else throw e;
  }

  try {
    console.log('Creating limitOneResponse attribute...');
    await databases.createBooleanAttribute(databaseId, collectionId, 'limitOneResponse', false, false);
    await sleep(1500);
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === 409) console.log('limitOneResponse attribute already exists');
    else throw e;
  }

  try {
    console.log('Creating backgroundColor attribute...');
    await databases.createStringAttribute(databaseId, collectionId, 'backgroundColor', 7, false, '#ffffff');
    await sleep(1500);
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === 409) console.log('backgroundColor attribute already exists');
    else throw e;
  }

  try {
    console.log('Creating textColor attribute...');
    await databases.createStringAttribute(databaseId, collectionId, 'textColor', 7, false, '#000000');
    await sleep(1500);
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === 409) console.log('textColor attribute already exists');
    else throw e;
  }

  try {
    console.log('Creating fontFamily attribute...');
    await databases.createStringAttribute(databaseId, collectionId, 'fontFamily', 20, false, 'sans');
    await sleep(1500);
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === 409) console.log('fontFamily attribute already exists');
    else throw e;
  }

  try {
    console.log('Creating backgroundImage attribute...');
    await databases.createStringAttribute(databaseId, collectionId, 'backgroundImage', 1000, false);
    await sleep(1500);
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === 409) console.log('backgroundImage attribute already exists');
    else throw e;
  }

  try {
    console.log('Creating animationSpeed attribute...');
    await databases.createFloatAttribute(databaseId, collectionId, 'animationSpeed', false, 0.1, 2.0, 0.4);
    await sleep(1500);
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === 409) console.log('animationSpeed attribute already exists');
    else throw e;
  }
  
  await sleep(2000);

  console.log('Creating indexes...');
  
  await databases.createIndex(databaseId, collectionId, 'userId_idx', IndexType.Key, ['userId']);
  await sleep(1500);
  
  await databases.createIndex(databaseId, collectionId, 'createdAt_idx', IndexType.Key, ['createdAt']);
  await sleep(1500);

  await databases.createIndex(databaseId, collectionId, 'slug_idx', IndexType.Unique, ['slug']);
  await sleep(1500);

  console.log('Forms collection setup complete');
  return collectionId;
}

async function createResponsesCollection(databaseId: string) {
  console.log('\nCreating responses collection...');
  
  let collectionId: string;
  
  try {
    const collection = await databases.createCollection(
      databaseId,
      ID.unique(),
      RESPONSES_COLLECTION_NAME,
      [
        Permission.create(Role.any()),
        Permission.read(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    collectionId = collection.$id;
    console.log('Collection created:', collectionId);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 409) {
      console.log('Collection already exists, fetching...');
      const colList = await databases.listCollections(databaseId);
      const existing = colList.collections.find(col => col.name === RESPONSES_COLLECTION_NAME);
      if (existing) {
        collectionId = existing.$id;
        console.log('Using existing collection:', collectionId);
        return collectionId;
      }
    }
    throw error;
  }

  console.log('Creating attributes...');

  await databases.createStringAttribute(databaseId, collectionId, 'formId', 255, true);
  await sleep(1500);
  
  await databases.createStringAttribute(databaseId, collectionId, 'answers', 100000, true);
  await sleep(1500);

  await databases.createStringAttribute(databaseId, collectionId, 'ipAddress', 255, false);
  await sleep(1500);
  
  await databases.createStringAttribute(databaseId, collectionId, 'submittedAt', 30, true);
  await sleep(2000);

  console.log('Creating indexes...');
  
  await databases.createIndex(databaseId, collectionId, 'formId_idx', IndexType.Key, ['formId']);
  await sleep(1500);
  
  await databases.createIndex(databaseId, collectionId, 'submittedAt_idx', IndexType.Key, ['submittedAt']);
  await sleep(1500);

  console.log('Responses collection setup complete');
  return collectionId;
}

async function main() {
  console.log('Formora - Appwrite Setup Script');
  console.log('================================');
  console.log('Endpoint:', APPWRITE_ENDPOINT);
  console.log('Project:', APPWRITE_PROJECT_ID);

  try {
    const databaseId = await createDatabase();
    const formsCollectionId = await createFormsCollection(databaseId);
    const responsesCollectionId = await createResponsesCollection(databaseId);

    console.log('\n================================');
    console.log('Setup complete!');
    console.log('\nAdd these to your .env.local file:');
    console.log('================================');
    console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=${databaseId}`);
    console.log(`NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID=${formsCollectionId}`);
    console.log(`NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID=${responsesCollectionId}`);
    console.log('');

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('\nSetup failed:', message);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Response:', (error as { response: unknown }).response);
    }
    process.exit(1);
  }
}

main();
