import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const projects = await prisma.project.findMany({
            include: {
                locationData: true,
                flowData: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
        res.json(projects);
    } else if (req.method === 'POST') {
        const { name, description } = req.body;
        const project = await prisma.project.create({
            data: {
                name,
                description,
            },
        });
        res.json(project);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
