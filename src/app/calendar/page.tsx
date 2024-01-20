'use client'

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
const Page = () => {
    return (
        <div className={'container-lg'}>
            <h1>Calendar</h1>
            <Calendar />
        </div>
    );
};

export default Page;
