'use server'
import { Query, createPool } from '@vercel/postgres';
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        case 'POST':
            return handlePost(req, res);
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const pool = createPool({
            connectionString: process.env.DATABASE_URL,
        });
        let query = `select * from goal_events`
        if (req.query.startDate) {
            query += ` where eventdate >= $1`
        }
        if (req.query.endDate) {
            query += ` and eventdate <= $2`
        }
        query += ` order by eventdate desc`
        const client = await pool.connect();
        let queryResult
        if (!req.query.startDate && !req.query.endDate) {
            queryResult = await client.query(query);
        } else {
            queryResult = await client.query(query, [req.query.startDate, req.query.endDate]);
        }
        client.release();
        return res.status(200).json(queryResult.rows);
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const pool = createPool({
            connectionString: process.env.DATABASE_URL,
        });
        const client = await pool.connect();
        const eventType = req.body.eventType;
        const date = req.body.date;
        const isGood = req.body.isGood;
        const additionalInfo = req.body.additionalInfo;
        await client.query(`
            INSERT INTO goal_events(name, eventDate, isGood,additionalInfo)
            VALUES ($1, $2, $3, $4)
        `, [eventType, date, isGood, additionalInfo]);
        client.release();
        res.status(200).json({ message: 'Event created successfully' });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
const refresh = async (client: any) => {
    try {
        await client.query(`
        DROP TABLE IF EXISTS goal_events
    `);
        console.log('creating table');
        await client.query(`
            CREATE TABLE IF NOT EXISTS goal_events (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                eventDate DATE NOT NULL,
                isGood boolean,
                additionalInfo json
            )
        `);
    } catch (error: any) {
        console.log(error);
    }

}
export default handler;
