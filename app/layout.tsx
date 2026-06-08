import type { Metadata } from "next";
// @ts-ignore
import "@/app/globals.css";
import Navbar from "@/components/Nav/Navbar";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "LessonMap - Map Out Your Courses in Minutes",
  description:
    "Easily outline modules, lessons, and steps with a clean, visual dashboard designed to give structure to your entire course journey.",
};

export default function MainRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={``}>
        <Providers>
          <main className="">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
