import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';

    const ADMIN_KEY = process.env.ADMIN_KEY;
    if (!ADMIN_KEY) throw new Error('No ADMIN_KEY specified.');

    const { num, cycle, week, day } = req.query;

    if (typeof num !== 'string') {
        res.status(400).json({ message: 'Invalid "num" parameter' });
        return;
    }

    if (typeof cycle !== 'string' || typeof week !== 'string' || typeof day !== 'string') {
        res.status(400).json({ message: 'Missing or invalid query parameters' });
        return;
    }

    if (req.method === 'GET') {
        const { ok, status } = await fetch(`${BACKEND_URL}/joker/${num}?cycle=${cycle}&week=${week}&day=${day}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`admin:${ADMIN_KEY}`).toString('base64')}`,
            },
        });

        if (ok) {
            res.status(200).json(true);
            return;
        }

        if (status === 404) {
            res.status(404).json(false);
            return;
        }

        res.status(500).json({ error: 'Something went wrong' });
        return;
    }

    if (req.method === 'PUT') {
        const { ok } = await fetch(`${BACKEND_URL}/joker/${num}?cycle=${cycle}&week=${week}&day=${day}`, {
            method: 'PUT',
            headers: {
                Authorization: `Basic ${Buffer.from(`admin:${ADMIN_KEY}`).toString('base64')}`,
            },
        });

        if (ok) {
            res.status(200).json(true);
            return;
        }

        res.status(500).json({ error: 'Something went wrong' });
        return;
    }

    res.status(405).json({ message: 'Method not allowed' });
};

export default handler;
