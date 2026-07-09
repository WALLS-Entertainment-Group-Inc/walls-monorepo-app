import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { WallieLoadingStatus } from "@walls/wallie-core";

import { spacing } from "@/constants/theme";
import type { WallieVoiceState } from "@/hooks/useWallieVoice";
import { VoiceOrb } from "@/components/VoiceOrb";

interface WallieVoiceOverlayProps {
  visible: boolean;
  state: WallieVoiceState;
  audioLevel?: number;
  loadingStatus?: WallieLoadingStatus;
  onClose: () => void;
}

function statusLabel(
  state: WallieVoiceState,
  loadingStatus?: WallieLoadingStatus,
): string {
  if (state === "listening") return "Listening…";
  if (state === "speaking") return "Speaking…";
  if (state === "processing") {
    if (loadingStatus === "searching") return "Searching the web…";
    if (loadingStatus === "people_search") return "Finding contacts…";
    return "Thinking…";
  }
  return "Starting…";
}

export function WallieVoiceOverlay({
  visible,
  state,
  audioLevel = 0,
  loadingStatus,
  onClose,
}: WallieVoiceOverlayProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <LinearGradient
        colors={["#09090b", "#111827", "#0a0a0a"]}
        locations={[0, 0.55, 1]}
        style={styles.container}
      >
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.45)",
            "transparent",
            "rgba(0,0,0,0.5)",
          ]}
          locations={[0, 0.45, 1]}
          style={styles.vignette}
          pointerEvents="none"
        />

        <Pressable
          onPress={onClose}
          style={[styles.closeButton, { top: insets.top + spacing.sm }]}
          accessibilityLabel="Exit voice mode"
        >
          <Ionicons name="close" size={22} color="rgba(255,255,255,0.72)" />
        </Pressable>

        <View style={styles.content}>
          <VoiceOrb state={state} audioLevel={audioLevel} />
          <Text style={styles.status}>{statusLabel(state, loadingStatus)}</Text>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: "absolute",
    right: spacing.md,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  status: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(161, 161, 170, 0.95)",
    textAlign: "center",
    letterSpacing: 0.35,
  },
});
