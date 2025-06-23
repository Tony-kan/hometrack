import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { Models } from "react-native-appwrite";
import WishlistButton from "./wishlistButton";

interface CardProps {
  item: Models.Document;
  onPress: () => void;
}

export const FeaturedCard = ({ item, onPress }: CardProps) => {
  const { image, name, address, rating, price } = item;
  return (
    <TouchableOpacity onPress={onPress} className="flex  flex-col items-start w-60 h-80 relative">
      <Image source={{ uri: image }} className="size-full  rounded-2xl" />
      <Image source={images.cardGradient} className="size-full rounded-2xl absolute bottom-0" />
      <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5 gap-2">
        <Image source={icons.star} className="size-3.5" />
        <Text className="text-base font-rubik-bold text-primary-400 ml-0.5">{rating}</Text>
      </View>
      <View className="flex flex-col items-start  absolute bottom-5 inset-x-5">
        <Text className="text-xl font-rubik-extraBold text-white" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-base font-rubik text-white mt-2">{address}</Text>

        <View className="flex flex-row items-center  justify-between w-full">
          <Text className="text-xl font-rubik-extraBold text-white mt-2">{`$ ${price}`}</Text>
          {/* <Image source={icons.heart} className="size-5" /> */}
          <WishlistButton size={5} item={item} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const Card = ({ item, onPress }: CardProps) => {
  const { image, name, address, rating, price } = item;
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
    >
      <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full gap-2">
        <Image source={icons.star} className="size-3.5" />
        <Text className="text-sm font-rubik-bold text-primary-400 ml-0.5">{rating}</Text>
      </View>

      <Image source={{ uri: image }} className="w-full h-40 rounded-lg -z-50" />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">{name}</Text>
        <Text className="text-xs font-rubik text-black ">{address}</Text>

        <View className="flex flex-row items-center  justify-between mt-2">
          <Text className="text-base font-rubik-bold text-primary-300">{`$ ${price}`}</Text>
          {/* <Image source={icons.heart} className="size-5" /> */}
          <WishlistButton size={5} item={item} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const WishlistCard = ({ item, onPress }: CardProps) => {
  const { image, name, address, rating, price } = item;
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex w-full mt-4 px-3 py-2 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
    >
      <View className="flex flex-row items-center absolute px-2 top-4 left-16 bg-white/90 p-1 rounded-lg gap-2 ">
        <Image source={icons.star} className="size-3" />
        <Text className="text-md font-rubik-bold text-primary-400 ml-0.5">{rating}</Text>
      </View>

      <View className="flex flex-row justify-between gap-2">
        <View className="flex flex-row items-center justify-start">
          <Image source={{ uri: image }} className="w-28 h-28 rounded-lg -z-40" />
        </View>
        <View className="flex justify-center">
          <Text className="text-base font-rubik-bold text-black-300">{name}</Text>
          <Text className="text-xs font-rubik text-black ">{address}</Text>
        </View>
        <View className="flex items-center justify-between my-2">
          <View className="flex">
            {/* <TouchableOpacity>
              <Image source={wishlisted ? icons.heartFilled : icons.heart} className="size-5" />
            </TouchableOpacity> */}
            <WishlistButton size={5} item={item} />
          </View>
          <View>
            <Text className="text-base font-rubik-bold text-primary-300">{`$ ${price}`}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
