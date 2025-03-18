import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import toastr from "react-native-toastr";

// Base URL for API
const BASE_URL = "https://intelligent-accessible-housing.onrender.com/api";

// Utility function to handle API calls with Axios
const apiCall = async (endpoint: string, method: string, body?: object) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    });

    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.detail || error?.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

// Function to store the JWT tokens
const storeTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

// Login function to authenticate the user and store tokens
export const loginUser = async (identifier: string, password: string) => {
  try {
    const data = await apiCall("/login/", "POST", { identifier, password });

    const { access, refresh } = data;
    await storeTokens(access, refresh);

    toastr.success(data?.detail || "Signed in successfully!");

    return { success: true, access, refresh };
  } catch (error: any) {
    toastr.error(error.message || "Failed to sign in.");
    return { success: false };
  }
};

// Function to get the stored tokens (e.g., to check if the user is authenticated)
export const getStoredTokens = async () => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  return { accessToken, refreshToken };
};

// Function to clear tokens (logout)
export const clearTokens = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};
