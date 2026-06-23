import { Card, CardContent } from "@/components/ui/card";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    number: "1",
    title: "Enter Pickup & Drop",
    description: "Enter your pickup and drop-off locations to get started",
    icon: "/assets/generated/book-online-icon-transparent.dim_64x64.png",
  },
  {
    number: "2",
    title: "Get Instant Price",
    description: "See transparent pricing with no hidden charges",
    icon: "/assets/generated/quote-calculator-transparent.dim_64x64.png",
  },
  {
    number: "3",
    title: "Book & Move",
    description: "Pay 25% advance and we handle the rest",
    icon: "/assets/generated/we-move-icon-transparent.dim_64x64.png",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Simple 3-step process to shift your home or office
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-6 md:p-8 text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl group-hover:scale-110 transition-transform">
                    <img
                      src={step.icon}
                      alt={step.title}
                      className="w-12 h-12 md:w-14 md:h-14 object-contain"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {step.number}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
