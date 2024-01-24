'use client'

import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import dayjs from 'dayjs';
import Card from '@mui/material/Card';
import { CircularProgress } from '@mui/material';
import EventItem from './EventItem';

interface Series {
    data: number[];
    label: string;
}
const BarChartComponent = () => {

    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [series, setSeries] = useState<any>(null);

    const today = new Date();
    const pastSevenDays: string[] = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        pastSevenDays.unshift(dayjs(date).format('YYYY-MM-DD'));
    }
    useEffect(() => {
        getLastSevenDays()
    }, []);
    const getLastSevenDays = async () => {
        const goodSeries: Series = {
            data: [],
            label: 'Good Events',
        };
        const badSeries: Series = {
            data: [],
            label: 'Bad Events',
        };
        const infoSeries: Series = {
            data: [],
            label: 'Info Events',
        };
        const today = dayjs().format('YYYY-MM-DD');
        const aWeekAgo = dayjs().subtract(7, 'days').format('YYYY-MM-DD');
        const res = await fetch(`/api/event?startDate=${aWeekAgo}&endDate=${today}`)
        const response = await res.json()
        for (const day of pastSevenDays) {
            const dayEvents = response.filter((event: any) => {
                return event.eventdate.substring(0, 10) === day;
            });
            const goodEvents = dayEvents.filter((event: any) => {
                return event.isgood === true;
            });
            const badEvents = dayEvents.filter((event: any) => {
                return event.isgood === false;
            });
            const infoEvents = dayEvents.filter((event: any) => {
                return event.isgood === null;
            });
            goodSeries.data.push(goodEvents.length);
            badSeries.data.push(badEvents.length);
            infoSeries.data.push(infoEvents.length);
        }
        setSeries({ goodSeries, badSeries, infoSeries })
        setData(response)
        setLoaded(true)
    }
    const setItemData = (d: any) => {
        console.log(d)
    }
    return (
        <div>
            {!loaded &&
                <CircularProgress />
            }
            {loaded &&
                <div>
                    {/* TODO: watch for mui x charts next version to implement on click https://github.com/mui/mui-x/pull/11411 */}
                    <BarChart
                        className='w-100'
                        width={window.innerWidth * 0.9}
                        height={window.innerHeight * 0.6}
                        xAxis={[{ scaleType: "band", data: pastSevenDays }]}
                        series={[
                            { ...series.goodSeries, stack: 'total', color: '#0e7f81' },
                            { ...series.badSeries, stack: 'total', color: '#d8504d' },
                            { ...series.infoSeries, stack: 'total', color: '#6e5f57' },

                        ]}>
                    </BarChart>
                    <div>
                        {data.length > 0 &&
                            <Card variant="outlined" className={`mt-3 mb-3 p-3`}>
                                <h2>Current Events</h2>
                                <div className='row'>
                                    {data.map((event: any) => (
                                        <EventItem key={event.id} event={event} refresh={getLastSevenDays}/>
                                    ))}
                                </div>
                            </Card>
                        }
                    </div>
                </div>
            }
        </div>


    );
};

export default BarChartComponent;
