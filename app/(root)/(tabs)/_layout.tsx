import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons from "@/constants/icons";

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: any; title: string }) => (
  <View className="flex-1 mt-3 flex flex-col items-center">
    <Image
      source={icon}
      className="size-6"
      resizeMode="contain"
      tintColor={focused ? "#FF8000" : "#666876"}
    />
    <Text
      className={`${focused ? "text-primary-300 font-rubik-medium" : "text-black-200 font-rubik"} text-xs w-full text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          position: "absolute",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
          minHeight: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.home} title="Home" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Explore" />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.heart} title="Wishlist" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;
