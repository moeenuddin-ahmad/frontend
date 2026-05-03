import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col h-screen items-center justify-center gap-6">
      <h1 className="text-6xl font-extrabold text-neutral-800">404</h1>
      <p className="text-xl text-muted-foreground">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link to="/">Back to Products</Link>
      </Button>
    </div>
  );
}
