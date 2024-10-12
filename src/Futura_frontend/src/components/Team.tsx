import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const people = [
  {
    id: "person-1",
    name: "Stefano",
    role: "The Philosopher and analog photographer",
    avatar: "https://www.shadcnblocks.com/images/block/avatar-2.webp",
    quote: "Photography is a way of feeling, of touching, of loving.",
  },
  {
    id: "person-2",
    name: "Daniil",
    role: "The young tech lead and Rusticean",
    avatar: "https://www.shadcnblocks.com/images/block/avatar-4.webp",
    quote: "Simplicity is the ultimate sophistication.",
  },
  {
    id: "person-3",
    name: "Leo",
    role: "The entrepreneur and the dreamer",
    avatar: "https://www.shadcnblocks.com/images/block/avatar-8.webp",
    quote:
      "The future belongs to those who believe in the beauty of their dreams.",
  },
];

export const Team = () => {
  return (
    <section className="py-32">
      <div className="container flex flex-col items-center text-center">
        {/* <p className="semibold">We&apos;re hiring</p> */}
        <h2 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">
          Meet the SLD Unit
        </h2>
        <p className="mb-8 max-w-3xl text-muted-foreground lg:text-xl">
          Known for sharing salads and taking analog photos, we are a team of
          dreamers and doers. When we are not participating in a hackathon we
          are on the lookout for the next adventure to be lived and remembered.
        </p>
      </div>
      <div className="container mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
        {" "}
        {/* Center items */}
        {people.map((person) => (
          <div key={person.id} className="flex flex-col items-center">
            {" "}
            {/* Center individual items */}
            <Avatar className="mb-4 size-20 border md:mb-5 lg:size-24">
              <AvatarImage src={person.avatar} />
              <AvatarFallback>{person.name}</AvatarFallback>
            </Avatar>
            <p className="text-center text-sm font-medium">{person.name}</p>
            <p className="text-center text-sm text-muted-foreground">
              {person.role}
            </p>
            <p className="text-center text-sm italic text-muted-foreground">
              {person.quote}
            </p>{" "}
            {/* Added quote here */}
          </div>
        ))}
      </div>
    </section>
  );
};
