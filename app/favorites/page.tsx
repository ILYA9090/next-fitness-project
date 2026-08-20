// app/favorites/page.tsx
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { getUserSession } from "@/lib";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import FavoritesContent from "@/components/shared/favoritesContent";

export default async function FavoritesPage() {
  const session = await getUserSession();

  if (!session) {
    return redirect("/not-auth");
  }

  return (
    <Container className="py-10">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-red-500 fill-red-500" size={32} />
        <Title text="Избранное" size="lg" className="font-extrabold" />
      </div>
      <FavoritesContent userId={Number(session.id)} />
    </Container>
  );
}
