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
  const [randomProperties, setRandomProperties] = useState<any[]>([]); // State for random featured properties
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true); // To track if more properties are available
  const [page, setPage] = useState<number>(1);
  const [greeting, setGreeting] = useState<string>(""); // Greeting message based on time of day
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Track user login status
  const [userName, setUserName] = useState<string>("N/A"); // Default to "N/A" if no name available
  const [userImage, setUserImage] = useState<string | null>(""); // Default to null, which will show dummy image if not available
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
        setUserName(response.data.user.name || "N/A");
        setUserImage(response.data.user.image || ""); // Set to empty string if no image
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

      // Select 4 random properties for the featured section
      const randomProps = getRandomProperties(newProperties, 4);
      setRandomProperties(randomProps);
    } catch (error) {
      Alert.alert("Error", "Unable to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to get random properties
  const getRandomProperties = (properties: any[], count: number) => {
    const shuffled = [...properties].sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, count); // Get the first 'count' elements
  };

  // Load initial properties on mount
  useEffect(() => {
    setGreetingMessage(); // Set greeting based on time of the day
    checkLoginStatus(); // Check if the user is logged in and the token is valid
    loadProperties(); // Load the initial properties
  }, []);

  const handlePropertyPress = (id: number) => {
    router.push({
      pathname: "/properties/[id]",
      params: { id: id.toString() },
    });
  };

  if (isLoggedIn === null || loadingStatus) {
    return (
      <SafeAreaView className="h-full bg-white">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
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
                  source={images.avatar}
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
                data={randomProperties} // Display the random properties here
                renderItem={({ item }) => <FeaturedCard property={item} />}
                keyExtractor={(item) => item.id.toString()}
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
