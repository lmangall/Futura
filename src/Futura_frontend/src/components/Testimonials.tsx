import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
const testimonials = [
  {
    name: "Jessica H.",
    role: "Teacher & Mother",
    avatar: "/images/block/avatar-1.webp",
    content:
      "We had boxes of old photos and tapes collecting dust, and now they're all digitized. It's comforting to know that my children's children will be able to enjoy and learn from their ancestors’ stories. This platform truly helps us preserve our family's history.",
  },
  {
    name: "Mark R.",
    role: "Son of a WWII Veteran",
    avatar: "/images/block/avatar-2.webp",
    content:
      "I recently uploaded my father's old letters and his recordings from the war. Thanks to Futura, my children can now listen to their grandfather's voice and understand the experiences that shaped him. This platform has given us a way to connect with our family's past in a meaningful way.",
  },
  {
    name: "Sophia M.",
    role: "Nostalgic Daughter",
    avatar: "/images/block/avatar-3.webp",
    content:
      "After my grandmother passed away, I was devastated. I found old VHS tapes of her telling stories about her childhood. I was able to digitize those tapes, I found so much value in it that I decided to keep them forever and cherish these memories with my kids.",
  },
  {
    name: "Robert T.",
    role: "Family Historian",
    avatar: "/images/block/avatar-4.webp",
    content:
      "As someone passionate about genealogy, I was thrilled to discover Futura. The ability to upload family documents, photos, and even record my own stories is invaluable. Great for anyone looking to preserve their heritage!",
  },
  {
    name: "Elena V.",
    role: "Creative Artist",
    avatar: "/images/block/avatar-5.webp",
    content:
      "As an artist, I've always wanted to know my life's work will live longer than I. Knowing that my creations will be accessible to my future generations brings me so much peace!",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-32">
      <div className="container">
        <Carousel className="w-full">
          <div className="mb-8 flex justify-between px-1 lg:mb-12">
            <h2 className="text-2xl font-semibold lg:text-5xl">
              Why Clients Love Us
            </h2>
            <div className="flex items-center space-x-2">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </div>
          <CarouselContent>
            {testimonials.map((testimonial, idx) => (
              <CarouselItem
                key={idx}
                className="basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="h-full p-1">
                  <div className="flex h-full flex-col justify-between rounded-lg border p-6">
                    <q className="text-sm text-muted-foreground">
                      {testimonial.content}
                    </q>
                    <div className="mt-6 flex gap-4 leading-5">
                      <Avatar className="size-9 rounded-full ring-1 ring-input">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
