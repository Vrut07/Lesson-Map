import Navbar from "@/components/Nav/Navbar";
import { AuroraText } from "@/components/ui/aurora-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HiCheckCircle } from "react-icons/hi";

const plans = [
  {
    name: "Free Plan",
    price: "$0 / month",
    features: [
      "1 Course",
      "Unlimited lessons",
      "Visual course dashboard",
      "Manual outline creation",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro Plan",
    price: "$15 / month",
    features: [
      "Everything in Free plan",
      "Unlimited Courses",
      "Custom Domain Support",
      "AI Outline Generator",
      "AI Assisted Course Creation",
      "Progress Indicators for your students",
      "PDF export",
      "Password protection",
    ],
    isPopular: true,
    cta: "Upgrade Now",
  },
];

const PricingPage = () => {
  return (
    <>
      <Navbar />
      <section className="mt-36 pb-20 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="text-center space-y-4 px-5">
          <h1 className="text-4xl font-bold">
            <AuroraText>Map your lessons</AuroraText>. Grow your courses
          </h1>
          <p className="text-lg w-full mx-auto">
            Choose the plan that fits your teaching journey. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-10 w-full max-w-4xl px-5">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={cn(
                "border relative flex h-fit flex-col items-start justify-between w-full",
                plan.isPopular ? "border-primary scale-105" : ""
              )}
            >
              {plan.isPopular && (
                <Badge className="absolute top-4 right-4">Recommended</Badge>
              )}
              <CardContent>
                <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
                <p className="text-2xl text-primary font-bold mb-6">{plan.price}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <HiCheckCircle className="text-primary" /> {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="w-full">
                <Button className="w-full" size="lg">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default PricingPage;
