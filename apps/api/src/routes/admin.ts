import { FastifyInstance, FastifyReply } from 'fastify';
import { prisma } from '../db.js';

export async function adminRoutes(server: FastifyInstance) {
  // Admin Authorization Hook
  const adminGuard = async (request: any, reply: FastifyReply) => {
    await server.authenticate(request, reply);
    if (request.user?.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Forbidden: Admin access required.' });
    }
  };

  // 1. Platform Statistics
  server.get('/stats', {
    onRequest: [adminGuard],
    schema: {
      tags: ['Admin Management'],
      summary: 'Get system-wide metrics and tradition breakdown',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const [totalUsers, totalShraddhaRecords, usersWithShraddha] = await Promise.all([
      prisma.user.count(),
      prisma.shraddhaProfile.count(),
      prisma.user.count({
        where: {
          shraddhaProfiles: {
            some: {}
          }
        }
      })
    ]);

    // Breakdown by tradition
    const traditions = await prisma.shraddhaProfile.groupBy({
      by: ['tradition'],
      _count: {
        id: true
      }
    });

    // Breakdown by relationship
    const relationships = await prisma.shraddhaProfile.groupBy({
      by: ['relationship'],
      _count: {
        id: true
      }
    });

    return reply.send({
      totalUsers,
      totalShraddhaRecords,
      usersWithShraddha,
      traditionBreakdown: traditions.map(t => ({ tradition: t.tradition, count: t._count.id })),
      relationshipBreakdown: relationships.map(r => ({ relationship: r.relationship, count: r._count.id }))
    });
  });

  // 2. List All Users
  server.get('/users', {
    onRequest: [adminGuard],
    schema: {
      tags: ['Admin Management'],
      summary: 'List all registered users',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            shraddhaProfiles: true,
            savedLocations: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send(users);
  });

  // 3. List All Saved Shraddha Records Across All Users
  server.get('/shraddha-records', {
    onRequest: [adminGuard],
    schema: {
      tags: ['Admin Management'],
      summary: 'Master view of all saved Shraddha records with user info',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const records = await prisma.shraddhaProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send(records);
  });

  // 4. Delete User (Admin action)
  server.delete('/users/:id', {
    onRequest: [adminGuard],
    schema: {
      tags: ['Admin Management'],
      summary: 'Remove a user and all their records',
      security: [{ bearerAuth: [] }]
    }
  }, async (request: any, reply) => {
    const { id } = request.params;
    await prisma.user.delete({
      where: { id }
    });

    return reply.send({ success: true, message: 'User removed successfully.' });
  });
}
