#!/usr/bin/env bash
# Fix @kingstinct/react-native-healthkit podspec for monorepo / EAS builds.
#
# The upstream podspec does:
#   load 'nitrogen/generated/ios/ReactNativeHealthkit+autolinking.rb'
# which is resolved relative to the *current working directory* (usually ios/),
# not the package root — so pod install fails on EAS with:
#   cannot load such file -- nitrogen/generated/ios/ReactNativeHealthkit+autolinking.rb
#
# Must run on CI/EAS as well as locally.

set -euo pipefail

APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MONOREPO_ROOT="$(cd "$APP_ROOT/../.." && pwd)"

patch_podspec() {
  local podspec="$1"
  if [[ ! -f "$podspec" ]]; then
    return 1
  fi

  if grep -q "File.join(__dir__, 'nitrogen/generated/ios/ReactNativeHealthkit+autolinking.rb')" "$podspec"; then
    return 0
  fi

  if ! grep -q "load 'nitrogen/generated/ios/ReactNativeHealthkit+autolinking.rb'" "$podspec"; then
    return 0
  fi

  # Portable in-place edit (macOS + Linux/EAS)
  if sed --version >/dev/null 2>&1; then
    sed -i "s|load 'nitrogen/generated/ios/ReactNativeHealthkit+autolinking.rb'|load File.join(__dir__, 'nitrogen/generated/ios/ReactNativeHealthkit+autolinking.rb')|" "$podspec"
  else
    sed -i '' "s|load 'nitrogen/generated/ios/ReactNativeHealthkit+autolinking.rb'|load File.join(__dir__, 'nitrogen/generated/ios/ReactNativeHealthkit+autolinking.rb')|" "$podspec"
  fi

  echo "Patched HealthKit podspec: $podspec"
  return 0
}

FOUND=0
CANDIDATES=(
  "$MONOREPO_ROOT/node_modules/@kingstinct/react-native-healthkit/ReactNativeHealthkit.podspec"
  "$APP_ROOT/node_modules/@kingstinct/react-native-healthkit/ReactNativeHealthkit.podspec"
  "$APP_ROOT/vendor/react-native-healthkit-10.1.0/ReactNativeHealthkit.podspec"
)

# pnpm may nest under .pnpm store paths.
# Use a temp file instead of process substitution (< <(...)) — /dev/fd is
# unavailable in some CI/Vercel install environments and fails with:
#   /dev/fd/63: No such file or directory
if [[ -d "$MONOREPO_ROOT/node_modules" ]]; then
  _hk_find_out="$(mktemp)"
  find "$MONOREPO_ROOT/node_modules" \
    -path '*@kingstinct/react-native-healthkit/ReactNativeHealthkit.podspec' \
    -print0 2>/dev/null > "$_hk_find_out" || true
  while IFS= read -r -d '' podspec; do
    CANDIDATES+=("$podspec")
  done < "$_hk_find_out"
  rm -f "$_hk_find_out"
fi

for podspec in "${CANDIDATES[@]}"; do
  if patch_podspec "$podspec"; then
    FOUND=1
  fi
done

if [[ "$FOUND" -eq 0 ]]; then
  echo "warn: ReactNativeHealthkit.podspec not found to patch (HealthKit may be uninstalled)"
fi
