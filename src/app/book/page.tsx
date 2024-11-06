import BookView from "@/comps/BookView";

const books = [
  {
      image: "/images/book1.jpg",
      title: "The Fractalist",
      author: "Benoit Mandelbrot",
      releaseInfo: "2021"
  },
  {
      image: "/images/book2.jpg",
      title: "Who Will Run The Frog Hospital?",
      author: "Lorrie Moore",
      releaseInfo: "2020"
  },
  {
      image: "/images/book3.jpg",
      title: "Winchell",
      author: "Neal Gabler",
      releaseInfo: "2019"
  },
  
];

export default function Home() {
  return (
   <BookView />
  );
}
