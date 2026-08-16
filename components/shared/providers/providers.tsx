"use client";

import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import NextTopLoader from "nextjs-toploader";
interface ProvidersProps {
  children: ReactNode;
}
export const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>

      <NextTopLoader />
    </>
  );
};
