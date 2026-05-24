"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { plans } from "@/constants";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

const PricingPage = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePurchase = async (plan: string) => {
    console.log(`Purchasing ${plan} plan...`);
    setLoadingPlan(plan);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();
      if (response.ok) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Failed to create checkout session.");
        console.error("Checkout error:", data.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
      console.error("Error purchasing plan:", error);
    } finally {
      setLoadingPlan(null);
    }
  };
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="mb-4 rounded-full px-4 py-1 text-xs font-medium"
          >
            Pricing
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Create and share beautiful course roadmaps
          </h1>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            Generate interactive learning experiences with AI-powered course
            outlines, polished student views, and embeddable curriculum maps.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={cn(
                "relative flex h-full flex-col rounded-3xl border bg-background/60 backdrop-blur transition-all duration-300",
                plan.isPopular
                  ? "border-primary shadow-2xl shadow-primary/10 lg:-translate-y-2"
                  : "border-border/60 hover:border-border",
              )}
            >
              {plan.isPopular && (
                <Badge className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-1 text-xs font-medium shadow-sm">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="space-y-4 pb-6">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {plan.name}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-end gap-1">
                  <span className="text-5xl font-semibold tracking-tight">
                    {plan.price}
                  </span>

                  <span className="mb-1 text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </div>

                      <span className="leading-6 text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6">
                <Button
                  onClick={() => handlePurchase(plan.name)}
                  size="lg"
                  className={cn(
                    "h-12 w-full rounded-xl text-sm font-medium",
                    !plan.isPopular &&
                      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  )}
                  disabled={loadingPlan === plan.name}
                >
                  {loadingPlan === plan.name && (
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPage;
