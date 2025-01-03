import { Query, createPool } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    // try {
    //     const pool = createPool({
    //         connectionString: process.env.DATABASE_URL,
    //     });
    //     let query = `select * from goal_events`
    //     if (req.query.startDate) {
    //         query += ` where eventdate >= $1`
    //     }
    //     if (req.query.endDate) {
    //         query += ` and eventdate <= $2`
    //     }
    //     query += ` order by eventdate desc`
    //     const client = await pool.connect();
    //     let queryResult
    //     if (!req.query.startDate && !req.query.endDate) {
    //         queryResult = await client.query(query);
    //     } else {
    //         queryResult = await client.query(query, [req.query.startDate, req.query.endDate]);
    //     }
    //     client.release();
    //     return res.status(200).json(queryResult.rows);
    // } catch (error: any) {
    //     console.log(error);
    //     return res.status(500).json({ error: error.message });
    // }
    return NextResponse.json({ message: 'yay' });
}