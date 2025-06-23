import { Models } from "react-native-appwrite";
import { ReactNode } from "react";

declare interface CommentProps {
  item: Models.Document;
}

declare interface getPropertiesProps {
  filter: string;
  query: string;
  limit?: number;
}

declare interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

declare interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetch: (newParams?: Record<string, string | number>) => Promise<void>;
  // refetch: () => void;
  wishlist: string[];
  toggleGlobalWishlist: (propertyId: string) => void;
}

declare interface GlobalProviderProps {
  children: ReactNode;
}

declare interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

declare interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams: P) => Promise<void>;
}
