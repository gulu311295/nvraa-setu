import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-navy-950 bg-mesh">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
