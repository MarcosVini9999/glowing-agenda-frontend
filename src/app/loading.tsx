import { LoaderCircle } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="relative flex items-center justify-center h-screen">
      <div className="flex items-center space-x-2">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    </div>
  );
}
