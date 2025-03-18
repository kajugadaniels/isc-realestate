import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { Link } from "expo-router";
import Toast from 'react-native-toast-message';
import { loginUser } from "@/services/authService";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // To show loading indicator

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill out both email and password.");
      return;
    }

    setLoading(true); // Show the loading state

    const result = await loginUser(email, password); // Call the login service

    if (result.success) {
      // On success, show a success message and reset form
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'You have logged in successfully!',
      });
    } else {
      // Handle login failure (error message will be shown by the service)
    }

    setLoading(false); // Reset loading state
  };

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
            disabled={loading} // Disable button while loading
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
      {/* Toast component to show messages */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default SignIn;

