import { useTheme } from "@/context/ThemeContext";
import type { ImageSource } from "@/utils/imagePicker";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { imageConverter, ImageFormat } from "@/utils/imageProcessing";
import { useImageManipulator } from "expo-image-manipulator";
import { requestMediaLibraryPermissionsAsync } from "expo-image-picker";

const SingleConverterScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const params = useLocalSearchParams();

  const [selectedImage, setSelectedImage] = useState<ImageSource | null>(null);

  const [targetFormat, setTargetFormat] = useState<ImageFormat>("jpeg");

  const [keepExif, setKeepExif] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Parse navigation params once
  useEffect(() => {
    if (params.imageUri) {
      setSelectedImage({
        uri: params.imageUri as string,
        width: parseInt(params.imageWidth as string, 10),
        height: parseInt(params.imageHeight as string, 10),
        fileSize: params.imageFileSize
          ? parseInt(params.imageFileSize as string, 10)
          : undefined,
      });
    }
  }, [
    params.imageUri,
    params.imageWidth,
    params.imageHeight,
    params.imageFileSize,
  ]);

  const context = useImageManipulator(selectedImage?.uri ?? "");
  const handleConvertAndSave = async (format: ImageFormat) => {
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to save images.");
      return;
    }
    if (
      format === "jpeg" ||
      format === "png" ||
      format === "jpg" ||
      format === "webp"
    ) {
      imageConverter(format, context, keepExif);
    }
  };

  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const cardBgColor = isDark ? "bg-gray-800" : "bg-white";
  const cardBorderColor = isDark ? "border-gray-700" : "border-gray-200";

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View className="flex-1 px-4 py-2">
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className={`p-2 rounded-full ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            }`}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text className={`text-2xl font-bold ${textColor} ml-4`}>
            Single Convert
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Selected Image Preview */}
          <View
            className={`p-4 rounded-xl ${cardBgColor} border ${cardBorderColor} mb-4`}
          >
            <Text className={`text-lg font-semibold ${textColor} mb-3`}>
              Selected Image
            </Text>
            {selectedImage?.uri ? (
              <View className="items-center">
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={{ width: 200, height: 200 }}
                  contentFit="contain"
                  className="rounded-lg mb-2"
                />
              </View>
            ) : (
              <Text
                className={`${isDark ? "text-gray-300" : "text-gray-700"} text-center`}
              >
                No image selected.
              </Text>
            )}
          </View>

          {/* Conversion Options */}
          <View
            className={`p-4 rounded-xl ${cardBgColor} border ${cardBorderColor} mb-4`}
          >
            <Text className={`text-lg font-semibold ${textColor} mb-3`}>
              Conversion Options
            </Text>

            {/* Format Selection */}
            <View className="mb-4">
              <Text
                className={`mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Target Format
              </Text>
              <View className="flex-row flex-wrap">
                {(
                  ["jpeg", "png", "webp", "jpg", "bmp", "pdf"] as ImageFormat[]
                ).map((format) => (
                  <TouchableOpacity
                    key={format}
                    onPress={() => setTargetFormat(format)}
                    className={`mr-3 mb-2 px-4 py-2 rounded-lg ${
                      targetFormat === format
                        ? isDark
                          ? "bg-blue-600"
                          : "bg-blue-500"
                        : isDark
                          ? "bg-gray-700"
                          : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        targetFormat === format
                          ? "text-white font-medium"
                          : isDark
                            ? "text-gray-300"
                            : "text-gray-700"
                      }
                    >
                      {format.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quality Slider */}

            {/* EXIF Option */}
            <TouchableOpacity
              onPress={() => setKeepExif(!keepExif)}
              className="flex-row items-center mb-4"
            >
              <View
                className={`w-5 h-5 rounded mr-2 border ${
                  keepExif
                    ? isDark
                      ? "bg-blue-600 border-blue-600"
                      : "bg-blue-500 border-blue-500"
                    : isDark
                      ? "border-gray-600"
                      : "border-gray-400"
                }`}
              >
                {keepExif && (
                  <Ionicons name="checkmark" size={18} color="white" />
                )}
              </View>
              <Text className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Keep EXIF Data
              </Text>
            </TouchableOpacity>
          </View>

          {/* Processed Image Preview */}

          {/* Action Buttons */}
          <View className="flex-row space-x-3 mb-6">
            <TouchableOpacity
              onPress={() => handleConvertAndSave(targetFormat)}
              disabled={!selectedImage || isProcessing}
              className={`flex-1 py-3 rounded-lg items-center justify-center ${
                !selectedImage || isProcessing
                  ? "bg-gray-500"
                  : isDark
                    ? "bg-blue-600"
                    : "bg-blue-500"
              }`}
            >
              <Text className="text-white font-semibold">Convert & Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SingleConverterScreen;

// import { useTheme } from "@/context/ThemeContext";
// import { ImageSource } from "@/utils/imagePicker";

// import { Ionicons } from "@expo/vector-icons";
// import Slider from "@react-native-community/slider";
// import { Image } from "expo-image";
// import { SaveFormat, useImageManipulator } from "expo-image-manipulator";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import React, { useEffect, useState } from "react";
// import { ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// export type ImageFormat = "jpeg" | "png" | "webp";
// const SingleConverterScreen: React.FC = () => {
//   const router = useRouter();
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const params = useLocalSearchParams();

//   // destructure fields we need from params (so we can depend on stable primitives)
//   const imageUri = params.imageUri as string | undefined;
//   const imageWidth = params.imageWidth as string | undefined;
//   const imageHeight = params.imageHeight as string | undefined;
//   const imageFileSize = params.imageFileSize as string | undefined;
//   // const imageMimeType = params.imageMimeType as string | undefined; // optional

//   const [selectedImage, setSelectedImage] = useState<ImageSource | null>(null);
//   const [processedImage, setProcessedImage] = useState<ImageSource | null>(
//     null,
//   );
//   const [targetFormat, setTargetFormat] = useState<ImageFormat>("jpeg");
//   const [quality, setQuality] = useState(0.8);
//   const [keepExif, setKeepExif] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [rotate, setRotate] = useState<number>();
//   useEffect(() => {
//     if (params.imageUri && params.imageWidth && params.imageHeight) {
//       setSelectedImage({
//         uri: params.imageUri as string,
//         width: parseInt(params.imageWidth as string),
//         height: parseInt(params.imageHeight as string),
//         fileSize: params.imageFileSize
//           ? parseInt(params.imageFileSize as string)
//           : undefined,
//       });
//     }
//   }, [params]);

//   // Utility: format bytes nicely

//   const handleConvertAndSave = async (targetFormat: ImageFormat) => {
//     let context;
//     if (selectedImage?.uri) {
//       context = useImageManipulator(selectedImage.uri);
//     }

//     try {
//       const image = context ? await context.renderAsync() : null;

//       if (image) {
//         const result = await image.saveAsync({
//           compress: quality,
//           format: SaveFormat.PNG,
//         });
//         setProcessedImage(result);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Colors based on theme
//   const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
//   const textColor = isDark ? "text-white" : "text-gray-900";
//   const cardBgColor = isDark ? "bg-gray-800" : "bg-white";
//   const cardBorderColor = isDark ? "border-gray-700" : "border-gray-200";

//   return (
//     <SafeAreaView className={`flex-1 ${bgColor}`}>
//       <StatusBar style={isDark ? "light" : "dark"} />
//       <View className="flex-1 px-4 py-2">
//         {/* Header */}
//         <View className="flex-row items-center mb-4">
//           <TouchableOpacity
//             onPress={() => router.back()}
//             className={`p-2 rounded-full ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
//           >
//             <Ionicons
//               name="arrow-back"
//               size={24}
//               color={isDark ? "white" : "black"}
//             />
//           </TouchableOpacity>
//           <Text className={`text-2xl font-bold ${textColor} ml-4`}>
//             Single Convert
//           </Text>
//         </View>

//         <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
//           {/* Selected Image Preview */}
//           <View
//             className={`p-4 rounded-xl ${cardBgColor} border ${cardBorderColor} mb-4`}
//           >
//             <Text className={`text-lg font-semibold ${textColor} mb-3`}>
//               Selected Image
//             </Text>
//             {selectedImage ? (
//               <View className="items-center">
//                 <Image
//                   source={{ uri: selectedImage.uri }}
//                   style={{ width: 200, height: 200 }}
//                   contentFit="contain"
//                   className="rounded-lg mb-2"
//                 />
//                 <Text
//                   className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
//                 >
//                   Original Size: {selectedImage.width}x{selectedImage.height}
//                   {/* {selectedImage.fileSize &&
//                     ` (${formatSize(selectedImage.fileSize)})`} */}
//                 </Text>

//                 <View className="flex-row mt-3 space-x-2">
//                   <TouchableOpacity
//                     // onPress={handleCrop}
//                     className={`py-2 px-4 rounded-lg ${
//                       isDark ? "bg-blue-600" : "bg-blue-500"
//                     }`}
//                   >
//                     <Text className="text-white">Crop (quick)</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             ) : (
//               <Text
//                 className={`${isDark ? "text-gray-300" : "text-gray-700"} text-center`}
//               >
//                 No image selected.
//               </Text>
//             )}
//           </View>

//           {/* Conversion Options */}
//           <View
//             className={`p-4 rounded-xl ${cardBgColor} border ${cardBorderColor} mb-4`}
//           >
//             <Text className={`text-lg font-semibold ${textColor} mb-3`}>
//               Conversion Options
//             </Text>

//             {/* Format Selection */}
//             <View className="mb-4">
//               <Text
//                 className={`mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
//               >
//                 Target Format
//               </Text>
//               <View className="flex-row flex-wrap">
//                 {(["jpeg", "png", "webp", "pdf"] as ImageFormat[]).map(
//                   (format) => (
//                     <TouchableOpacity
//                       key={format}
//                       onPress={() => setTargetFormat(format)}
//                       className={`mr-3 mb-2 px-4 py-2 rounded-lg ${
//                         targetFormat === format
//                           ? isDark
//                             ? "bg-blue-600"
//                             : "bg-blue-500"
//                           : isDark
//                             ? "bg-gray-700"
//                             : "bg-gray-200"
//                       }`}
//                     >
//                       <Text
//                         className={
//                           targetFormat === format
//                             ? "text-white font-medium"
//                             : isDark
//                               ? "text-gray-300"
//                               : "text-gray-700"
//                         }
//                       >
//                         {format.toUpperCase()}
//                       </Text>
//                     </TouchableOpacity>
//                   ),
//                 )}
//               </View>
//             </View>

//             {/* Quality Slider */}
//             <View className="mb-4">
//               <View className="flex-row justify-between items-center">
//                 <Text
//                   className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
//                 >
//                   Quality
//                 </Text>
//                 <Text
//                   className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
//                 >
//                   {Math.round(quality * 100)}%
//                 </Text>
//               </View>
//               <Slider
//                 value={quality}
//                 onValueChange={(val) => setQuality(val)}
//                 minimumValue={0.1}
//                 maximumValue={1}
//                 step={0.05}
//                 minimumTrackTintColor={isDark ? "#3b82f6" : "#2563eb"}
//                 maximumTrackTintColor={isDark ? "#4b5563" : "#d1d5db"}
//                 thumbTintColor={isDark ? "#60a5fa" : "#3b82f6"}
//               />
//             </View>

//             {/* EXIF Data Option */}
//             <TouchableOpacity
//               onPress={() => setKeepExif(!keepExif)}
//               className="flex-row items-center mb-4"
//             >
//               <View
//                 className={`w-5 h-5 rounded mr-2 border ${
//                   keepExif
//                     ? isDark
//                       ? "bg-blue-600 border-blue-600"
//                       : "bg-blue-500 border-blue-500"
//                     : isDark
//                       ? "border-gray-600"
//                       : "border-gray-400"
//                 }`}
//               >
//                 {keepExif && (
//                   <Ionicons name="checkmark" size={18} color="white" />
//                 )}
//               </View>
//               <Text className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
//                 Keep EXIF Data
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Processed Image Preview */}
//           {processedImage && (
//             <View
//               className={`p-4 rounded-xl ${cardBgColor} border ${cardBorderColor} mb-4`}
//             >
//               <Text className={`text-lg font-semibold ${textColor} mb-3`}>
//                 Processed Image
//               </Text>
//               <View className="items-center">
//                 <Image
//                   source={{ uri: processedImage.uri }}
//                   style={{ width: 200, height: 200 }}
//                   contentFit="contain"
//                   className="rounded-lg mb-2"
//                 />
//                 <Text
//                   className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
//                 >
//                   Converted Size: {processedImage.width}x{processedImage.height}
//                   {/* {processedImage.fileSize &&
//                     ` (${formatSize(processedImage.fileSize)})`} */}
//                 </Text>
//               </View>
//             </View>
//           )}

//           {/* Action Buttons */}
//           <View className="flex-row space-x-3 mb-6">
//             <TouchableOpacity
//               onPress={() => handleConvertAndSave(targetFormat)}
//               disabled={!selectedImage || isProcessing}
//               className={`flex-1 py-3 rounded-lg items-center justify-center ${
//                 !selectedImage || isProcessing
//                   ? "bg-gray-500"
//                   : isDark
//                     ? "bg-blue-600"
//                     : "bg-blue-500"
//               }`}
//             >
//               Save Image
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default SingleConverterScreen;
