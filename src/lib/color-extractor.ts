import { useExtractColors } from "react-extract-colors";

export const extractColor = (image: string) => {
  try {
    const { colors, dominantColor, darkerColor, lighterColor, loading, error } =
      useExtractColors("https://proxy.josumaru.my.id/proxy?url=" + image);
    return darkerColor;
  } catch (error) {
    return "#ffffff";
  }
};
