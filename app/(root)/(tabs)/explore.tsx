import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, TouchableOpacity, View, Image, Alert } from "react-native";
import axios from "axios";
import { Card } from "@/components/Cards";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useRouter } from "expo-router";
import Filters from "@/components/Filters";

export default function Explore() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true); // To track if more properties are available
  const [page, setPage] = useState<number>(2); // Start at page 2 since page 1 is loaded initially

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
        setHasMore(false); // No more properties to load
      }

      setProperties((prev) => [...prev, ...newProperties]);
      setPage((prev) => prev + 1);
    } catch (error) {
      Alert.alert("Error", "Unable to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load initial properties on mount (12 properties)
  useEffect(() => {
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
            <Search />

            <Filters />

            <View className="my-5">
              <Text className="text-xl font-rubik-bold text-black-300">Explore Properties</Text>
            </View>
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
