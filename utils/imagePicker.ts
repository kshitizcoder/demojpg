import { getDocumentAsync } from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
export type ImageSource = {
  uri: string;
  width?: number;
  height?: number;
  fileName?: string | undefined;
  fileSize?: number;
  type?: string;
  flip?: string;
};

export const pickImageFromCamera = async (): Promise<ImageSource | null> => {
  // Request camera permissions
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== "granted") {
    alert("Sorry, we need camera permissions to make this work!");
    return null;
  }
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
      exif: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileName: asset.fileName ?? undefined,
        fileSize: asset.fileSize,
        type: asset.mimeType,
      };
    }
    return null;
  } catch (error) {
    console.error("Error picking image from camera:", error);
    return null;
  }
};

export const pickImageFromGallery = async (
  multiple = false,
): Promise<ImageSource[] | null> => {
  // Request media library permissions
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    alert("Sorry, we need media library permissions to make this work!");
    return null;
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: multiple,
      exif: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets.map((asset) => ({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileName: asset.fileName ?? undefined,
        fileSize: asset.fileSize,
        type: asset.mimeType,
      }));
    }
    return null;
  } catch (error) {
    console.error("Error picking image from gallery:", error);
    return null;
  }
};

export const getImageInfo = async (
  uri: string,
): Promise<MediaLibrary.Asset | null> => {
  try {
    const asset = await MediaLibrary.createAssetAsync(uri);
    return asset;
  } catch (error) {
    console.error("Error getting image info:", error);
    return null;
  }
};

export const pickImageFromFileManager =
  async (): Promise<ImageSource | null> => {
    try {
      const result = await getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (
        result.canceled === false &&
        result.assets &&
        result.assets.length > 0
      ) {
        const asset = result.assets[0];
        console.log("assets", asset);
        return {
          uri: asset.uri,
          fileName: asset.name,
          fileSize: asset.size,
          type: asset.mimeType ?? undefined,
        };
      }
      return null;
    } catch (error) {
      console.error("Error picking image from file manager:", error);
      return null;
    }
  };
