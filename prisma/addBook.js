import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const title = "Fahrenheit 451";
  const author = "Ray Bradbury";
  const summary = `Fahrenheit 451 is a fascinating novel of a strange and weird future. It is different. it is highly imaginative —but never ridiculous.`;
  const genre = "Science Fiction";
  const subgenre = "Science Fiction, Dystopian Fiction, Political Fiction";
  const released = 1953;
  const cover = "https://ia800100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_99.zip&file=0012993656-L.jpg";
  const stock = Math.floor(Math.random() * 10) + 1;

  const newBook = await prisma.book.create({
    data: {
      title,
      author,
      summary,
      genre,
      subgenre,
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
