"use client";

import React, { Suspense } from "react";
import ContactContent from "@/components/ContactContent";

export default function Contact() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactContent />
    </Suspense>
  );
}
