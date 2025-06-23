// import { ActivityIndicator, Image, TouchableOpacity } from "react-native";
// import React, { useState } from "react";
// import icons from "@/constants/icons";
// import { Models } from "react-native-appwrite";
// // import { createWishlistProperties } from "@/lib/appwrite";
// import { toggleWishlistProperty } from "@/lib/appwrite";
// import { useGlobalContext } from "@/context/global-provider";

// const WishlistButton = ({
//   size,
//   item,
//   // onWishlistChange,
// }: {
//   size: number;
//   item: Models.Document;
//   // onWishlistChange: () => void;
// }) => {
//   const { user, wishlist, toggleGlobalWishlist } = useGlobalContext();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // The source of truth for the icon is now our fast, global state
//   const isWishlisted = wishlist.includes(item.$id);

//   const onPress = async () => {
//     console.log("pressed");
//     // const result = await createWishlistProperties({
//     //   userId: item.$id,
//     //   propertyId: item.$id,
//     // });

//     // if (result) {
//     //   onWishlistChange(); // Notify the parent or global state about the change
//     // }
//     if (!user || isSubmitting) return;

//     setIsSubmitting(true);

//     try {
//       // 1. Instantly update the UI via global state (Optimistic Update)
//       toggleGlobalWishlist(item.$id);

//       // 2. Call the backend to sync the change
//       await toggleWishlistProperty({
//         userId: user.$id, // Correct user ID from context
//         propertyId: item.$id, // Correct property ID from item prop
//       });
//     } catch (error) {
//       // If the backend call fails, revert the UI change
//       console.error("Failed to update wishlist:", error);
//       toggleGlobalWishlist(item.$id); // Revert back
//       // Optionally show an error toast to the user
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isSubmitting) {
//     return <ActivityIndicator size="small" className={`size-${size}`} />;
//   }

//   return (
//     // <TouchableOpacity onPress={onPress}>
//     //   <Image
//     //     source={item?.wishlisted ? icons.heartFilled : icons.heart}
//     //     className={`size-${size}`}
//     //   />
//     // </TouchableOpacity>
//     <TouchableOpacity onPress={onPress} disabled={!user}>
//       <Image
//         source={isWishlisted ? icons.heartFilled : icons.heart}
//         className={`size-${size}`}
//         tintColor={isWishlisted ? "#FF6347" : "#000000"} // Example tint color
//       />
//     </TouchableOpacity>
//   );
// };

// export default WishlistButton;

import { ActivityIndicator, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import icons from "@/constants/icons";
import { Models } from "react-native-appwrite";
import { toggleWishlistProperty } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/global-provider";

const WishlistButton = ({ size, item }: { size: number; item: Models.Document }) => {
  const { user, wishlist, toggleGlobalWishlist } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The source of truth is our fast, global state. This is perfect.
  const isWishlisted = wishlist.includes(item.$id);

  const handlePress = async () => {
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 1. Optimistic Update: Instantly update the UI
      toggleGlobalWishlist(item.$id);

      // 2. Sync with backend
      await toggleWishlistProperty({
        userId: user.$id,
        propertyId: item.$id,
      });
    } catch (error) {
      // 3. Revert on failure
      console.error("Failed to update wishlist:", error);
      toggleGlobalWishlist(item.$id); // Revert the optimistic update
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <ActivityIndicator size="small" className={`size-${size}`} />;
  }

  return (
    <TouchableOpacity onPress={handlePress} disabled={!user}>
      <Image
        source={isWishlisted ? icons.heartFilled : icons.heart}
        className={`size-${size}`}
        tintColor={isWishlisted ? "#FF6347" : "#000000"} // Great for styling!
      />
    </TouchableOpacity>
  );
};

export default WishlistButton;
