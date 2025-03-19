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
  const [user, setUser] = useState<any>(null); // To store user data
  const [greeting, setGreeting] = useState<string>("");

  // Function to check if the access token is valid
  const checkUserAuth = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      router.push("/sign-in");
      return;
    }

    try {
      // Validate token by making a request to the backend
      const response = await axios.get("https://intelligent-accessible-housing.onrender.com/api/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Set user data
      setUser(response.data);

      // Determine the greeting based on the time of day
      const hours = new Date().getHours();
      if (hours < 12) {
        setGreeting("Good Morning");
      } else if (hours < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }

    } catch (error) {
      // If token is invalid or expired, redirect to sign-in
      router.push("/sign-in");
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

  // Load initial properties and check user authentication on mount
  useEffect(() => {
    checkUserAuth();
    loadProperties();
  }, []);

  const handlePropertyPress = (id: number) => {
    router.push(`/properties/${id}`);
  };

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
                {user?.image ? (
                  <Image source={{ uri: user.image }} className="w-12 h-12 rounded-full" />
                ) : (
                  <Image source={images.avatar} className="w-12 h-12 rounded-full" />
                )}
                <View className="flex flex-col ml-2">
                  <Text className="text-xs font-rubik text-black-100">{greeting}</Text>
                  <Text className="text-base font-rubik-medium text-black-300">{user?.name || "John Doe"}</Text>
                  <Text className="text-xs font-rubik text-black-100">{user?.email || "Email not available"}</Text>
                  <Text className="text-xs font-rubik text-black-100">{user?.phone_number || "Phone number not available"}</Text>
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
