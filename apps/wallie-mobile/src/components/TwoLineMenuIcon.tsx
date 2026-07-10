import { StyleSheet, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

interface TwoLineMenuIconProps {
  color?: string;
  size?: number;
}

export function TwoLineMenuIcon({
  color,
  size = 18,
}: TwoLineMenuIconProps) {
  const { colors } = useTheme();
  const barColor = color ?? colors.text;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.bar, { width: size, backgroundColor: barColor }]} />
      <View style={[styles.bar, { width: size, backgroundColor: barColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    gap: 5,
  },
  bar: {
    height: 2,
    borderRadius: 1,
  },
});
