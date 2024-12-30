import icons from "@/constants/icons";
import images from "@/constants/images";
import { login } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { Redirect } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const { refetch, loading, isLogged } = useGlobalContext();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!loading && isLogged) return <Redirect href="/" />;

  const handleLogin = async () => {
    if (isLoggingIn) return; 

    try {
      setIsLoggingIn(true);
      const result = await login();
      
      if (result) {
        await refetch();
      } else {
        Alert.alert(
          "Login Error",
          "Failed to login. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert(
        "Error",
        "There was a problem connecting to Google. Please check your connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image 
          source={images.onboarding} 
          className="w-full h-4/6" 
          resizeMode="contain" 
        />
        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome to ReState
          </Text>
          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You Closer to {"\n"}
            <Text className="text-primary-300">Your Ideal Home</Text>
          </Text>
          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            Login to ReState with Google
          </Text>
          <TouchableOpacity 
            onPress={handleLogin}
            disabled={isLoggingIn}
            className={`bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5 
              ${isLoggingIn ? 'opacity-70' : ''}`}
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                {isLoggingIn ? 'Iniciando sesión...' : 'Continue with Google'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignIn;