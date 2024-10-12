import {
  BarChartHorizontal,
  MessageCircleMore,
  MessagesSquare,
  Layers,
  UserRoundPen,
  ZoomIn,
  Cylinder,
  ShieldCheck,
  Contact,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const reasons = [
  {
    title: "Digital Time Capsule",
    description:
      "Create a digital time capsule to store and categorize life stories, photos, videos, and documents.",
    icon: <Cylinder className="size-5" />,
    badge: false,
  },
  {
    title: "Future-Proof Storage",
    description:
      "Secure, immutable records of legacy content with cross-generational accessibility.",
    icon: <ShieldCheck className="size-5" />,
    badge: false,
  },
  {
    title: "Automatic Family Access",
    description:
      "KYC features for verifying relatives who can access and interact with stored legacies.",
    icon: <Contact className="size-5" />,
    badge: false,
  },
  {
    title: "Premium Digital Portrait Creation",
    description:
      "Parse extensive user content to generate a digital portrait, biography, or podcast for future generations.",
    icon: <UserRoundPen className="size-5" />,
    badge: true,
  },
  {
    title: "AI-Enhanced Storytelling",
    description:
      "Offer text, audio, and moving portraits based on user content to create dynamic narratives.",
    icon: <MessageCircleMore className="size-5" />,
    badge: true,
  },
  {
    title: "Interactive AI Chatbot",
    description:
      "Develop a chatbot that answers questions about users’ lives based on stored data for future descendants.",
    icon: <MessagesSquare className="size-5" />,
    badge: true,
  },
];

export const Features = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex gap-4 flex-col mb-10 items-center justify-center">
          <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
            Futura's Features
          </h1>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <div key={i} className="flex flex-col">
              <div className="mb-5">
                <h3 className="text-center text-xl font-semibold flex items-center justify-center">
                  <div className="mr-3 rounded-full bg-accent flex items-center justify-center">
                    {reason.icon}
                  </div>
                  {reason.title}
                  {reason.badge && (
                    <Badge className="ml-2" variant="outline">
                      Coming Soon
                    </Badge>
                  )}{" "}
                  {/* Conditional Badge */}
                </h3>
                <p className="text-center text-sm text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
