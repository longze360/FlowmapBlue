import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const projectId = req.query.id as string;

    if (req.method === 'GET') {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                locationData: true,
                flowData: true,
            },
        });
        res.json(project);
    } else if (req.method === 'PUT') {
        const { name, description, locationData, flowData } = req.body;

        const project = await prisma.project.update({
            where: { id: projectId },
            data: {
                name,
                description,
                locationData: locationData ? {
                    upsert: {
                        create: {
                            csvContent: locationData.csvContent,
                            mapping: JSON.stringify(locationData.mapping || {})
                        },
                        update: {
                            csvContent: locationData.csvContent,
                            mapping: JSON.stringify(locationData.mapping || {})
                        }
                    }
                } : undefined,
                flowData: flowData ? {
                    upsert: {
                        create: {
                            csvContent: flowData.csvContent,
                            mapping: JSON.stringify(flowData.mapping || {})
                        },
                        update: {
                            csvContent: flowData.csvContent,
                            mapping: JSON.stringify(flowData.mapping || {})
                        }
                    }
                } : undefined,
            },
            include: {
                locationData: true,
                flowData: true,
            }
        });
        res.json(project);
    } else if (req.method === 'DELETE') {
        await prisma.project.delete({
            where: { id: projectId },
        });
        res.json({ success: true });
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
