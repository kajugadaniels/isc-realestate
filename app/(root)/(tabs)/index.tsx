import React, { useEffect, useState } from "react";
import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { Link, Redirect } from "expo-router";
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // While the login status is being checked, you can return null or a loading indicator
  if (isLoggedIn === null) {
    return null;
  }

  // If user is not logged in, redirect to sign-in page
  if (isLoggedIn === false) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={({ item }) => <Card />}
        keyExtractor={(item) => item.toLocaleString()}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row">
                <Image source={images.avatar} className="rounded-full size-12" />
                <View className="flex flex-col items-start justify-center ml-2">
                  <Text className="text-xs font-rubik text-black-100">Good Morning</Text>
                  <Text className="text-base font-rubik-medium text-black-300">John Doe</Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>

            <Search />

            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">See all</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={[1, 2, 3, 4]}
                renderItem={({ item }) => <FeaturedCard />}
                keyExtractor={(item) => item.toLocaleString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex gap-5 mt-5"
              />
              <View className="mt-5">
                <View className="flex flex-row items-center justify-between">
                  <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
                  <TouchableOpacity>
                    <Text className="text-base font-rubik-bold text-primary-300">See all</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Filters />
          </View>
        }
      />
    </SafeAreaView>
  );
}
