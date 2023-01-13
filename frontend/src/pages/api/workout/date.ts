import type { NextApiRequest, NextApiResponse } from 'next';
import { parseISO } from 'date-fns';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';

    const ADMIN_KEY = process.env.ADMIN_KEY;
    if (!ADMIN_KEY) throw new Error('No ADMIN_KEY specified.');

    const { cycle, week, day } = req.query;

    if (typeof cycle !== 'string' || typeof week !== 'string' || typeof day !== 'string') {
        res.status(400).json({ message: 'Missing or invalid query parameters' });
        return;
    }

    if (req.method === 'GET') {
        try {
            const response = await fetch(`${BACKEND_URL}/workout/date?cycle=${cycle}&week=${week}&day=${day}`, {
                headers: { Authorization: `Basic ${Buffer.from(`admin:${ADMIN_KEY}`).toString('base64')}` },
            });

            if (response.status === 200) {
                const dateJson = await response.json();
                res.status(200).json(parseISO(dateJson.date));
                return;
            }

            if (response.status === 404) {
                res.status(404).json({ message: 'Date not found' });
                return;
            }

            res.status(500).json({ message: 'Something went wrong' });
            return;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            res.status(500).json({ message: JSON.stringify(error) });
            return;
        }
    }

    if (req.method === 'PUT') {
        try {
            const date = parseISO(req.body.date);

            const response = await fetch(`${BACKEND_URL}/workout/date?cycle=${cycle}&week=${week}&day=${day}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${Buffer.from(`admin:${ADMIN_KEY}`).toString('base64')}`,
                },
                body: JSON.stringify({ date }),
            });

            if (response.status === 200) {
                res.status(200).json(true);
                return;
            }

            if (response.status === 202) {
                res.status(202).json(false);
                return;
            }

            res.status(500).json({ message: 'Something went wrong' });
            return;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            res.status(500).json({ message: JSON.stringify(error) });
            return;
        }
    }

    res.status(405).json({ message: 'Method not allowed' });
};

export default handler;
