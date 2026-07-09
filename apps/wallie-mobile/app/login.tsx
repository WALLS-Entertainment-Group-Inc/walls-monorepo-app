import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Redirect } from "expo-router";

import { assets, colors, spacing, urls } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) {
    return <Redirect href="/chat" />;
  }

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : "Sign in failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.header}>
            <Image
              source={{ uri: assets.wallsLogoIndented }}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="WALLS logo"
            />
            <Text style={styles.title}>Login.</Text>
          </View>

          <View style={styles.form}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!submitting}
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoComplete="password"
              editable={!submitting}
              returnKeyType="go"
              onSubmitEditing={() => {
                if (canSubmit && !submitting) {
                  void handleSignIn();
                }
              }}
            />

            <Pressable
              onPress={() => Linking.openURL(urls.portalResetPassword)}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                (!canSubmit || submitting) && styles.buttonDisabled,
              ]}
              onPress={handleSignIn}
              disabled={!canSubmit || submitting}
            >
              {submitting ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator color={colors.text} size="small" />
                  <Text style={styles.buttonText}>Signing in...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Sign in</Text>
              )}
            </Pressable>

            <Text style={styles.legal}>
              By continuing, you agree to our{" "}
              <Text
                style={styles.legalLink}
                onPress={() => Linking.openURL(urls.terms)}
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={styles.legalLink}
                onPress={() => Linking.openURL(urls.privacy)}
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  logo: {
    width: 65,
    height: 65,
    marginRight: spacing.md,
    marginTop: 4,
  },
  title: {
    fontSize: 56,
    fontWeight: "700",
    letterSpacing: -1.5,
    color: colors.text,
  },
  form: {
    width: "100%",
    maxWidth: 448,
    alignSelf: "center",
    gap: spacing.md,
  },
  errorBox: {
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.dangerBackground,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    backgroundColor: colors.inputBackground,
    color: colors.text,
  },
  forgotPassword: {
    alignSelf: "flex-start",
  },
  forgotPasswordText: {
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: "underline",
  },
  button: {
    height: 64,
    borderRadius: 9999,
    backgroundColor: colors.wallsYellow,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  buttonText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  legal: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  legalLink: {
    color: colors.wallsLight,
    textDecorationLine: "underline",
  },
});
