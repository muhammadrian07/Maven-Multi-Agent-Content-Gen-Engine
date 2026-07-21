import type { AuthFormErrors } from "@/types/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export function validateLogin(input: {
  email: string;
  password: string;
}): AuthFormErrors {
  const errors: AuthFormErrors = {};

  if (!input.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!input.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function validateSignup(input: {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}): AuthFormErrors {
  const errors = validateLogin({
    email: input.email,
    password: input.password,
  });

  if (!input.full_name.trim()) {
    errors.full_name = "Full name is required.";
  }

  if (input.password && input.password.length < MIN_PASSWORD) {
    errors.password = `Password must be at least ${MIN_PASSWORD} characters.`;
  }

  if (!input.confirm_password) {
    errors.confirm_password = "Confirm your password.";
  } else if (input.password !== input.confirm_password) {
    errors.confirm_password = "Passwords do not match.";
  }

  return errors;
}

export function hasErrors(errors: AuthFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
