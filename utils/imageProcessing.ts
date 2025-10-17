import { ImageManipulatorContext, SaveFormat } from "expo-image-manipulator";
import { createAssetAsync } from "expo-media-library";
import { Alert } from "react-native";

export type ImageFormat = "jpeg" | "png" | "webp" | "jpg" | "pdf" | "bmp";
export const imageConverter = async (
  format: ImageFormat,
  context: ImageManipulatorContext,
  keepExif: boolean,
) => {
  try {
    const imageContext = await context.renderAsync();

    let result;
    if (format === "jpeg" || format === "jpg") {
      result = await imageContext.saveAsync({
        format: SaveFormat.JPEG,
        base64: keepExif,
      });
    } else if (format === "png") {
      result = await imageContext.saveAsync({
        base64: keepExif,
        format: SaveFormat.PNG,
      });
    } else if (format === "webp") {
      result = await imageContext.saveAsync({
        base64: keepExif,
        format: SaveFormat.WEBP,
      });
    }

    if (!result?.uri) return;
    await createAssetAsync(result.uri);
    Alert.alert("Saved", "Image saved Successfully");
  } catch (error) {
    Alert.alert("❌ Error", "Something went wrong while saving the image.");
  }
};
