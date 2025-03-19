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

export default function Index() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true); // To track if more properties are available
  const [page, setPage] = useState<number>(1);

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
                <Image source={images.avatar} className="w-12 h-12 rounded-full" />
                <View className="flex flex-col ml-2">
                  <Text className="text-xs font-rubik text-black-100">Good Morning</Text>
                  <Text className="text-base font-rubik-medium text-black-300">John Doe</Text>
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
