import { ArrowRight, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  const buttons = !Boolean(localStorage.getItem("token")) ? (
    <>
      <Button variant="hero" size="xl" asChild>
        <Link to="/register">
          Get Started Free
          <ArrowRight className="w-5 h-5" />
        </Link>
      </Button>
      <Button variant="glass" size="xl" asChild>
        <Link to="/login">Sign In</Link>
      </Button>
    </>
  ) : (
    <>
      <Button variant="hero" size="xl" asChild>
        <Link to="/dashboard">
          Go to Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
      </Button>
    </>
  );
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-soft"
        style={{ animationDelay: "1s" }}
      />

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              AI-Powered Finance Tracking
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Track Your <span className="text-gradient">Expenses</span>
            <br />
            With Intelligence
          </h1>

          {/* Subheadline */}
          <p
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Simply tell CentsAI what you spent, and let our AI categorize and
            organize your finances automatically.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            {buttons}
          </div>

          {/* Feature pills */}
          <div
            className="flex flex-wrap justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm">AI Categorization</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm">Expense Analytics</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm">Secure & Private</span>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div
          className="mt-20 max-w-3xl mx-auto animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="glass rounded-2xl p-6 card-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Type naturally
                  </p>
                  <p className="font-medium">
                    "I spent &#8377;45 on groceries today"
                  </p>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-400/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                    <span className="text-emerald-400">🛒</span>
                  </div>
                  <div>
                    <p className="font-medium">Groceries</p>
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-emerald-400">
                  &#8377; 45.00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
