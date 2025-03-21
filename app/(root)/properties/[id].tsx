import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import icons from "@/constants/icons";
import images from "@/constants/images";
import Comment from "@/components/Comment";
import { facilities } from "@/constants/data";

const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const windowHeight = Dimensions.get("window").height;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching property data using the id.
    setTimeout(() => {
      // Dummy property data; adjust as needed.
      const dummyProperty = {
        $id: id || "1",
        image: "https://example.com/property-image.jpg",
        name: "Luxury Villa",
        type: "Villa",
        rating: 4.5,
        reviews: [
          {
            id: "rev1",
            user: "John Doe",
            comment: "Amazing property!",
            rating: 5,
          },
        ],
        bedrooms: 4,
        bathrooms: 3,
        area: 3500,
        agent: {
          avatar: "https://example.com/agent-avatar.jpg",
          name: "Agent Smith",
          email: "agent.smith@example.com",
        },
        description:
          "This is a luxurious villa located in a prime area. It features modern amenities and spacious living.",
        facilities: ["Pool", "Gym", "WiFi"],
        gallery: [
          { $id: "gal1", image: "https://example.com/gallery1.jpg" },
          { $id: "gal2", image: "https://example.com/gallery2.jpg" },
        ],
        address: "123 Luxury Lane, Beverly Hills, CA",
        price: 2500000,
      };
      setProperty(dummyProperty);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" className="text-primary-300" />
      </View>
    );
  }

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32 bg-white">
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image source={images.newYork} className="size-full" resizeMode="cover" />
          <Image source={images.whiteGradient} className="absolute top-0 z-40 w-full" />

          <View
            className="absolute z-50 inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center justify-between w-full">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row items-center justify-center rounded-full bg-primary-200 size-11"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <Image source={icons.heart} className="size-7" tintColor={"#191D31"} />
                <Image source={icons.send} className="size-7" />
              </View>
            </View>
          </View>
        </View>

        <View className="flex gap-2 px-5 mt-7">
          <Text className="text-2xl font-rubik-extrabold">{property?.name}</Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 rounded-full bg-primary-100">
              <Text className="text-xs font-rubik-bold text-primary-300">{property?.type}</Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <Image source={icons.star} className="size-5" />
              <Text className="mt-1 text-sm text-black-200 font-rubik-medium">
                {property?.rating} ({property?.reviews.length} reviews)
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center mt-5">
            <View className="flex flex-row items-center justify-center rounded-full bg-primary-100 size-10">
              <Image source={icons.bed} className="size-4" />
            </View>
            <Text className="ml-2 text-sm text-black-300 font-rubik-medium">
              {property?.bedrooms} Beds
            </Text>
            <View className="flex flex-row items-center justify-center rounded-full bg-primary-100 size-10 ml-7">
              <Image source={icons.bath} className="size-4" />
            </View>
            <Text className="ml-2 text-sm text-black-300 font-rubik-medium">
              {property?.bathrooms} Baths
            </Text>
            <View className="flex flex-row items-center justify-center rounded-full bg-primary-100 size-10 ml-7">
              <Image source={icons.area} className="size-4" />
            </View>
            <Text className="ml-2 text-sm text-black-300 font-rubik-medium">
              {property?.area} sqft
            </Text>
          </View>

          <View className="w-full mt-5 border-t border-primary-200 pt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">Agent</Text>

            <View className="flex flex-row items-center justify-between mt-4">
              <View className="flex flex-row items-center">
                <Image source={images.avatar} className="rounded-full size-14" />

                <View className="flex flex-col items-start justify-center ml-3">
                  <Text className="text-lg text-black-300 text-start font-rubik-bold">
                    {property?.agent.name}
                  </Text>
                  <Text className="text-sm text-black-200 text-start font-rubik-medium">
                    {property?.agent.email}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <Image source={icons.chat} className="size-7" />
                <Image source={icons.phone} className="size-7" />
              </View>
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">Overview</Text>
            <Text className="mt-2 text-base text-black-200 font-rubik">
              {property?.description}
            </Text>
          </View>

          <View className="mt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">Facilities</Text>

            {property?.facilities.length > 0 && (
              <View className="flex flex-row flex-wrap items-start justify-start gap-5 mt-2">
                {property?.facilities.map((item: string, index: number) => {
                  const facility = facilities.find(
                    (facility) => facility.title === item
                  );

                  return (
                    <View
                      key={index}
                      className="flex flex-col items-center flex-1 min-w-16 max-w-20"
                    >
                      <View className="flex items-center justify-center rounded-full size-14 bg-primary-100">
                        <Image
                          source={facility ? facility.icon : icons.info}
                          className="size-6"
                        />
                      </View>

                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="text-black-300 text-sm text-center font-rubik mt-1.5"
                      >
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {property?.gallery.length > 0 && (
            <View className="mt-7">
              <Text className="text-xl text-black-300 font-rubik-bold">Gallery</Text>
              <FlatList
                contentContainerStyle={{ paddingRight: 20 }}
                data={property?.gallery}
                keyExtractor={(item) => item.$id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Image
                    source={images.japan}
                    className="size-40 rounded-xl"
                  />
                )}
                contentContainerClassName="flex gap-4 mt-3"
              />
            </View>
          )}

          <View className="mt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">Location</Text>
            <View className="flex flex-row items-center justify-start gap-2 mt-4">
              <Image source={icons.location} className="w-7 h-7" />
              <Text className="text-sm text-black-200 font-rubik-medium">
                {property?.address}
              </Text>
            </View>

            <Image source={images.map} className="w-full mt-5 h-52 rounded-xl" />
          </View>

          {property?.reviews.length > 0 && (
            <View className="mt-7">
              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center">
                  <Image source={icons.star} className="size-6" />
                  <Text className="ml-2 text-xl text-black-300 font-rubik-bold">
                    {property?.rating} ({property?.reviews.length} reviews)
                  </Text>
                </View>

                <TouchableOpacity>
                  <Text className="text-base text-primary-300 font-rubik-bold">
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mt-5">
                <Comment item={property?.reviews[0]} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full bg-white border-t border-l border-r rounded-t-2xl border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-xs text-black-200 font-rubik-medium">Price</Text>
            <Text numberOfLines={1} className="text-2xl text-primary-300 text-start font-rubik-bold">
              ${property?.price}
            </Text>
          </View>

          <TouchableOpacity className="flex flex-row items-center justify-center flex-1 py-3 rounded-full shadow-md bg-primary-300 shadow-zinc-400">
            <Text className="text-lg text-center text-white font-rubik-bold">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Property;
