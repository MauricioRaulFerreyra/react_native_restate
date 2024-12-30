import { Account, Avatars, Client, Databases, OAuthProvider, Query } from 'appwrite';
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser';
import { Models } from 'react-native-appwrite';

// Custom Types
interface Property extends Models.Document {
  $id: string;
  name: string;
  address: string;
  type: string;
  $createdAt: string;
}

interface Config {
  platform: string;
  endpoint?: string;
  projectId?: string;
  databaseId?: string;
  galleriesCollectionId?: string;
  reviewsCollectionId?: string;
  agentsCollectionId?: string;
  propertiesCollectionId?: string;
}

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

// Appwrite Client Configuration
export const config: Config = {
  platform: 'com.mrf.restate',
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
};

export const client = new Client();

if (!config.endpoint || !config.projectId) {
  console.error("Appwrite endpoint or project ID is missing.");
}

try {
  client
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!);
} catch (error) {
  console.error('Error configurando el cliente Appwrite:', error);
}

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

// OAuth login function
export async function login(): Promise<boolean> {
  try {
    const redirectUri = Linking.createURL('/', { scheme: config.platform });
    console.log('Redirect URI:', redirectUri); // Debugging

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );

    if (!response) throw new Error('Failed to login');

    const browserResult = await openAuthSessionAsync(response.toString(), redirectUri, {
      showInRecents: true,
      preferEphemeralSession: true,
    });

    if (browserResult.type !== 'success') throw new Error('Failed to login');

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get('secret');
    const userId = url.searchParams.get('userId');

    if (!secret || !userId) throw new Error('Failed to login: Missing secret or userId');

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error('Failed to create a session');

    return true;
  } catch (error) {
    console.error('Error during login:', error);
    return false;
  }
}

export async function logout(): Promise<boolean> {
  try {
    await account.deleteSession('current');
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const sessions = await account.listSessions();

    if (!sessions.sessions || sessions.total === 0) {
      // There is no active session, we silently return null.
      return null;
    }

    const response = await account.get();

    if (response.$id) {
      const userAvatar = avatar.getInitials(response.name);
      return {
        ...response,
        avatar: userAvatar.toString(),
      };
    }

    return null; // In case there is no user data.
  } catch (error: any) {
    // We only log errors other than session expired errors.
    if (error.code !== 401) {
      console.error('Error fetching current user:', error.message || error);
    }
    return null; // We return null so that the context correctly handles the state.
  }
}

export const buildQueryParams = ({
  filter,
  query,
  limit,
}: {
  filter?: string;
  query?: string;
  limit?: number;
}) => {
  const queries = [Query.orderDesc('$createdAt')];

  if (filter && filter !== 'All') queries.push(Query.equal('type', filter));
  if (query)
    queries.push(
      Query.or([
        Query.search('name', query),
        Query.search('address', query),
        Query.search('type', query),
      ])
    );
  if (limit) queries.push(Query.limit(limit));

  return queries;
};


export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}): Promise<Property[]> {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All") buildQuery.push(Query.equal("type", filter));

    if (query) {
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );
    }

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments<Property>(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery
    );

    return result.documents;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export async function getLatestProperties(): Promise<Property[]> {
  try {
    const result = await databases.listDocuments<Property>(
      config.databaseId!,
      config.propertiesCollectionId!,
      [Query.orderAsc('$createdAt'), Query.limit(5)]
    );

    return result.documents;
  } catch (error) {
    console.error('Error fetching latest properties:', error);
    return [];
  }
}

export async function getPropertyById({ id }: { id: string }): Promise<Property | null> {
  try {
    const result = await databases.getDocument<Property>(
      config.databaseId!,
      config.propertiesCollectionId!,
      id
    );

    return result;
  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    return null;
  }
}
