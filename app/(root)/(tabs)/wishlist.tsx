import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
// import images from "@/constants/images";
import icons from "@/constants/icons";
import Search from "@/components/search";
import { WishlistCard } from "@/components/Cards";
import { useAppwrite } from "@/lib/useAppwrite";
import { getProperties, getWishlistProperties } from "@/lib/appwrite";
import { useEffect } from "react";
import NoResults from "@/components/NoResults";
import { useGlobalContext } from "@/context/global-provider";

export default function Wishlist() {
  const { user } = useGlobalContext();

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

  useEffect(() => {
    refetch({
      userId: user?.$id!,
    });
  }, []);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={properties?.map((item) => ({
          ...item.property,
          WishlistId: item.$id, // Retain unique ID for handling card press
        }))}
        renderItem={({ item }) => (
          <WishlistCard
            item={item}
            onWishlistChange={() =>
              refetch({
                userId: user?.$id!,
              })
            }
            onPress={() => handleCardPress(item.$id || item.WishlistId)}
          />
        )}
        keyExtractor={(item) => item.$id || item.WishlistId}
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
