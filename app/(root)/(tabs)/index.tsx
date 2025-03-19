import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, TouchableOpacity, View, Image, Alert } from "react-native";
import axios from "axios";
import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true); // To track if more properties are available
  const [page, setPage] = useState<number>(1);
  const [greeting, setGreeting] = useState<string>(""); // Greeting message based on time of day
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Track user login status
  const [userName, setUserName] = useState<string>(""); // Store logged in user's name
  const [userImage, setUserImage] = useState<string | null>(""); // Store logged in user's image
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true); // Loading status for checking login

  // Function to get current time and set greeting
  const setGreetingMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  };

  // Check if user is logged in and token is valid
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        setIsLoggedIn(false);
        router.push("/sign-in");
        return;
      }

      // Verify if token is valid by making a request
      const response = await axios.get("https://intelligent-accessible-housing.onrender.com/api/verify_token/", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch user details if token is valid
      if (response.status === 200) {
        setUserName(response.data.user.name);
        setUserImage(response.data.user.image);
        setIsLoggedIn(true);
      }
    } catch (error) {
      setIsLoggedIn(false);
      router.push("/sign-in");
    } finally {
      setLoadingStatus(false); // End loading check status
    }
  };

  // Function to load properties
  const loadProperties = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://intelligent-accessible-housing.onrender.com/api/properties/?page=${page}`
      );
      const newProperties = response.data;

      if (newProperties.length < 6) {
        setHasMore(false);
      }

      setProperties((prev) => [...prev, ...newProperties]);
      setPage((prev) => prev + 1);
    } catch (error) {
      Alert.alert("Error", "Unable to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load initial properties on mount
  useEffect(() => {
    setGreetingMessage(); // Set greeting based on time of the day
    checkLoginStatus(); // Check if the user is logged in and the token is valid
    loadProperties(); // Load the initial properties
  }, []);

  const handlePropertyPress = (id: number) => {
    router.push(`/properties/${id}`);
  };

  if (isLoggedIn === null || loadingStatus) {
    return <Text>Loading...</Text>; // Show loading state while checking login status
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <Card property={item} onPress={() => handlePropertyPress(item.id)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 32 }}
        columnWrapperStyle={{ flexDirection: "row", gap: 10, paddingHorizontal: 16 }}
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row">
                <Image
                  source={userImage ? { uri: userImage } : images.avatar}
                  className="w-12 h-12 rounded-full"
                />
                <View className="flex flex-col ml-2">
                  <Text className="text-xs font-rubik text-black-100">{greeting}</Text>
                  <Text className="text-base font-rubik-medium text-black-300">{userName}</Text>
                </View>
              </View>
              <Image source={icons.bell} className="w-6 h-6" />
            </View>

            <Search />
            <View className="my-5">
              <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
              <FlatList
                data={[1, 2, 3, 4]}
                renderItem={({ item }) => <FeaturedCard />}
                keyExtractor={(item) => item.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16 }}
              />
            </View>

            <Filters />
          </View>
        }
        ListFooterComponent={
          hasMore && (
            <TouchableOpacity onPress={loadProperties} className="py-3">
              <Text className="text-center font-rubik-bold text-primary-300">Load More</Text>
            </TouchableOpacity>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
