import { Categories, Container, Title } from "@/components/shared";

export default function Home() {
  return (
    <Container className="mt-10">
      <Title
        text="список доступных программ"
        size="lg"
        className="font-extrabold"
      ></Title>
      <Categories />
    </Container>
  );
}
