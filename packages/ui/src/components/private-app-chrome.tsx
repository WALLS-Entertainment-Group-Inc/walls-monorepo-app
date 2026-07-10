"use client";

import AppHeader, { type AppHeaderProps } from "./app-header";
import {
  AppHeaderVisibilityProvider,
  useAppHeaderVisible,
} from "./app-header-context";
import UserProfileButton, {
  type UserProfileButtonProps,
} from "./user-profile-button";

export type PrivateAppChromeProps = AppHeaderProps;

/** Fixed app header with logo and profile controls. */
export function PrivateAppChrome(props: PrivateAppChromeProps) {
  return <AppHeader {...props} />;
}

export {
  AppHeader,
  AppHeaderVisibilityProvider,
  UserProfileButton,
  useAppHeaderVisible,
  type AppHeaderProps,
  type UserProfileButtonProps,
};
