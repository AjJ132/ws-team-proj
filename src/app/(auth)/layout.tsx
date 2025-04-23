// app/@auth/layout.tsx
import type { Metadata } from "next";
import "../globals.css";


export const metadata: Metadata = {
  title: "Prism",
  description: "",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center">
        {children}
      </main>
    </>
  );
}