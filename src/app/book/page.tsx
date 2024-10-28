import Books from "@/comps/BookView";

const books = [
  {
      image: "/images/book1.jpg",
      title: "Book One",
      author: "Author One",
      releaseInfo: "2021"
  },
  {
      image: "/images/book2.jpg",
      title: "Book Two",
      author: "Author Two",
      releaseInfo: "2020"
  },
  {
      image: "/images/book3.jpg",
      title: "Book Three",
      author: "Author Three",
      releaseInfo: "2019"
  }
];

export default function Home() {
  return (
   <Books books={books}/>
  );
}
