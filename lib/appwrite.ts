import {
  Account,
  Avatars,
  Client,
  Databases,
  OAuthProvider,
  Query,
  ID,
  Models,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { getPropertiesProps } from "@/types/type";

export const config = {
  platform: "com.brainingx.hometrack",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
  wishlistCollectionId: process.env.EXPO_PUBLIC_APPWRITE_WISHLIST_COLLECTION_ID,
};

export const client = new Client();

client.setEndpoint(config.endpoint!).setProject(config.projectId!).setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = account.createOAuth2Token(OAuthProvider.Google, redirectUri);

    if (!response) throw new Error("Create OAuth2 Token Failed.");

    const browserResult = await openAuthSessionAsync(response.toString(), redirectUri);

    if (browserResult.type !== "success") throw new Error("Create OAuth2 Token Failed.");

    const url = new URL(browserResult.url);

    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) throw new Error("Create OAuth2 Token Failed.");
    const session = await account.createSession(userId, secret);

    if (!session) throw new Error("Failed to Create Session");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const response = await account.get();
    if (response.$id) {
      const useAvatar = avatar.getInitials(response.name);

      return {
        ...response,
        avatar: useAvatar.toString(),
      };
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getLatestProperties() {
  try {
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)],
    );
    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({ filter, query, limit }: getPropertiesProps) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All") {
      buildQuery.push(Query.equal("type", filter));
    }
    if (query) {
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
          Query.contains("name", query),
          Query.contains("address", query),
          Query.contains("type", query),
        ]),
      );
    }
    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery,
    );
    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPropertyById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.propertiesCollectionId!,
      id,
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Fetches only the wishlist entries for a specific user.
 * This is a critical performance improvement.
 */
export async function getWishlistProperties({ userId }: { userId: string }) {
  if (!userId) return []; // Prevent errors if userId is not available

  try {
    const result = await databases.listDocuments(
      config.databaseId!,
      config.wishlistCollectionId!,
      [Query.equal("user_id", userId), Query.limit(100)], // Filter by user_id on the server!
    );
    // The result now contains wishlist documents, each with a 'property' relation
    // We extract the actual property data from the relation
    return result.documents.map((doc) => doc.property);
  } catch (error) {
    console.error("Error fetching wishlist properties:", error);
    return [];
  }
}

/**
 * Toggles a property's presence in the user's wishlist.
 * This function is now more robust and handles the add/remove logic cleanly.
 */
export async function toggleWishlistProperty({
  userId,
  propertyId,
}: {
  userId: string;
  propertyId: string;
}) {
  try {
    // Check if the property already exists in the user's wishlist
    const existingWishlist = await databases.listDocuments(
      config.databaseId!,
      config.wishlistCollectionId!,
      [Query.equal("user_id", userId), Query.equal("property", propertyId)],
    );

    if (existingWishlist.documents.length > 0) {
      // If it exists, remove it from the wishlist
      const documentId = existingWishlist.documents[0].$id;
      await databases.deleteDocument(config.databaseId!, config.wishlistCollectionId!, documentId);
      // Note: Updating the 'wishlisted' field on the property itself is optional.
      // A global client-side state is often a better approach for UI updates.
      return { action: "removed", propertyId };
    } else {
      // If it doesn't exist, add it to the wishlist
      const result = await databases.createDocument(
        config.databaseId!,
        config.wishlistCollectionId!,
        ID.unique(),
        {
          user_id: userId,
          property: propertyId, // This assumes 'property' is a relationship attribute
        },
      );
      return { action: "added", document: result };
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    throw new Error("Failed to update wishlist.");
  }
}

// export async function getWishlistProperties({ userId }: { userId: string }) {
//   try {
//     console.log("THe submitted user id : ", userId);
//     const result = await databases.listDocuments(config.databaseId!, config.wishlistCollectionId!);
//     return result.documents;
//   } catch (error) {
//     console.error(error);
//   }
// }

export async function createWishlistProperties({
  userId,
  propertyId,
}: {
  userId: string;
  propertyId: string;
}) {
  // Check if the property already exists in the wishlist
  const existingWishlist = await databases.listDocuments(
    config.databaseId!,
    config.wishlistCollectionId!,
    [Query.equal("user_id", userId), Query.equal("property", propertyId)],
  );

  if (existingWishlist.documents.length > 0) {
    // If it exists, remove it from the wishlist
    const documentId = existingWishlist.documents[0].$id;
    await databases.deleteDocument(config.databaseId!, config.wishlistCollectionId!, documentId);
    await databases.updateDocument(
      config.databaseId!,
      config.propertiesCollectionId!, // Replace with the actual property collection ID
      propertyId,
      { wishlisted: false },
    );
    return { action: "removed", documentId };
  } else {
    // If it doesn't exist, add it to the wishlist
    const result = await databases.createDocument(
      config.databaseId!,
      config.wishlistCollectionId!,
      ID.unique(),
      {
        user_id: userId,
        property: propertyId,
      },
    );

    await databases.updateDocument(
      config.databaseId!,
      config.propertiesCollectionId!, // Replace with the actual property collection ID
      propertyId,
      { wishlisted: true },
    );
    return { action: "created", document: result };
  }
}
