"use client";

import AppHeader, { type AppHeaderProps } from "./app-header";
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
  UserProfileButton,
  type AppHeaderProps,
  type UserProfileButtonProps,
};
