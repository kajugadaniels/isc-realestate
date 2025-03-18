import React, { useState, useEffect } from "react";
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
import { Link, router } from "expo-router";
import axios from "axios";
import icons from "@/constants/icons";
import images from "@/constants/images";

const SignUp = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Live validation: Check if passwords match
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  const handleSignUp = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://intelligent-accessible-housing.onrender.com/api/register/",
        {
          name: name,
          email: email,
          phone_number: phone,
          password: password,
          confirm_password: confirmPassword,
        }
      );
      
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.push("/sign-in") }
      ]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          (error.response?.data as any)?.detail || "An error occurred during registration."
        );
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome ISC
          </Text>
          <Text className="mt-2 text-3xl text-center font-rubik-bold text-black-300">
            Let's Get You Closer To{"\n"}
            <Text className="text-primary-300">Your Ideal Home</Text>
          </Text>

          {/* Name Field */}
          <View className="mt-8">
            <Text className="mb-2 text-sm text-black-300">Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#A8B5DB"
              className="px-5 py-5 border border-gray-300 rounded-full"
            />
          </View>

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

          {/* Phone Number Field */}
          <View className="mt-4">
            <Text className="mb-2 text-sm text-black-300">Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#A8B5DB"
              keyboardType="phone-pad"
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

          {/* Confirm Password Field */}
          <View className="mt-4">
            <Text className="mb-2 text-sm text-black-300">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor="#A8B5DB"
              secureTextEntry
              className="px-5 py-5 border border-gray-300 rounded-full"
            />
            {passwordError ? (
              <Text className="mt-1 text-sm text-danger">{passwordError}</Text>
            ) : null}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            className="py-4 mt-8 rounded-full bg-primary-300"
            disabled={loading || !!passwordError}
          >
            <Text className="text-lg text-center text-white font-rubik-bold">
              {loading ? "Signing Up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <Text className="mt-12 text-lg text-center font-rubik text-black-200">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-primary-300 font-rubik-bold"
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
