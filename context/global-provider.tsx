import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAppwrite } from "@/lib/useAppwrite";
import { getCurrentUser, getWishlistProperties } from "@/lib/appwrite";
import { GlobalContextType, GlobalProviderProps } from "@/types/type";

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const { data: user, loading, refetch } = useAppwrite({ fn: getCurrentUser });

  const isLoggedIn = !!user;

  console.log(JSON.stringify(user, null, 2));
  // --- NEW ---
  const [wishlist, setWishlist] = useState<string[]>([]); // Store an array of wishlisted property IDs
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  // Function to update the local wishlist state instantly

  useEffect(() => {
    // Initial fetch for user and their wishlist
    const loadWishlist = async () => {
      // 1. If we have a user, fetch their wishlist.
      if (user?.$id) {
        setIsWishlistLoading(true);
        try {
          const wishlistProperties = await getWishlistProperties({ userId: user.$id });
          const wishlistIds = wishlistProperties.map((prop) => prop.$id);
          setWishlist(wishlistIds);
        } catch (error) {
          console.error("Failed to load wishlist:", error);
        } finally {
          setIsWishlistLoading(false);
        }
      } else {
        // 2. If there is no user (logged out), clear the wishlist.
        setWishlist([]);
      }
    };

    loadWishlist();
  }, [user]);

  const toggleGlobalWishlist = (propertyId: string) => {
    setWishlist((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId); // Remove
      } else {
        return [...prev, propertyId]; // Add
      }
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        refetch,
        wishlist,
        toggleGlobalWishlist,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export default GlobalProvider;
