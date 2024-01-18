'use server'
import { createPool } from '@vercel/postgres';
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
    // Create a connection pool
    const pool = createPool({
        connectionString: process.env.DATABASE_URL,
    });

    // Get a client from the pool
    const client = await pool.connect();
    const query = await client.query(`
                select * from goal_events
            `);
    console.log('query', query);
    // Release the client back to the pool
    client.release();
    return res.status(200).json(query.rows);
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Create a connection pool
        const pool = createPool({
            connectionString: process.env.DATABASE_URL,
        });

        // Get a client from the pool
        const client = await pool.connect();
        const eventType = req.body.eventType;
        const date = req.body.date;
        const isGood = req.body.isGood;
        const additionalInfo = req.body.additionalInfo;

        console.log('dont create table if not exists');
        await client.query(`
            INSERT INTO goal_events(name, eventDate, isGood,additionalInfo)
            VALUES ($1, $2, $3, $4)
        `, [eventType, date, isGood, additionalInfo]);
        console.log('inserted into table');
        // Release the client back to the pool
        client.release();
        res.status(200).json({ message: 'User created successfully' });
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
