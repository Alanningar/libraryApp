"use client";

import { useState } from 'react';
import BookView from "@/comps/BookView";
import { GenreSelector, StockFilter }  from "@/comps/Selector";
import NavButton from '@/comps/NavButton';

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState('none');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <>
      <GenreSelector selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
      <StockFilter inStockOnly={inStockOnly} setInStockOnly={setInStockOnly} />
      <BookView selectedGenre={selectedGenre} inStockOnly={inStockOnly} />
      <NavButton />
    </>
  );
}