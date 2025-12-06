import { Navbar } from "@/components/Landing/Navbar";
import { Hero } from "@/components/Landing/Hero";
import { Features } from "@/components/Landing/Features";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>CentsAI - AI-Powered Personal Finance Tracker</title>
        <meta
          name="description"
          content="Track your expenses effortlessly with AI. Simply tell CentsAI what you spent, and let our intelligent system categorize and organize your finances."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <Features />
        <footer className="py-8 border-t border-border">
          <div className="container px-4 text-center text-muted-foreground text-sm">
            © 2025 CentsAI. Built with intelligence.
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
