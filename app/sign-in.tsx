import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from "react-native";
import { Link, Redirect, useRouter } from "expo-router";  // Use router to handle navigation
import { loginUser } from "@/services/api";  // Import the loginUser function from services/api
import { useGlobalContext } from "@/lib/global-provider";  // To check if user is logged in

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { refetch, loading, isLogged } = useGlobalContext();  // To check if the user is already logged in
  const router = useRouter();  // To navigate to the next page (index.tsx)

  // If the user is already logged in, redirect them to the home page
  if (!loading && isLogged) {
    <Redirect href="/" />  // Navigate to the home page
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill out both email and password.");
      return;
    }

    // Call login API
    const { success } = await loginUser(email, password);
    if (success) {
      // Refetch user data after successful login
      refetch();
      Alert.alert("Success", "Signed in successfully!");
      <Redirect href="/" />  // Redirect to index.tsx after successful login
    } else {
      Alert.alert("Error", "Failed to sign in.");
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200 mt-52">
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

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            className="py-4 mt-8 rounded-full bg-primary-300"
          >
            <Text className="text-lg text-center text-white font-rubik-bold">
              Sign In
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
