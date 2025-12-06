import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Send } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface AIInputProps {
  onSuccess: () => void;
}

export function AIInput({ onSuccess }: AIInputProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      await api.addTransactionAI(prompt);
      toast.success("Transaction added via AI!");
      setPrompt("");
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to process");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <Input
            placeholder='Try: "I spent &#8377;45 on groceries today"'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 border-0 bg-secondary/50 focus-visible:ring-primary/50"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Add with AI</span>
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
