import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import icons from "@/constants/icons";
import images from "@/constants/images";

interface CardProps {
  property: any;
  onPress: () => void;
}

export const Card = ({ property, onPress }: CardProps) => {
  const truncatedName = property.name.length > 10 ? property.name.substring(0, 20) + "..." : property.name;

  return (
    <TouchableOpacity onPress={onPress} className="relative flex flex-col items-start h-64 w-44">
      <Image source={{ uri: property.image }} className="w-full h-40 rounded-lg" />
      <View className="absolute z-50 flex flex-row items-center p-1 rounded-full top-5 right-5 bg-white/90">
        <Image source={icons.star} className="w-3 h-3" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">{property.reviews.length ? property.reviews.length : "N/A"}</Text>
      </View>

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">{truncatedName}</Text>
        <Text className="text-xs font-rubik text-black-100">{property.city}</Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-base font-rubik-bold text-primary-300">${property.price_usd}</Text>
          <Image source={icons.heart} className="w-5 h-5 mr-2" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const FeaturedCard = () => {
  return (
    <View className="relative flex flex-col items-start w-60 h-80">
      <Image source={images.japan} className="w-full h-full rounded-2xl" />
      <Image source={images.cardGradient} className="absolute bottom-0 w-full h-full rounded-2xl" />

      <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
        <Image source={icons.star} className="w-3.5 h-3.5" />
        <Text className="ml-1 text-xs font-rubik-bold text-primary-300">7.8</Text>
      </View>

      <View className="absolute flex flex-col items-start bottom-5 inset-x-5">
        <Text className="text-xl text-white font-rubik-extrabold" numberOfLines={1}>Property Name</Text>
        <Text className="text-base text-white font-rubik" numberOfLines={1}>Kigali Rwanda</Text>

        <View className="flex flex-row items-center justify-between w-full">
          <Text className="text-xl text-white font-rubik-extrabold">$200</Text>
          <Image source={icons.heart} className="w-5 h-5" />
        </View>
      </View>
    </View>
  );
};
