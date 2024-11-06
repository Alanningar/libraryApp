import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const title = "The Song Of Achilles";
  const author = "Madeline Miller";
  const summary = `This is the story of the seige of Troy from the perspective of Achilles best-friend Patroclus. Although Patroclus is outcast from his home for disappointing his father he manages to be the only mortal who can keep up with the half-God Archilles. Even though many will know the facts behind the story the telling is fresh and engaging.`;
  const genre = "Fiction, History, Greeks";
  const released = 2011;
  const cover = "https://ia600505.us.archive.org/view_archive.php?archive=/19/items/covers_0012/covers_0012_77.zip&file=0012771612.jpg";
  const stock = Math.floor(Math.random() * 10) + 1;

  const newBook = await prisma.book.create({
    data: {
      title,
      author,
      summary,
      genre,
      released,
      cover,
      stock,
    },
  });

  console.log("Book created:", newBook);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
