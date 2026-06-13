import { Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Absolutely seamless experience! They shifted my entire 2BHK in just 4 hours. Highly recommended!",
      initials: "PS",
      name: "Priya Sharma",
      route: "Andheri to Powai",
    },
    {
      quote:
        "Professional team, on-time delivery, and nothing was damaged. Best shifting service in Mumbai!",
      initials: "RM",
      name: "Rahul Mehta",
      route: "Bandra to Worli",
    },
    {
      quote:
        "Excellent packing quality and the team was so polite. Made my stressful move completely hassle-free.",
      initials: "AD",
      name: "Anjali Desai",
      route: "Thane to Chembur",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy Mumbaikars who shifted with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <Quote className="h-10 w-10 text-primary/30 mb-4 group-hover:text-primary/50 transition-colors" />

              <p className="text-muted-foreground leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shrink-0">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.route}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
