"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-2">
        <h2 className="font-semibold text-lg text-gray-text">Algo deu errado 😢😢</h2>
        <Button onClick={() => reset()}>Tentar novamente</Button>
      </div>
    </div>
  );
}
