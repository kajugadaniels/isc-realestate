import {
  Alert,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import icons from "@/constants/icons";
import { settings } from "@/constants/data";
import images from "@/constants/images";

interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProp) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" />
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>
        {title}
      </Text>
    </View>
    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
  </TouchableOpacity>
);

const Profile = () => {
  const handleLogout = async () => {
    try {
      // Retrieve refresh token from AsyncStorage; fallback to localStorage for web
      let refreshToken = await AsyncStorage.getItem("refresh_token");
      if (!refreshToken && typeof window !== "undefined" && window.localStorage) {
        refreshToken = window.localStorage.getItem("refresh_token");
      }

      if (!refreshToken) {
        Alert.alert("Error", "No refresh token found. Please sign in again.");
        router.push("/sign-in");
        return;
      }

      // Call the logout endpoint using the refresh token
      await axios.post("https://intelligent-accessible-housing.onrender.com/api/logout/", {
        refresh: refreshToken,
      });

      // Clear tokens from AsyncStorage
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");

      // Also clear tokens from localStorage if available (for web)
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("refresh_token");
      }

      Alert.alert("Success", "Logged out successfully.");
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "An error occurred while logging out. Please try again.");
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Profile</Text>
          <Image source={icons.bell} className="size-5" />
        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="relative flex flex-col items-center mt-5">
            <Image
              source={images.avatar}
              className="relative rounded-full size-44"
            />
            <TouchableOpacity className="absolute bottom-11 right-2">
              <Image source={icons.edit} className="size-9" />
            </TouchableOpacity>
            <Text className="mt-2 text-2xl font-rubik-bold">John Doe</Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem icon={icons.calendar} title="My Bookings" />
          <SettingsItem icon={icons.wallet} title="Payments" />
        </View>

        <View className="flex flex-col pt-5 mt-5 border-t border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>

        <View className="flex flex-col pt-5 mt-5 border-t border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
