import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
// import images from "@/constants/images";
import icons from "@/constants/icons";
import Search from "@/components/search";
import { WishlistCard } from "@/components/Cards";
import { useAppwrite } from "@/lib/useAppwrite";
import { getProperties, getWishlistProperties } from "@/lib/appwrite";
import { useCallback, useEffect, useMemo } from "react";
import NoResults from "@/components/NoResults";
import { useGlobalContext } from "@/context/global-provider";
import { Models } from "react-native-appwrite";

export default function Wishlist() {
  const { user, wishlist } = useGlobalContext();

  // console.log("user_id : ", user);
  console.log("user_id : ", user?.$id);

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {
    data: properties,
    loading: propertiesLoading,
    refetch,
  } = useAppwrite({
    fn: getWishlistProperties,
    params: {
      userId: user?.$id!,
    },
    skip: true,
  });
  console.log("wishlist properties : ", properties);

  // useEffect(() => {
  //   if (user) {
  //     refetch({ userId: user.$id });
  //   }
  // }, [user, refetch]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        // Refetch the wishlist properties from the backend
        refetch({ userId: user.$id });
      }
    }, [user]), // Re-run if the user object itself changes (e.g., on logout)
  );

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  const displayedProperties = useMemo(() => {
    if (!properties) return [];
    return properties.filter((prop: Models.Document) => wishlist.includes(prop.$id));
  }, [properties, wishlist]);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={displayedProperties}
        renderItem={({ item }) => (
          <WishlistCard item={item} onPress={() => handleCardPress(item.$id || item.WishlistId)} />
        )}
        // keyExtractor={(item) => item.$id || item.WishlistId}
        keyExtractor={(item: Models.Document) => item.$id}
        numColumns={2}
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        columnWrapperClassName="flex gap-5 px-5"
        ListEmptyComponent={
          propertiesLoading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>
              <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                Search In your Wishlist
              </Text>
              <Image source={icons.bell} className="w-6 h-6" />
            </View>

            <Search />
            <View className="mt-5">
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                WishListed {properties?.length} Properties
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
