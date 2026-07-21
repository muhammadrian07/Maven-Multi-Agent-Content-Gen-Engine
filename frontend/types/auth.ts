export type User = {
  id: string | number;
  email: string;
  full_name: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type AuthResponse = AuthTokens & {
  user: User;
};

export type RegisterPayload = {
  email: string;
  password: string;
  full_name: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type GoogleAuthPayload = {
  id_token: string;
};

export type RefreshPayload = {
  refresh: string;
};

export type RefreshResponse = {
  access: string;
};

export type AuthFormErrors = {
  full_name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  form?: string;
};
