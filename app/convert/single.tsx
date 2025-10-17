import { useTheme } from "@/context/ThemeContext";
import {
  ImageSource,
  pickImageFromCamera,
  pickImageFromFileManager,
  pickImageFromGallery,
} from "@/utils/imagePicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SingleConverterScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Colors based on theme
  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const cardBgColor = isDark ? "bg-gray-800" : "bg-white";
  const cardBorderColor = isDark ? "border-gray-700" : "border-gray-200";

  const handlePickImage = async (
    source: "camera" | "gallery" | "fileManager",
  ) => {
    try {
      let result: ImageSource | null = null;
      if (source === "camera") {
        result = await pickImageFromCamera();
      } else if (source === "gallery") {
        const galleryResult = await pickImageFromGallery(false);
        if (galleryResult && galleryResult.length > 0) {
          result = galleryResult[0];
        }
      } else if (source === "fileManager") {
        result = await pickImageFromFileManager();
      }

      if (result) {
        router.push({
          pathname: "./single-convert",
          params: {
            imageUri: result.uri,
            imageWidth: result.width,
            imageHeight: result.height,
            imageFileSize: result.fileSize,
            // imageMimeType: "image/jpeg",
            imageMimeType: result.type,
          },
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View className="flex-1 px-4 py-2">
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className={`p-2 rounded-full ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text className={`text-2xl font-bold ${textColor} ml-4`}>
            Single Image
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Image Selection */}
          <View
            className={`p-4 rounded-xl ${cardBgColor} border ${cardBorderColor} mb-4`}
          >
            <Text className={`text-lg font-semibold ${textColor} mb-3`}>
              Select Image
            </Text>
            <View className="flex-row flex-wrap gap-8 justify-around mb-4">
              <TouchableOpacity
                onPress={() => handlePickImage("camera")}
                className={`py-3 px-6 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-200"} flex-row items-center`}
              >
                <Ionicons
                  name="camera"
                  size={20}
                  color={isDark ? "#60a5fa" : "#2563eb"}
                />
                <Text className={`ml-2 ${textColor}`}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlePickImage("gallery")}
                className={`py-3 px-6 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-200"} flex-row items-center`}
              >
                <Ionicons
                  name="images"
                  size={20}
                  color={isDark ? "#60a5fa" : "#2563eb"}
                />
                <Text className={`ml-2 ${textColor}`}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlePickImage("fileManager")}
                className={`py-3 px-6 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-200"} flex-row items-center`}
              >
                <Ionicons
                  name="folder"
                  size={20}
                  color={isDark ? "#60a5fa" : "#2563eb"}
                />
                <Text className={`ml-2 ${textColor}`}>Files</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SingleConverterScreen;
