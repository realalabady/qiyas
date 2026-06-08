import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center">
      <Card className="glass-card w-full max-w-2xl border-white/15 py-0 text-center">
        <CardHeader className="py-10">
          <CardTitle className="text-2xl sm:text-3xl">{title}</CardTitle>
          <CardDescription className="mx-auto max-w-xl text-sm sm:text-base">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}

export default PlaceholderPage;
