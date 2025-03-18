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
import { Link } from "expo-router";
import icons from "@/constants/icons";
import images from "@/constants/images";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill out both email and password.");
      return;
    }
    // Add your authentication logic here.
    Alert.alert("Success", "Signed in successfully!");
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>

        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome ISC
          </Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You Closer To {"\n"}
            <Text className="text-primary-300">Your Ideal Home</Text>
          </Text>

          {/* Email Field */}
          <View className="mt-4">
            <Text className="text-sm text-black-300 mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#A8B5DB"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 py-5 px-5 rounded-full"
            />
          </View>

          {/* Password Field */}
          <View className="mt-4">
            <Text className="text-sm text-black-300 mb-2">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#A8B5DB"
              secureTextEntry
              className="border border-gray-300 py-5 px-5 rounded-full"
            />
          </View>

          {/* Email/Password Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            className="bg-primary-300 rounded-full py-4 mt-8"
          >
            <Text className="text-white text-center text-lg font-rubik-bold">
              Sign In
            </Text>
          </TouchableOpacity>

          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-primary-300 font-bold font-rubik-bold"
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
