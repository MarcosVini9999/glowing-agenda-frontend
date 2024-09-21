"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const isLoggedIn = false;

  return (
    <>{isLoggedIn ? router.push("/calendario") : router.push("/agendamento")}</>
  );
}
