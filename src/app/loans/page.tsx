import React from 'react';
import MyLoans from '@/comps/MyLoans';
import NavButton from '@/comps/NavButton';

export default function Page() {
    return (
        <div className="LoansPage">
            <h1 id="title">My Loans</h1>
            <MyLoans />
            <NavButton />
        </div>
    );
}
