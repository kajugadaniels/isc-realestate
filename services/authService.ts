import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Backend URL
const API_URL = "https://intelligent-accessible-housing.onrender.com/api/";

// ** Login function for API call
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}login/`, {
      identifier: email,
      password: password,
    });

    // Destructure the access and refresh tokens from the response
    const { access, refresh } = response.data;

    // Save tokens in AsyncStorage
    await AsyncStorage.setItem('access_token', access);
    await AsyncStorage.setItem('refresh_token', refresh);

    return { success: true, access, refresh };
  } catch (error) {
    let errorMessage = "Something went wrong. Please try again.";
    if (error.response) {
      // Server-side error
      errorMessage = error.response.data.detail || errorMessage;
    }
    // Show error message via Toast
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage,
    });
    return { success: false, message: errorMessage };
  }
};

