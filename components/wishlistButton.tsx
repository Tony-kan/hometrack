import { Image, TouchableOpacity } from "react-native";
import React from "react";
import icons from "@/constants/icons";
import { Models } from "react-native-appwrite";
import { createWishlistProperties } from "@/lib/appwrite";

const WishlistButton = ({ size, item }: { size: number; item: Models.Document }) => {
  const onPress = async () => {
    console.log("pressed");
    const result = await createWishlistProperties({
      userId: item.$id,
      propertyId: item.$id,
    });
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={item?.wishlisted ? icons.heartFilled : icons.heart}
        className={`size-${size}`}
      />
    </TouchableOpacity>
  );
};

export default WishlistButton;
