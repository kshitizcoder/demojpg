import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const cardBgColor = isDark ? "bg-gray-800" : "bg-white";
  const cardBorderColor = isDark ? "border-gray-700" : "border-gray-200";

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-4 py-6">
        <Text className={`text-3xl font-bold ${textColor} mb-2`}>
          Image Converter
        </Text>
        <Text
          className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"} mb-8`}
        >
          Convert, resize, and optimize your images
        </Text>

        <View className="gap-5 ">
          {/* Single Image Conversion */}
          <TouchableOpacity
            className={`p-6 rounded-xl ${cardBgColor} border ${cardBorderColor} flex-row items-center`}
            onPress={() => router.push("./convert/single")}
          >
            <View
              className={`w-12 h-12 rounded-full ${isDark ? "bg-blue-900" : "bg-blue-100"} items-center justify-center mr-4`}
            >
              <Ionicons
                name="image"
                size={24}
                color={isDark ? "#60a5fa" : "#2563eb"}
              />
            </View>
            <View className="flex-1">
              <Text className={`text-xl font-semibold ${textColor}`}>
                Convert Single Image
              </Text>
              <Text className={isDark ? "text-gray-400" : "text-gray-500"}>
                Convert, resize, and optimize a single image
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={isDark ? "#60a5fa" : "#2563eb"}
            />
          </TouchableOpacity>

          {/* Multiple Image Conversion */}
          <TouchableOpacity
            className={`p-6 rounded-xl ${cardBgColor} border ${cardBorderColor} flex-row items-center`}
            // onPress={() => router.push("/multiple")}
          >
            <View
              className={`w-12 h-12 rounded-full ${isDark ? "bg-purple-900" : "bg-purple-100"} items-center justify-center mr-4`}
            >
              <Ionicons
                name="images"
                size={24}
                color={isDark ? "#c084fc" : "#7e22ce"}
              />
            </View>
            <View className="flex-1">
              <Text className={`text-xl font-semibold ${textColor}`}>
                Convert Multiple Images
              </Text>
              <Text className={isDark ? "text-gray-400" : "text-gray-500"}>
                Batch convert multiple images at once
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={isDark ? "#c084fc" : "#7e22ce"}
            />
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            className={`p-6 rounded-xl ${cardBgColor} border ${cardBorderColor} flex-row items-center`}
            // onPress={() => router.push("/settings")}
          >
            <View
              className={`w-12 h-12 rounded-full ${isDark ? "bg-green-900" : "bg-green-100"} items-center justify-center mr-4`}
            >
              <Ionicons
                name="settings"
                size={24}
                color={isDark ? "#4ade80" : "#16a34a"}
              />
            </View>
            <View className="flex-1">
              <Text className={`text-xl font-semibold ${textColor}`}>
                Settings
              </Text>
              <Text className={isDark ? "text-gray-400" : "text-gray-500"}>
                Customize app appearance and preferences
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={isDark ? "#4ade80" : "#16a34a"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
