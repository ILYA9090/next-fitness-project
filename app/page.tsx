import {
  Container,
  Filters,
  ProductCard,
  ProductsList,
  Title,
  TopBar,
} from "@/components/shared";

export default function Home() {
  return (
    <>
      <Container className="mt-10">
        <Title text="Программы и советы" size="lg" className="font-extrabold" />
      </Container>

      <TopBar />

      <Container className="pb-14 mt-10">
        <div className="flex gap-[60px]">
          <div className="w-[250px]">
            <Filters />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {/* <ProductCard
                id={0}
                imageUrl="https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13"
                name="жим лёжа"
              /> */}
              <ProductsList
                title="Упражнения"
                items={[
                  {
                    id: 0,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "жим лёжа",
                  },
                  {
                    id: 1,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "жим гантелей",
                  },
                  {
                    id: 2,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "брусья",
                  },
                  {
                    id: 3,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "сведения в кроссовере",
                  },
                  {
                    id: 4,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "разведения гантелей",
                  },
                  {
                    id: 5,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "Отжимания",
                  },
                  {
                    id: 6,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "Подтягивания",
                  },
                  {
                    id: 7,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "Тяга гантелей",
                  },
                  {
                    id: 8,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "Австралийские подтягивания",
                  },
                  {
                    id: 9,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "Тяга в хамере",
                  },
                  {
                    id: 10,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "Тяга штанги",
                  },
                  {
                    id: 11,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "Шраги",
                  },
                  {
                    id: 12,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "Пресс",
                  },
                ]}
                categoryId={1}
              />
              <ProductsList
                title="Программы"
                items={[
                  {
                    id: 0,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "День спины",
                  },
                  {
                    id: 1,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "День ног",
                  },
                  {
                    id: 2,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "День рук",
                  },
                  {
                    id: 3,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "День грудных",
                  },
                  {
                    id: 4,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "День плеч",
                  },
                  {
                    id: 5,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "Грудные + бицепс",
                  },
                  {
                    id: 6,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "Спина + трицепс",
                  },
                  {
                    id: 7,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "Ноги + плечи",
                  },
                  {
                    id: 8,
                    imageUrl:
                      "https://avatars.mds.yandex.net/i?id=fa675df5433a1466f1d3e2116da317cd_l-4437725-images-thumbs&n=13",
                    name: "Пресс",
                  },
                ]}
                categoryId={2}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
