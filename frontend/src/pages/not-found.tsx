import { Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function NotFound() {
  usePageTitle('Page Not Found');

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <img src="/images/logo.png" alt="BSJ" className="h-20 w-20 mb-6 opacity-30" />
      <h1 className="font-heading font-black text-7xl md:text-9xl text-[#f97316] mb-4">404</h1>
      <p className="font-serif text-xl text-muted-foreground mb-2">
        This page doesn't exist — yet.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Maybe it's a story waiting to be told.
      </p>
      <Link
        to="/"
        className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-8 py-3 rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
