import { Client, Databases, Storage, ID, Permission, Role, IndexType } from 'node-appwrite';
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
const storage = new Storage(client);

const DATABASE_NAME = 'formora';
const FORMS_COLLECTION_NAME = 'forms';
const RESPONSES_COLLECTION_NAME = 'responses';
const IMAGES_BUCKET_NAME = 'images';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createDatabase() {
  console.log('\nChecking for existing database...');
  
  try {
    const dbList = await databases.list();
    const existing = dbList.databases.find(db => db.name === DATABASE_NAME);
    if (existing) {
      console.log('Using existing database:', existing.$id);
      return existing.$id;
    }

    console.log('Creating new database...');
    const database = await databases.create(ID.unique(), DATABASE_NAME);
    console.log('Database created:', database.$id);
    return database.$id;
  } catch (error) {
    throw error;
  }
}

async function createFormsCollection(databaseId: string) {
  console.log('\nChecking for existing forms collection...');
  
  let collectionId: string;
  
  try {
    const colList = await databases.listCollections(databaseId);
    const existing = colList.collections.find(col => col.name === FORMS_COLLECTION_NAME);
    if (existing) {
      console.log('Using existing collection:', existing.$id);
      collectionId = existing.$id;
    } else {
      console.log('Creating new forms collection...');
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
    }
  } catch (error) {
    throw error;
  }

  console.log('Checking and creating attributes...');

  const attributes = [
    { name: 'userId', create: () => databases.createStringAttribute(databaseId, collectionId, 'userId', 255, true) },
    { name: 'title', create: () => databases.createStringAttribute(databaseId, collectionId, 'title', 255, true) },
    { name: 'description', create: () => databases.createStringAttribute(databaseId, collectionId, 'description', 1000, false, '') },
    { name: 'style', create: () => databases.createEnumAttribute(databaseId, collectionId, 'style', ['classic', 'conversational', 'marketing', 'neo_brutalism', 'minimal'], false, 'conversational') },
    { name: 'questions', create: () => databases.createStringAttribute(databaseId, collectionId, 'questions', 100000, true) },
    { name: 'isPublished', create: () => databases.createBooleanAttribute(databaseId, collectionId, 'isPublished', false, false) },
    { name: 'createdAt', create: () => databases.createStringAttribute(databaseId, collectionId, 'createdAt', 30, true) },
    { name: 'updatedAt', create: () => databases.createStringAttribute(databaseId, collectionId, 'updatedAt', 30, true) },
  ];

  for (const attr of attributes) {
    try {
      console.log(`Creating ${attr.name} attribute...`);
      await attr.create();
      await sleep(1500);
    } catch (e) {
      if (e && typeof e === 'object' && 'code' in e && e.code === 409) {
        console.log(`${attr.name} attribute already exists`);
      } else {
        throw e;
      }
    }
  }

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

  console.log('Checking and creating indexes...');
  
  const indexes = [
    { name: 'userId_idx', fields: ['userId'], type: IndexType.Key },
    { name: 'createdAt_idx', fields: ['createdAt'], type: IndexType.Key },
    { name: 'slug_idx', fields: ['slug'], type: IndexType.Unique },
  ];

  for (const idx of indexes) {
    try {
      console.log(`Creating ${idx.name} index...`);
      await databases.createIndex(databaseId, collectionId, idx.name, idx.type, idx.fields);
      await sleep(1500);
    } catch (e) {
      if (e && typeof e === 'object' && 'code' in e && e.code === 409) {
        console.log(`${idx.name} index already exists`);
      } else {
        throw e;
      }
    }
  }

  console.log('Forms collection setup complete');
  return collectionId;
}

async function createResponsesCollection(databaseId: string) {
  console.log('\nChecking for existing responses collection...');
  
  let collectionId: string;
  
  try {
    const colList = await databases.listCollections(databaseId);
    const existing = colList.collections.find(col => col.name === RESPONSES_COLLECTION_NAME);
    if (existing) {
      console.log('Using existing collection:', existing.$id);
      collectionId = existing.$id;
    } else {
      console.log('Creating new responses collection...');
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
    }
  } catch (error) {
    throw error;
  }

  console.log('Checking and creating attributes...');

  const attributes = [
    { name: 'formId', create: () => databases.createStringAttribute(databaseId, collectionId, 'formId', 255, true) },
    { name: 'answers', create: () => databases.createStringAttribute(databaseId, collectionId, 'answers', 100000, true) },
    { name: 'ipAddress', create: () => databases.createStringAttribute(databaseId, collectionId, 'ipAddress', 255, false) },
    { name: 'submittedAt', create: () => databases.createStringAttribute(databaseId, collectionId, 'submittedAt', 30, true) },
  ];

  for (const attr of attributes) {
    try {
      console.log(`Creating ${attr.name} attribute...`);
      await attr.create();
      await sleep(1500);
    } catch (e) {
      if (e && typeof e === 'object' && 'code' in e && e.code === 409) {
        console.log(`${attr.name} attribute already exists`);
      } else {
        throw e;
      }
    }
  }

  console.log('Checking and creating indexes...');
  
  const indexes = [
    { name: 'formId_idx', fields: ['formId'], type: IndexType.Key },
    { name: 'submittedAt_idx', fields: ['submittedAt'], type: IndexType.Key },
  ];

  for (const idx of indexes) {
    try {
      console.log(`Creating ${idx.name} index...`);
      await databases.createIndex(databaseId, collectionId, idx.name, idx.type, idx.fields);
      await sleep(1500);
    } catch (e) {
      if (e && typeof e === 'object' && 'code' in e && e.code === 409) {
        console.log(`${idx.name} index already exists`);
      } else {
        throw e;
      }
    }
  }

  console.log('Responses collection setup complete');
  return collectionId;
}

async function createImagesBucket() {
  console.log('\nChecking for existing images bucket...');
  
  try {
    const bucketList = await storage.listBuckets();
    const existing = bucketList.buckets.find(b => b.name === IMAGES_BUCKET_NAME);
    if (existing) {
      console.log('Using existing bucket:', existing.$id);
      return existing.$id;
    }

    console.log('Creating new images bucket...');
    const bucket = await storage.createBucket(
      ID.unique(),
      IMAGES_BUCKET_NAME,
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false, // fileSecurity
      true,  // enabled
      undefined, // maximumFileSize
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'], // allowedFileExtensions
    );
    console.log('Bucket created:', bucket.$id);
    return bucket.$id;
  } catch (error) {
    throw error;
  }
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
    const imagesBucketId = await createImagesBucket();

    console.log('\n================================');
    console.log('Setup complete!');
    console.log('\nAdd these to your .env.local file:');
    console.log('================================');
    console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=${databaseId}`);
    console.log(`NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID=${formsCollectionId}`);
    console.log(`NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID=${responsesCollectionId}`);
    console.log(`NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=${imagesBucketId}`);
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
