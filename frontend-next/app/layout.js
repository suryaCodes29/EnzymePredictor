import "./globals.css";
import React from "react";
import Providers from "../components/Providers";

export const metadata = {
  title: "EnzymeAI - Enzyme Prediction Dashboard",
  description: "AI-powered enzyme prediction dashboard with real-time analytics and protein visualization.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
