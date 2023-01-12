import type { NextApiRequest, NextApiResponse } from 'next';
import { baseWeightsDecoder } from '@api/base-weights';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';

    const ADMIN_KEY = process.env.ADMIN_KEY;
    if (!ADMIN_KEY) throw new Error('No ADMIN_KEY specified.');

    if (req.method === 'GET') {
        try {
            const response = await fetch(`${BACKEND_URL}/base-weights`, {
                headers: { Authorization: `Basic ${Buffer.from(`admin:${ADMIN_KEY}`).toString('base64')}` },
            });

            if (response.status === 200) {
                const json = await response.json();

                res.status(200).json(baseWeightsDecoder(json));
                return;
            }

            if (response.status === 404) {
                res.status(404).json({ message: 'Base weights not found' });
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
            const baseWeights = baseWeightsDecoder(req.body);

            const response = await fetch(`${BACKEND_URL}/base-weights`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${Buffer.from(`admin:${ADMIN_KEY}`).toString('base64')}`,
                },
                body: JSON.stringify(baseWeights),
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
};

export default handler;
