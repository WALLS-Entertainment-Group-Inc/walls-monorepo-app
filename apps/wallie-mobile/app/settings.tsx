import {
  Children,
  Fragment,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing, type AppColors, type ThemePreference } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useAppleHealth } from "@/hooks/useAppleHealth";
import { getSupabase } from "@/lib/supabase";

type IconName = keyof typeof Ionicons.glyphMap;

function initialsFrom(name: string | null, email: string | null | undefined) {
  const trimmed = name?.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

function themeLabel(preference: ThemePreference): string {
  switch (preference) {
    case "light":
      return "Light";
    case "dark":
      return "Dark";
    default:
      return "System";
  }
}

function formatSyncedAt(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

function SettingsGroup({
  title,
  children,
  footer,
  colors,
  styles,
}: {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
}) {
  const items = Children.toArray(children).filter(Boolean);

  return (
    <View style={styles.groupWrap}>
      {title ? <Text style={styles.groupTitle}>{title}</Text> : null}
      <View style={styles.groupCard}>
        {items.map((child, index) => (
          <Fragment key={index}>
            {child}
            {index < items.length - 1 ? (
              <View style={styles.dividerWrap}>
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: colors.borderMuted },
                  ]}
                />
              </View>
            ) : null}
          </Fragment>
        ))}
        {footer}
      </View>
    </View>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  destructive,
  accent,
  showChevron,
  right,
  disabled,
  colors,
  styles,
}: {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  accent?: boolean;
  showChevron?: boolean;
  right?: ReactNode;
  disabled?: boolean;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
}) {
  const labelColor = destructive
    ? colors.danger
    : accent
      ? colors.wallsBlue
      : colors.text;
  const iconColor = destructive
    ? colors.danger
    : accent
      ? colors.wallsBlue
      : colors.text;

  const content = (
    <>
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text style={[styles.rowLabel, { color: labelColor }]} numberOfLines={1}>
        {label}
      </Text>
      {value ? (
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {right}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.row,
          pressed && { backgroundColor: colors.pressedOverlay },
          disabled && { opacity: 0.55 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{content}</View>;
}

function createStyles(colors: AppColors, isDark: boolean) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: isDark ? colors.background : colors.neutral100,
    },
    topBar: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xs,
      paddingBottom: spacing.sm,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? colors.inputBackground : colors.border,
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl * 2,
      gap: spacing.lg,
    },
    profile: {
      alignItems: "center",
      gap: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
    },
    avatarWrap: {
      width: 88,
      height: 88,
      borderRadius: 44,
      overflow: "hidden",
      backgroundColor: isDark ? colors.inputBackground : colors.border,
    },
    avatar: {
      width: "100%",
      height: "100%",
    },
    avatarFallback: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarInitials: {
      fontSize: 30,
      fontWeight: "600",
      color: colors.text,
    },
    profileName: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
      letterSpacing: -0.3,
    },
    groupWrap: {
      gap: spacing.sm,
    },
    groupTitle: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.textMuted,
      marginLeft: spacing.md,
      marginBottom: 2,
    },
    groupCard: {
      borderRadius: 20,
      backgroundColor: isDark ? colors.surface : "#FFFFFF",
      overflow: "hidden",
    },
    row: {
      minHeight: 52,
      paddingHorizontal: spacing.md,
      paddingVertical: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    rowLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: "400",
      color: colors.text,
    },
    rowValue: {
      maxWidth: "48%",
      fontSize: 15,
      color: colors.textMuted,
      textAlign: "right",
    },
    dividerWrap: {
      paddingLeft: 52,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
    },
    healthHint: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.textMuted,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      paddingTop: 2,
    },
    healthError: {
      fontSize: 12,
      color: colors.danger,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
    },
  });
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const { colors, isDark, themePreference, setThemePreference } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const {
    supported,
    enabled,
    status,
    lastError,
    lastSyncedAt,
    connect,
    disconnect,
  } = useAppleHealth();

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setDisplayName(null);
      setAvatarUrl(null);
      return;
    }

    let cancelled = false;
    void getSupabase()
      .from("users")
      .select("first_name, last_name, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (cancelled || !data) return;
        const name = [data.first_name, data.last_name]
          .filter(Boolean)
          .join(" ")
          .trim();
        setDisplayName(name || null);
        setAvatarUrl(
          typeof data.avatar_url === "string" && data.avatar_url.length > 0
            ? data.avatar_url
            : null,
        );
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (!loading && !user) {
    return <Redirect href="/login" />;
  }

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => {
          void (async () => {
            setSigningOut(true);
            try {
              await signOut();
              router.replace("/login");
            } catch (error) {
              Alert.alert(
                "Sign out failed",
                error instanceof Error ? error.message : "Please try again.",
              );
            } finally {
              setSigningOut(false);
            }
          })();
        },
      },
    ]);
  };

  const handleThemePress = () => {
    Alert.alert("Theme", "Choose how Wallie looks", [
      {
        text: "System",
        onPress: () => void setThemePreference("system"),
      },
      {
        text: "Light",
        onPress: () => void setThemePreference("light"),
      },
      {
        text: "Dark",
        onPress: () => void setThemePreference("dark"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleHealthPress = () => {
    if (Platform.OS !== "ios") {
      Alert.alert(
        "Apple Health",
        "HealthKit sync is available on iPhone builds of Wallie.",
      );
      return;
    }

    if (!supported) {
      Alert.alert(
        "Apple Health",
        "HealthKit is not available on this device. Rebuild the iOS development client after installing HealthKit native modules.",
      );
      return;
    }

    if (enabled) {
      Alert.alert(
        "Apple Health",
        "Wallie keeps your Kenoo health profile updated automatically from Apple Health.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disconnect",
            style: "destructive",
            onPress: () => void disconnect(),
          },
        ],
      );
      return;
    }

    void connect();
  };

  const syncedLabel = formatSyncedAt(lastSyncedAt);
  const healthValue =
    Platform.OS !== "ios"
      ? "iPhone only"
      : !supported
        ? "Unavailable"
        : enabled
          ? "Connected"
          : "Not connected";
  const connecting = status === "syncing" && !enabled;

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.closeButton}
          accessibilityLabel="Close settings"
          hitSlop={12}
        >
          <Ionicons name="close" size={20} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profile}>
          <View style={styles.avatarWrap}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatar}
                accessibilityIgnoresInvertColors
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>
                  {initialsFrom(displayName, user?.email)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.profileName}>
            {displayName || "Your account"}
          </Text>
        </View>

        <SettingsGroup title="Account" colors={colors} styles={styles}>
          <SettingsRow
            icon="mail-outline"
            label="Email"
            value={user?.email ?? "—"}
            colors={colors}
            styles={styles}
          />
        </SettingsGroup>

        <SettingsGroup
          title="Health"
          colors={colors}
          styles={styles}
          footer={
            <>
              {enabled && syncedLabel ? (
                <Text style={styles.healthHint}>Last update {syncedLabel}</Text>
              ) : null}
              {lastError ? (
                <Text style={styles.healthError}>{lastError}</Text>
              ) : null}
            </>
          }
        >
          <SettingsRow
            icon="heart-outline"
            label="Apple Health"
            value={healthValue}
            onPress={handleHealthPress}
            showChevron
            disabled={connecting}
            right={
              connecting ? (
                <ActivityIndicator size="small" color={colors.iconMuted} />
              ) : null
            }
            colors={colors}
            styles={styles}
          />
        </SettingsGroup>

        <SettingsGroup title="Appearance" colors={colors} styles={styles}>
          <SettingsRow
            icon="contrast-outline"
            label="Theme"
            value={themeLabel(themePreference)}
            onPress={handleThemePress}
            showChevron
            colors={colors}
            styles={styles}
          />
        </SettingsGroup>

        <SettingsGroup colors={colors} styles={styles}>
          <SettingsRow
            icon="log-out-outline"
            label={signingOut ? "Signing out..." : "Sign out"}
            onPress={handleSignOut}
            destructive
            disabled={signingOut}
            colors={colors}
            styles={styles}
          />
        </SettingsGroup>
      </ScrollView>
    </SafeAreaView>
  );
}
