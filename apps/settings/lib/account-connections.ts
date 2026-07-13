export type SafeAccountConnection = {
  id: string;
  provider: string | null;
  service: string | null;
  provider_account_id: string | null;
  token_expiry: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string | null;
  token_payload?: Record<string, unknown> | null;
};

export type AccountConnectionRecord = {
  id: string;
  account_id: string;
  provider_account_id: string | null;
  access_token: string;
  refresh_token: string;
  token_expiry: string | null;
  token_payload: Record<string, unknown> | null;
};
