'use client'

import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import dayjs from 'dayjs';
import Card from '@mui/material/Card';
import { CircularProgress } from '@mui/material';

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
        pastSevenDays.unshift(dayjs(date).format('MM/DD/YYYY'));
    }

    console.log(pastSevenDays);

    useEffect(() => {
        async function fetchData() {
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
                console.log(`checking ${day}`)
                const dayEvents = response.filter((event: any) => {
                    console.log(`does ${dayjs(event.eventdate).format('MM/DD/YYYY')} match ${day} ? ${dayjs(event.eventdate).format('MM/DD/YYYY') === day ? 'yes' : 'no'}}`)
                    return dayjs(event.eventdate).format('MM/DD/YYYY') === day;
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
            console.log(response, goodSeries, badSeries, infoSeries)
            setSeries({ goodSeries, badSeries, infoSeries })
            setData(response)
            setLoaded(true)
        }
        fetchData();
    }, []);

    return (
        <div>
            {!loaded &&
                <CircularProgress />
            }
            {loaded &&
                <div>

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
                                        <div key={event.id} className='col-12 col-sm-6 col-md-4 mb-2' style={{
                                            border: '1px solid black',
                                            borderRadius: '5px',
                                            backgroundColor: event.isgood ? '#90EE90' : '#d8504d'
                                        }}>
                                            <h3>{event.name}</h3>
                                            <h5>{dayjs(event.eventdate).format('MM/DD/YYYY')}</h5>
                                        </div>
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
