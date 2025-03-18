import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// URL for your backend API
const API_URL = "https://intelligent-accessible-housing.onrender.com/api/login/";

// Function for user login
export const loginUser = async (identifier: string, password: string) => {
  try {
    // Send login request to backend
    const response = await axios.post(API_URL, {
      identifier,
      password,
    });

    const { access, refresh } = response.data;

    // Save the tokens to AsyncStorage
    await AsyncStorage.setItem("access_token", access);
    await AsyncStorage.setItem("refresh_token", refresh);

    // Return success response
    return { success: true, message: "Login successful" };
  } catch (error) {
    // Handle errors and return error message
    if (error.response) {
      return { success: false, message: error.response.data.detail || "An error occurred." };
    }
    return { success: false, message: "Network error. Please try again." };
  }
};
