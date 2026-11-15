"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FamilyRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/family/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading FamilyCare Dashboard...</p>
      </div>
    </div>
  );
}
