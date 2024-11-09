"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

const NavButton = () => {
    const router = useRouter();
    const pathname = usePathname();
    const isBookPage = pathname === '/book';

    const handleClick = () => {
        if (isBookPage) {
            router.push('/loans');
        } else {
            router.push('/book');
        }
    };

    return (
        <button onClick={handleClick} style={{ position: 'absolute', top: '10px', right: '10px' }}>
            {isBookPage ? 'Go to Loans' : 'Go to Books'}
        </button>
    );
};

export default NavButton;
