import { Text, View, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import Search from "@/components/search";
import { Card, FeaturedCard } from "@/components/Cards";

export default function Index() {
  const onFeaturedCardPress = () => {};

  const onCardPress = () => {};
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-5">
        <View className="flex flex-row  items-center justify-between mt-5">
          <View className="flex flex-row items-center">
            <Image source={images.avatar} className="size-12 rounded-full" />
            <View className="flex items-start ml-2 justify-center">
              <Text className="text-xs font-rubik text-black-100">Good Morning</Text>
              <Text className="text-base font-rubik-medium text-black-300">Tony</Text>
            </View>
          </View>
          <Image source={icons.bell} className="size-6" />
        </View>
        <Search />
        <View className="py-5">
          <View className="flex flex-row  items-center justify-between">
            <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
            </TouchableOpacity>
          </View>
          <View className="flex flex-row  gap-5 mt-5">
            <FeaturedCard onPress={onFeaturedCardPress} />
            <FeaturedCard onPress={onFeaturedCardPress} />
            <FeaturedCard onPress={onFeaturedCardPress} />
          </View>
        </View>
        <View className="flex flex-row  items-center justify-between">
          <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
          <TouchableOpacity>
            <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row gap-5 mt-5">
          <Card onPress={onCardPress} />
          <Card onPress={onCardPress} />
        </View>
      </View>
    </SafeAreaView>
  );
}
