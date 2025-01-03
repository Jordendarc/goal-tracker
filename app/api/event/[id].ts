'use server'
import { createPool } from '@vercel/postgres';
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'DELETE':
            return handleDelete(req, res);
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const pool = createPool({
            connectionString: process.env.DATABASE_URL,
        });
        const client = await pool.connect();
        const id = req.query.id;
        console.log(id);
        await client.query(`
            DELETE FROM goal_events WHERE id = $1
        `, [id]);
        client.release();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}
export default handler;
