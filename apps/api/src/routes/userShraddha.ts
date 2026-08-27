import { FastifyInstance, FastifyReply } from 'fastify';
import { prisma } from '../db.js';
import {
  calculateUpcomingShraddhas,
  generateShraddhaICS,
  AncestorShraddhaProfile,
  SampradayaType
} from '@panchangam/engine';

export async function userShraddhaRoutes(server: FastifyInstance) {
  // Authentication required for all user shraddha routes
  server.addHook('onRequest', server.authenticate);

  // 1. List user's saved ancestors
  server.get('/', {
    schema: {
      tags: ['User Shraddha Vault'],
      summary: 'Get all saved ancestor Shraddha records for current user',
      security: [{ bearerAuth: [] }]
    }
  }, async (request: any, reply: FastifyReply) => {
    const profiles = await prisma.shraddhaProfile.findMany({
      where: { userId: request.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send(profiles);
  });

  // 2. Add new ancestor profile
  server.post('/', {
    schema: {
      tags: ['User Shraddha Vault'],
      summary: 'Save an ancestor Shraddha profile',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['personName', 'relationship', 'gotra', 'tradition', 'system', 'city', 'latitude', 'longitude', 'timezone'],
        properties: {
          personName: { type: 'string' },
          relationship: { type: 'string', enum: ['FATHER', 'MOTHER', 'PATERNAL_GRANDFATHER', 'PATERNAL_GRANDMOTHER', 'MATERNAL_GRANDFATHER', 'MATERNAL_GRANDMOTHER', 'SPOUSE', 'OTHER'] },
          gotra: { type: 'string' },
          tradition: { type: 'string' },
          system: { type: 'string', enum: ['LUNAR', 'SOLAR'] },
          chandraMasa: { type: 'string' },
          paksha: { type: 'string', enum: ['Shukla', 'Krishna'] },
          tithiNumber: { type: 'integer' },
          sauraMasa: { type: 'string' },
          nakshatraIndex: { type: 'integer' },
          city: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          timezone: { type: 'string' },
          notes: { type: 'string' }
        }
      }
    }
  }, async (request: any, reply: FastifyReply) => {
    const data = request.body;

    const profile = await prisma.shraddhaProfile.create({
      data: {
        userId: request.user.id,
        personName: data.personName,
        relationship: data.relationship,
        gotra: data.gotra,
        tradition: data.tradition,
        system: data.system,
        chandraMasa: data.chandraMasa,
        paksha: data.paksha,
        tithiNumber: data.tithiNumber,
        sauraMasa: data.sauraMasa,
        nakshatraIndex: data.nakshatraIndex,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        notes: data.notes
      }
    });

    return reply.status(201).send(profile);
  });

  // 3. Update ancestor profile
  server.put('/:id', {
    schema: {
      tags: ['User Shraddha Vault'],
      summary: 'Update saved ancestor Shraddha profile',
      security: [{ bearerAuth: [] }]
    }
  }, async (request: any, reply: FastifyReply) => {
    const { id } = request.params;
    const data = request.body;

    // Ensure user owns this profile
    const existing = await prisma.shraddhaProfile.findFirst({
      where: { id, userId: request.user.id }
    });

    if (!existing) {
      return reply.status(404).send({ error: 'Profile not found.' });
    }

    const updated = await prisma.shraddhaProfile.update({
      where: { id },
      data
    });

    return reply.send(updated);
  });

  // 4. Delete ancestor profile
  server.delete('/:id', {
    schema: {
      tags: ['User Shraddha Vault'],
      summary: 'Delete saved ancestor Shraddha profile',
      security: [{ bearerAuth: [] }]
    }
  }, async (request: any, reply: FastifyReply) => {
    const { id } = request.params;

    const existing = await prisma.shraddhaProfile.findFirst({
      where: { id, userId: request.user.id }
    });

    if (!existing) {
      return reply.status(404).send({ error: 'Profile not found.' });
    }

    await prisma.shraddhaProfile.delete({
      where: { id }
    });

    return reply.send({ success: true, message: 'Ancestor profile deleted.' });
  });

  // 5. Get upcoming 5 years Shraddha dates for all saved ancestors
  server.get('/upcoming', {
    schema: {
      tags: ['User Shraddha Vault'],
      summary: 'Calculate upcoming 5 years Shraddha dates for all saved ancestors',
      security: [{ bearerAuth: [] }]
    }
  }, async (request: any, reply: FastifyReply) => {
    const profiles = await prisma.shraddhaProfile.findMany({
      where: { userId: request.user.id }
    });

    const currentYear = new Date().getFullYear();

    const results = profiles.map(p => {
      const ancestorProfile: AncestorShraddhaProfile = {
        id: p.id,
        personName: p.personName,
        relationship: p.relationship as any,
        gotra: p.gotra,
        tradition: (p.tradition as SampradayaType) || SampradayaType.ADVAITA_SMARTHA,
        system: (p.system as any) || 'LUNAR',
        chandraMasa: p.chandraMasa || undefined,
        paksha: (p.paksha as any) || 'Krishna',
        tithiNumber: p.tithiNumber || 1,
        sauraMasa: p.sauraMasa || undefined,
        nakshatraIndex: p.nakshatraIndex !== null ? p.nakshatraIndex : undefined,
        location: {
          latitude: p.latitude,
          longitude: p.longitude,
          timezone: p.timezone
        },
        notes: p.notes || undefined
      };

      const upcomingDates = calculateUpcomingShraddhas(ancestorProfile, 5, currentYear);

      return {
        profile: p,
        upcomingDates
      };
    });

    return reply.send(results);
  });

  // 6. Download .ics iCalendar file for saved ancestor
  server.get('/:id/export-ics', {
    schema: {
      tags: ['User Shraddha Vault'],
      summary: 'Download .ics calendar file with reminders for an ancestor profile',
      security: [{ bearerAuth: [] }]
    }
  }, async (request: any, reply: FastifyReply) => {
    const { id } = request.params;
    const p = await prisma.shraddhaProfile.findFirst({
      where: { id, userId: request.user.id }
    });

    if (!p) {
      return reply.status(404).send({ error: 'Profile not found.' });
    }

    const ancestorProfile: AncestorShraddhaProfile = {
      personName: p.personName,
      relationship: p.relationship as any,
      gotra: p.gotra,
      tradition: (p.tradition as SampradayaType) || SampradayaType.ADVAITA_SMARTHA,
      system: (p.system as any) || 'LUNAR',
      chandraMasa: p.chandraMasa || undefined,
      paksha: (p.paksha as any) || 'Krishna',
      tithiNumber: p.tithiNumber || 1,
      location: {
        latitude: p.latitude,
        longitude: p.longitude,
        timezone: p.timezone
      }
    };

    const currentYear = new Date().getFullYear();
    const upcomingDates = calculateUpcomingShraddhas(ancestorProfile, 5, currentYear);
    const icsContent = generateShraddhaICS(ancestorProfile, upcomingDates);

    reply.header('Content-Type', 'text/calendar; charset=utf-8');
    reply.header('Content-Disposition', `attachment; filename="shraddha-${p.personName.toLowerCase().replace(/\s+/g, '-')}.ics"`);
    return reply.send(icsContent);
  });
}
