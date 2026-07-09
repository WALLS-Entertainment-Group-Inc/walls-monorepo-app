import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import type { WallieVoiceState } from "@/hooks/useWallieVoice";

interface VoiceOrbProps {
  state: WallieVoiceState;
  audioLevel?: number;
}

interface OrbPalette {
  blobA: string;
  blobB: string;
  blobC: string;
  blobD: string;
  core: string;
  halo: string;
  rim: string;
}

function paletteForState(state: WallieVoiceState): OrbPalette {
  if (state === "listening") {
    return {
      blobA: "rgba(99, 102, 241, 0.85)",
      blobB: "rgba(34, 211, 238, 0.75)",
      blobC: "rgba(167, 139, 250, 0.7)",
      blobD: "rgba(244, 244, 245, 0.55)",
      core: "#18181b",
      halo: "rgba(99, 102, 241, 0.22)",
      rim: "rgba(255, 255, 255, 0.14)",
    };
  }
  if (state === "speaking") {
    return {
      blobA: "rgba(56, 189, 248, 0.9)",
      blobB: "rgba(37, 99, 235, 0.85)",
      blobC: "rgba(125, 211, 252, 0.75)",
      blobD: "rgba(224, 242, 254, 0.6)",
      core: "#0c1929",
      halo: "rgba(56, 189, 248, 0.28)",
      rim: "rgba(186, 230, 253, 0.2)",
    };
  }
  if (state === "processing") {
    return {
      blobA: "rgba(251, 146, 60, 0.9)",
      blobB: "rgba(244, 63, 94, 0.8)",
      blobC: "rgba(250, 204, 21, 0.75)",
      blobD: "rgba(255, 237, 213, 0.55)",
      core: "#1c1410",
      halo: "rgba(251, 146, 60, 0.26)",
      rim: "rgba(254, 215, 170, 0.18)",
    };
  }
  return {
    blobA: "rgba(161, 161, 170, 0.7)",
    blobB: "rgba(113, 113, 122, 0.65)",
    blobC: "rgba(212, 212, 216, 0.5)",
    blobD: "rgba(244, 244, 245, 0.4)",
    core: "#18181b",
    halo: "rgba(161, 161, 170, 0.18)",
    rim: "rgba(255, 255, 255, 0.1)",
  };
}

