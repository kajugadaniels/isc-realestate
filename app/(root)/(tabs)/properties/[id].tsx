import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSearchParams, useRouter } from "expo-router";
import axios from "axios";
import icons from "@/constants/icons";
import images from "@/constants/images";
import Comment from "@/components/Comment";
import { facilities as facilityList } from "@/constants/data";

const Property = () => {
  const { id } = useSearchParams<{ id: string }>();
  const router = useRouter();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const res = await axios.get(
          `https://intelligent-accessible-housing.onrender.com/api/property/${id}/`
        );
        setProperty(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load property. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#191D31" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center flex-1 p-4 bg-white">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            setError("");
            // retry
            axios
              .get(
                `https://intelligent-accessible-housing.onrender.com/api/property/${id}/`
              )
              .then((res) => setProperty(res.data))
              .catch(() => setError("Unable to load property."))
              .finally(() => setLoading(false));
          }}
        >
          <Text className="mt-2 text-primary-300">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Hero Image */}
        <View
          style={{ height: Dimensions.get("window").height / 2 }}
          className="relative w-full"
        >
          <Image
            source={{ uri: property.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 z-40 w-full h-full"
          />

          <View
            className="absolute z-50 inset-x-7"
            style={{ top: Platform.OS === "ios" ? 70 : 20 }}
          >
            <View className="flex-row items-center justify-between w-full">
              <TouchableOpacity
                onPress={() => router.back()}
                className="items-center justify-center rounded-full bg-primary-200 size-11"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>
              <View className="flex-row items-center gap-3">
                <Image source={icons.heart} className="size-7" tintColor="#191D31" />
                <Image source={icons.send} className="size-7" />
              </View>
            </View>
          </View>
        </View>

        <View className="flex gap-2 px-5 mt-7">
          {/* Title & Rating */}
          <Text className="text-2xl font-rubik-extrabold">
            {property.name}
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center px-4 py-2 rounded-full bg-primary-100">
              <Text className="text-xs font-rubik-bold text-primary-300">
                {property.type}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Image source={icons.star} className="size-5" />
              <Text className="mt-1 text-sm text-black-200 font-rubik-medium">
                {property.review_data?.rating ?? "N/A"} (
                {property.reviews.length})
              </Text>
            </View>
          </View>

          {/* Beds / Baths / Size */}
          <View className="flex-row items-center mt-5">
            <View className="flex-row items-center justify-center rounded-full bg-primary-100 size-10">
              <Image source={icons.bed} className="size-4" />
            </View>
            <Text className="ml-2 text-sm text-black-300 font-rubik-medium">
              {property.capacity} Beds
            </Text>
            <View className="flex-row items-center justify-center rounded-full bg-primary-100 size-10 ml-7">
              <Image source={icons.bath} className="size-4" />
            </View>
            <Text className="ml-2 text-sm text-black-300 font-rubik-medium">
              {property.bathroom} Baths
            </Text>
            <View className="flex-row items-center justify-center rounded-full bg-primary-100 size-10 ml-7">
              <Image source={icons.area} className="size-4" />
            </View>
            <Text className="ml-2 text-sm text-black-300 font-rubik-medium">
              {property.size}
            </Text>
          </View>

          {/* Agent */}
          <View className="w-full mt-5 border-t border-primary-200 pt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">Agent</Text>
            <View className="flex-row items-center justify-between mt-4">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: property.created_by.image }}
                  className="rounded-full size-14"
                />
                <View className="ml-3">
                  <Text className="text-lg text-black-300 font-rubik-bold">
                    {property.created_by.name}
                  </Text>
                  <Text className="text-sm text-black-200 font-rubik-medium">
                    {property.created_by.email}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                <Image source={icons.chat} className="size-7" />
                <Image source={icons.phone} className="size-7" />
              </View>
            </View>
          </View>

          {/* Overview */}
          <View className="mt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">
              Overview
            </Text>
            <Text className="mt-2 text-base text-black-200 font-rubik">
              {property.description}
            </Text>
          </View>

          {/* Amenities */}
          <View className="mt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">
              Facilities
            </Text>
            <View className="flex-row flex-wrap gap-5 mt-2">
              {property.amenities.map((a: any) => {
                const f = facilityList.find((f) => f.title === a.name);
                return (
                  <View key={a.id} className="items-center min-w-16 max-w-20">
                    <View className="items-center justify-center rounded-full bg-primary-100 size-14">
                      <Image
                        source={f ? f.icon : icons.info}
                        className="size-6"
                      />
                    </View>
                    <Text className="text-sm text-black-300 text-center font-rubik mt-1.5">
                      {a.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Gallery */}
          {property.images.length > 0 && (
            <View className="mt-7">
              <Text className="text-xl text-black-300 font-rubik-bold">
                Gallery
              </Text>
              <FlatList
                data={property.images}
                keyExtractor={(i) => i.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.image }}
                    className="size-40 rounded-xl"
                  />
                )}
              />
            </View>
          )}

          {/* Location */}
          <View className="mt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">
              Location
            </Text>
            <View className="flex-row items-center gap-2 mt-4">
              <Image source={icons.location} className="size-7" />
              <Text className="text-sm text-black-200 font-rubik-medium">
                {property.address}
              </Text>
            </View>
            <Image source={images.map} className="w-full mt-5 h-52 rounded-xl" />
          </View>

          {/* Reviews */}
          {property.reviews.length > 0 && (
            <View className="mt-7">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image source={icons.star} className="size-6" />
                  <Text className="ml-2 text-xl text-black-300 font-rubik-bold">
                    {property.review_data?.rating ?? "N/A"} (
                    {property.reviews.length})
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push(`/properties/${id}`)}>
                  <Text className="text-base text-primary-300 font-rubik-bold">
                    View All
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="mt-5">
                <Comment item={property.reviews[0]} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 w-full bg-white border-t border-l border-r rounded-t-2xl border-primary-200 p-7">
        <View className="flex-row items-center justify-between gap-10">
          <View>
            <Text className="text-xs text-black-200 font-rubik-medium">
              Price
            </Text>
            <Text className="text-2xl text-primary-300 font-rubik-bold">
              ${property.price_usd}
            </Text>
          </View>
          <TouchableOpacity className="flex-row items-center justify-center flex-1 py-3 rounded-full shadow-md bg-primary-300 shadow-zinc-400">
            <Text className="text-lg text-white font-rubik-bold">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Property;
