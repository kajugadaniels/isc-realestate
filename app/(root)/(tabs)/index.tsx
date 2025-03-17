import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Text className="font-bold text-lg">Welcome</Text>
      <Link href='/sign-in'>Sign In</Link>
      <Link href='/profile'>Profile</Link>
      <Link href='/explore'>Explore</Link>
      <Link href='/properties/7'>Property Details</Link>
    </View>
  );
}
