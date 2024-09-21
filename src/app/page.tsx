"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  return (
    <>{isAdmin ? router.push("/calendario") : router.push("/agendamento")}</>
  );
}
