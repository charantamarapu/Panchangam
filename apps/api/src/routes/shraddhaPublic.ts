import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  calculateAnnualShraddha,
  calculateUpcomingShraddhas,
  generateShraddhaICS,
  AncestorShraddhaProfile,
  SampradayaType
} from '@panchangam/engine';

export async function shraddhaPublicRoutes(server: FastifyInstance) {
  // 1. Calculate Shraddha Date
  server.post('/calculate', {
    schema: {
      tags: ['Shraddha Calculation Engine'],
      summary: 'Calculate exact Shraddha date, Aparahna, and Kutapa Kala for a given year',
      body: {
        type: 'object',
        required: ['personName', 'relationship', 'gotra', 'tradition', 'system', 'targetYear', 'latitude', 'longitude', 'timezone'],
        properties: {
          personName: { type: 'string' },
          relationship: { type: 'string' },
          gotra: { type: 'string' },
          tradition: { type: 'string', default: 'ADVAITA_SMARTHA' },
          system: { type: 'string', enum: ['LUNAR', 'SOLAR'], default: 'LUNAR' },
          chandraMasa: { type: 'string' },
          paksha: { type: 'string', enum: ['Shukla', 'Krishna'] },
          tithiNumber: { type: 'integer' },
          sauraMasa: { type: 'string' },
          nakshatraIndex: { type: 'integer' },
          targetYear: { type: 'integer', default: 2026 },
          latitude: { type: 'number', default: 13.0827 },
          longitude: { type: 'number', default: 80.2707 },
          timezone: { type: 'string', default: 'Asia/Kolkata' }
        }
      }
    }
  }, async (request: FastifyRequest<{
    Body: {
      personName: string;
      relationship: string;
      gotra: string;
      tradition: string;
      system: 'LUNAR' | 'SOLAR';
      chandraMasa?: string;
      paksha?: 'Shukla' | 'Krishna';
      tithiNumber?: number;
      sauraMasa?: string;
      nakshatraIndex?: number;
      targetYear: number;
      latitude: number;
      longitude: number;
      timezone: string;
    }
  }>, reply: FastifyReply) => {
    const b = request.body;

    const profile: AncestorShraddhaProfile = {
      personName: b.personName,
      relationship: b.relationship as any,
      gotra: b.gotra,
      tradition: (b.tradition as SampradayaType) || SampradayaType.ADVAITA_SMARTHA,
      system: b.system,
      chandraMasa: b.chandraMasa,
      paksha: b.paksha,
      tithiNumber: b.tithiNumber,
      sauraMasa: b.sauraMasa,
      nakshatraIndex: b.nakshatraIndex,
      location: {
        latitude: b.latitude,
        longitude: b.longitude,
        timezone: b.timezone
      }
    };

    const result = calculateAnnualShraddha(profile, b.targetYear);
    return reply.send(result);
  });

  // 2. Export RFC 5545 iCalendar (.ics)
  server.post('/export-ics', {
    schema: {
      tags: ['Shraddha Calculation Engine'],
      summary: 'Generate downloadable .ics iCalendar file for Google/Apple Calendar',
      body: {
        type: 'object',
        required: ['personName', 'relationship', 'gotra', 'tradition', 'system', 'latitude', 'longitude', 'timezone'],
        properties: {
          personName: { type: 'string' },
          relationship: { type: 'string' },
          gotra: { type: 'string' },
          tradition: { type: 'string' },
          system: { type: 'string', enum: ['LUNAR', 'SOLAR'] },
          chandraMasa: { type: 'string' },
          paksha: { type: 'string' },
          tithiNumber: { type: 'integer' },
          yearsCount: { type: 'integer', default: 5 },
          startYear: { type: 'integer', default: 2026 },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          timezone: { type: 'string' }
        }
      }
    }
  }, async (request: any, reply: FastifyReply) => {
    const b = request.body;

    const profile: AncestorShraddhaProfile = {
      personName: b.personName,
      relationship: b.relationship,
      gotra: b.gotra,
      tradition: b.tradition as SampradayaType,
      system: b.system,
      chandraMasa: b.chandraMasa,
      paksha: b.paksha,
      tithiNumber: b.tithiNumber,
      location: {
        latitude: b.latitude,
        longitude: b.longitude,
        timezone: b.timezone
      }
    };

    const count = b.yearsCount || 5;
    const startYr = b.startYear || new Date().getFullYear();
    const upcomingDates = calculateUpcomingShraddhas(profile, count, startYr);
    const icsContent = generateShraddhaICS(profile, upcomingDates);

    reply.header('Content-Type', 'text/calendar; charset=utf-8');
    reply.header('Content-Disposition', `attachment; filename="shraddha-${b.personName.toLowerCase().replace(/\s+/g, '-')}.ics"`);
    return reply.send(icsContent);
  });
}
