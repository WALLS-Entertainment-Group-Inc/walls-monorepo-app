import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { WallieThread } from "@walls/wallie-core";

import { colors, spacing } from "@/constants/theme";

interface ThreadActionMenuProps {
  thread: WallieThread | null;
  visible: boolean;
  onClose: () => void;
  onPin: (threadId: string) => void;
  onRename: (thread: WallieThread) => void;
  onArchive: (threadId: string) => void;
  onDelete: (threadId: string) => void;
}

export function ThreadActionMenu({
  thread,
  visible,
  onClose,
  onPin,
  onRename,
  onArchive,
  onDelete,
}: ThreadActionMenuProps) {
  if (!thread) return null;

  const title = thread.title?.trim() || "New Chat";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.menuCard} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.menuTitle} numberOfLines={2}>
            {title}
          </Text>

          <View style={styles.menuItems}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                onClose();
                onPin(thread.id);
              }}
            >
              <Text style={styles.menuItemText}>
                {thread.is_pinned ? "Unpin" : "Pin"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                onClose();
                onRename(thread);
              }}
            >
              <Text style={styles.menuItemText}>Rename</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                onClose();
                onArchive(thread.id);
              }}
            >
              <Text style={styles.menuItemText}>Archive</Text>
            </Pressable>

            <Pressable
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={() => {
                onClose();
                onDelete(thread.id);
              }}
            >
              <Text style={styles.menuItemDangerText}>Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  menuCard: {
    width: "100%",
    maxWidth: 280,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    paddingVertical: spacing.sm,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  menuItems: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    gap: 2,
  },
  menuItem: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
  },
  menuItemText: {
    fontSize: 15,
    color: "#374151",
  },
  menuItemDanger: {
    marginTop: 2,
  },
  menuItemDangerText: {
    fontSize: 15,
    color: colors.danger,
    fontWeight: "500",
  },
});
