import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { GlassSurface } from "@/components/GlassSurface";
import { TwoLineMenuIcon } from "@/components/TwoLineMenuIcon";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

interface MenuButtonProps {
  onPress: () => void;
}

export function MenuButton({ onPress }: MenuButtonProps) {
  const progress = useSharedValue(0);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.value, [0, 1], [1, 0.94]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, -4])}deg` },
    ],
  }));

  const handlePress = () => {
    progress.value = withSequence(
      withTiming(1, { duration: 200, easing: EASE }),
      withTiming(0, { duration: 280, easing: EASE }),
    );
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Open conversations"
    >
      <Animated.View style={buttonStyle}>
        <GlassSurface
          borderRadius={22}
          intensity={60}
          contentStyle={styles.glassContent}
          style={styles.glass}
        >
          <TwoLineMenuIcon progress={progress} />
        </GlassSurface>
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  glass: {
    width: 44,
    height: 44,
  },
  glassContent: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
