import { Sparkles, BarChart3, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Input",
    description: "Just type naturally. Our AI understands 'spent ₹50 on lunch' and categorizes it instantly.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "Beautiful charts and breakdowns show exactly where your money goes each month.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is encrypted and protected with bank-level security.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Add expenses in seconds. No complicated forms, just quick and easy tracking.",
  },
];

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-gradient">CentsAI</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The smartest way to track your personal finances
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