function useOrbMotion(state: WallieVoiceState, audioLevel: number) {
  const spinA = useSharedValue(0);
  const spinB = useSharedValue(0);
  const spinC = useSharedValue(0);
  const breathe = useSharedValue(0);
  const level = useSharedValue(0);

  useEffect(() => {
    level.value = withTiming(audioLevel, { duration: 90 });
  }, [audioLevel, level]);

  useEffect(() => {
    const spinDuration =
      state === "processing" ? 3200 : state === "speaking" ? 4800 : 11000;
    const breatheDuration =
      state === "listening" ? 1600 : state === "speaking" ? 1200 : 2000;

    spinA.value = withRepeat(
      withTiming(360, { duration: spinDuration, easing: Easing.linear }),
      -1,
      false,
    );
    spinB.value = withRepeat(
      withTiming(-360, {
        duration: spinDuration * 0.68,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    spinC.value = withRepeat(
      withTiming(360, {
        duration: spinDuration * 1.35,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: breatheDuration,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0, {
          duration: breatheDuration,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      false,
    );
  }, [breathe, spinA, spinB, spinC, state]);

  const orbitAStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinA.value}deg` }],
  }));

  const orbitBStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinB.value}deg` }],
  }));

  const orbitCStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinC.value}deg` }, { scale: 0.88 }],
  }));

  const haloStyle = useAnimatedStyle(() => {
    const pulse = 1 + breathe.value * 0.1 + level.value * 0.14;
    return {
      transform: [{ scale: pulse }],
      opacity: 0.45 + breathe.value * 0.35 + level.value * 0.25,
    };
  });

  const coreStyle = useAnimatedStyle(() => {
    const pulse =
      state === "listening"
        ? 1 + level.value * 0.1 + breathe.value * 0.04
        : 1 + breathe.value * 0.05;
    return {
      transform: [{ scale: pulse }],
    };
  });

  const meltStyle = useAnimatedStyle(() => ({
    opacity: 0.82 + breathe.value * 0.1,
    transform: [{ scale: 1.02 + breathe.value * 0.03 }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + breathe.value * 0.35 + level.value * 0.2,
    transform: [{ scale: 1.05 + breathe.value * 0.08 + level.value * 0.06 }],
  }));

  return { orbitAStyle, orbitBStyle, orbitCStyle, haloStyle, coreStyle, meltStyle, ringStyle };
}

export function VoiceOrb({ state, audioLevel = 0 }: VoiceOrbProps) {
  const palette = paletteForState(state);
  const {
    orbitAStyle,
    orbitBStyle,
    orbitCStyle,
    haloStyle,
    coreStyle,
    meltStyle,
    ringStyle,
  } = useOrbMotion(state, audioLevel);

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[
          styles.halo,
          { backgroundColor: palette.halo },
          haloStyle,
        ]}
      />

      <Animated.View
        style={[
          styles.ring,
          { borderColor: palette.rim },
          ringStyle,
        ]}
      />

      <View style={styles.field}>
        <Animated.View style={[styles.orbit, orbitCStyle]}>
          <View
            style={[
              styles.blob,
              styles.blobSm,
              { backgroundColor: palette.blobD, top: 4, left: 78 },
            ]}
          />
          <View
            style={[
              styles.blob,
              styles.blobSm,
              { backgroundColor: palette.blobA, bottom: 6, left: 12 },
            ]}
          />
        </Animated.View>

        <Animated.View style={[styles.orbit, orbitAStyle]}>
          <View
            style={[
              styles.blob,
              styles.blobLg,
              { backgroundColor: palette.blobA, top: 8, left: 42 },
            ]}
          />
          <View
            style={[
              styles.blob,
              styles.blobMd,
              { backgroundColor: palette.blobB, bottom: 18, right: 28 },
            ]}
          />
        </Animated.View>

        <Animated.View style={[styles.orbit, orbitBStyle]}>
          <View
            style={[
              styles.blob,
              styles.blobMd,
              { backgroundColor: palette.blobC, top: 52, right: 8 },
            ]}
          />
          <View
            style={[
              styles.blob,
              styles.blobSm,
              { backgroundColor: palette.blobD, bottom: 42, left: 18 },
            ]}
          />
        </Animated.View>

        <Animated.View style={[styles.melt, meltStyle]}>
          <BlurView intensity={68} tint="dark" style={StyleSheet.absoluteFill} />
        </Animated.View>

        <Animated.View style={[styles.meltSoft, meltStyle]}>
          <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />
        </Animated.View>

        <Animated.View
          style={[
            styles.core,
            { backgroundColor: palette.core, borderColor: palette.rim },
            coreStyle,
          ]}
        >
          <View style={styles.coreSheen} />
          <View style={styles.coreGlow} />
        </Animated.View>
      </View>
    </View>
  );
}

const ORB_SIZE = 260;
const FIELD_SIZE = 220;

const styles = StyleSheet.create({
  wrap: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
  },
  field: {
    width: FIELD_SIZE,
    height: FIELD_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: FIELD_SIZE + 28,
    height: FIELD_SIZE + 28,
    borderRadius: (FIELD_SIZE + 28) / 2,
    borderWidth: 1,
  },
  orbit: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
  },
  blobLg: {
    width: 118,
    height: 118,
  },
  blobMd: {
    width: 96,
    height: 96,
  },
  blobSm: {
    width: 72,
    height: 72,
  },
  melt: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: FIELD_SIZE / 2,
    overflow: "hidden",
  },
  meltSoft: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: FIELD_SIZE / 2,
    overflow: "hidden",
    opacity: 0.35,
  },
  core: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 16,
  },
  coreSheen: {
    position: "absolute",
    top: -20,
    left: -10,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  coreGlow: {
    position: "absolute",
    bottom: -24,
    right: -16,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
});
