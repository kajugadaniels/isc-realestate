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

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    // Handle the sign-up process (API call or navigation)
    Alert.alert("Success", "Account created successfully!");
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome ISC
          </Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You Closer To{"\n"}
            <Text className="text-primary-300">Your Ideal Home</Text>
          </Text>

          {/* Name Field */}
          <View className="mt-8">
            <Text className="text-sm text-black-300 mb-2">Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#A8B5DB"
              className="border border-gray-300 rounded-lg p-3"
            />
          </View>

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
              className="border border-gray-300 rounded-lg p-3"
            />
          </View>

          {/* Phone Number Field */}
          <View className="mt-4">
            <Text className="text-sm text-black-300 mb-2">Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#A8B5DB"
              keyboardType="phone-pad"
              className="border border-gray-300 rounded-lg p-3"
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
              className="border border-gray-300 rounded-lg p-3"
            />
          </View>

          {/* Confirm Password Field */}
          <View className="mt-4">
            <Text className="text-sm text-black-300 mb-2">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor="#A8B5DB"
              secureTextEntry
              className="border border-gray-300 rounded-lg p-3"
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            className="bg-primary-300 rounded-full py-4 mt-8"
          >
            <Text className="text-white text-center text-lg font-rubik-bold">
              Sign Up
            </Text>
          </TouchableOpacity>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            onPress={() => {
              // Add your Google login logic here
            }}
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5 flex-row items-center justify-center"
          >
            <Image
              source={icons.google}
              className="w-5 h-5"
              resizeMode="contain"
            />
            <Text className="text-lg font-rubik-medium text-black-300 ml-2">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary-300 font-bold font-rubik-bold"
            >
              Sign In
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
