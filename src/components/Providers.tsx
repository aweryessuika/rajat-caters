"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { EnquiryProvider } from "@/components/EnquiryContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <EnquiryProvider>{children}</EnquiryProvider>
    </MotionConfig>
  );
}
