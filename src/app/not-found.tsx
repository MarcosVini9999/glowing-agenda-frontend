import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-2">
        <h2 className="font-semibold text-lg text-gray-text">Página não encontrada, erro 404 ☹️</h2>
        <Link href="/">
          <Button>Retornar</Button>
        </Link>
      </div>
    </div>
  );
}
