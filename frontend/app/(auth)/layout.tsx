import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s · Maven",
    default: "Account · Maven",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
