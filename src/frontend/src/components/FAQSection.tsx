import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function FAQSection() {
  const faqs = [
    {
      question: "How do I book a shifting service?",
      answer:
        'Simply enter your pickup and drop-off locations in our quote estimator, select your move type and vehicle, choose any add-on services, and click "Book Now". You can pay a 25% advance to confirm your booking instantly.',
    },
    {
      question: "What is the advance payment amount?",
      answer:
        "We require a 25% advance payment to confirm your booking. The remaining 75% can be paid after the move is completed, either in cash, UPI, or through our digital payment link.",
    },
    {
      question: "Is my advance payment refundable?",
      answer:
        "The advance payment is non-refundable after driver assignment. However, if we are unable to assign a driver for your booking, you will receive a full refund.",
    },
    {
      question: "What areas do you cover?",
      answer:
        "We provide comprehensive packers and movers services across the entire Mumbai to Karjat corridor, including Mumbai, Thane, Kalyan, Dombivli, Ulhasnagar, Ambernath, Badlapur, Panvel, and Karjat with all neighborhoods and localities.",
    },
    {
      question: "Do you provide packing materials?",
      answer:
        'Yes! You can select "Packing" as an add-on service during booking. Our team will bring all necessary packing materials including boxes, bubble wrap, and protective covers.',
    },
    {
      question: "How long does the shifting process take?",
      answer:
        "The duration depends on the size of your move and distance. Typically, a 1-2 BHK local shift takes 4-6 hours, while larger moves or longer distances may take 8-12 hours. We provide estimated timelines during booking.",
    },
    {
      question: "What if my items get damaged during the move?",
      answer:
        "We offer 100% damage protection. You can add Insurance as an add-on service during booking. In case of any damage, our insurance covers the repair or replacement cost.",
    },
    {
      question: "Can I reschedule my booking?",
      answer:
        "Yes, you can reschedule your booking up to 24 hours before the scheduled move date. Please contact our support team via WhatsApp or phone to make changes.",
    },
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = "918108140307";
    const message = encodeURIComponent(
      "Hi, I have a question about SCOOPEX shifting services.",
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <section
      id="faqs"
      className="py-16 md:py-20 bg-gradient-to-b from-muted/30 to-background"
    >
      <div className="container px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our services
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="border border-border rounded-xl bg-card/50 backdrop-blur-sm px-6 shadow-sm hover:shadow-md transition-all"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-base md:text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* WhatsApp Support Card */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our support team is here to help! Get instant answers via
              WhatsApp.
            </p>
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <SiWhatsapp className="h-6 w-6" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
