import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, Redirect } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import icons from "@/constants/icons";
import images from "@/constants/images";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  // Helper function to save tokens in both AsyncStorage (mobile) and localStorage (web)
  const saveTokens = async (accessToken: string, refreshToken: string) => {
    try {
      // Store tokens using AsyncStorage (for mobile)
      await AsyncStorage.setItem("access_token", accessToken);
      await AsyncStorage.setItem("refresh_token", refreshToken);

      // Also store tokens using localStorage if running in a web environment
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("access_token", accessToken);
        window.localStorage.setItem("refresh_token", refreshToken);
      }
    } catch (error) {
      console.error("Error saving tokens:", error);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill out both email and password.");
      return;
    }

    try {
      setLoading(true);
      // Send login request to your backend API
      const response = await axios.post(
        "https://intelligent-accessible-housing.onrender.com/api/login/",
        {
          identifier: email,
          password: password,
        }
      );

      // Retrieve tokens from the response
      const { access, refresh } = response.data;

      // Save tokens locally (mobile and web)
      await saveTokens(access, refresh);

      Alert.alert("Success", "Signed in successfully!");
      setRedirect(true);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        Alert.alert("Error", error.response.data.detail || "An error occurred.");
      } else if (error.request) {
        Alert.alert("Error", "Network error. Please try again.");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  // Redirect the user to the home screen if the sign-in was successful
  if (redirect) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome ISC
          </Text>

          <Text className="mt-2 text-3xl text-center font-rubik-bold text-black-300">
            Let's Get You Closer To {"\n"}
            <Text className="text-primary-300">Your Ideal Home</Text>
          </Text>

          {/* Email Field */}
          <View className="mt-4">
            <Text className="mb-2 text-sm text-black-300">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#A8B5DB"
              keyboardType="email-address"
              autoCapitalize="none"
              className="px-5 py-5 border border-gray-300 rounded-full"
            />
          </View>

          {/* Password Field */}
          <View className="mt-4">
            <Text className="mb-2 text-sm text-black-300">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#A8B5DB"
              secureTextEntry
              className="px-5 py-5 border border-gray-300 rounded-full"
            />
          </View>

          {/* Email/Password Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            className="py-4 mt-8 rounded-full bg-primary-300"
            disabled={loading}
          >
            <Text className="text-lg text-center text-white font-rubik-bold">
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <Text className="mt-12 text-lg text-center font-rubik text-black-200">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-primary-300 font-rubik-bold"
            >
              Sign Up
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
