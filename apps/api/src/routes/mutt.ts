import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  calculateDailyPanchangam,
  compareMuttTraditions,
  MUTT_REGISTRY,
  ObserverLocation
} from '@panchangam/engine';

export async function muttRoutes(server: FastifyInstance) {
  // 1. List All Supported Mutts & Traditions
  server.get('/list', {
    schema: {
      tags: ['Mutt & Sampradaya'],
      summary: 'Get full list of supported Mutts, Peethams, and their authorities'
    }
  }, async (request, reply) => {
    return reply.send(Object.values(MUTT_REGISTRY));
  });

  // 2. Side-by-side Comparison
  server.get('/compare', {
    schema: {
      tags: ['Mutt & Sampradaya'],
      summary: 'Compare Advaita, Vishishtadvaita, and Dvaita rules for any date and location',
      querystring: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          latitude: { type: 'number', default: 13.0827 },
          longitude: { type: 'number', default: 80.2707 },
          timezone: { type: 'string', default: 'Asia/Kolkata' }
        }
      }
    }
  }, async (request: FastifyRequest<{
    Querystring: {
      date?: string;
      latitude?: number;
      longitude?: number;
      timezone?: string;
    }
  }>, reply: FastifyReply) => {
    const q = request.query;
    const targetDate = q.date ? new Date(q.date + 'T06:00:00Z') : new Date();

    const location: ObserverLocation = {
      latitude: q.latitude ?? 13.0827,
      longitude: q.longitude ?? 80.2707,
      timezone: q.timezone || 'Asia/Kolkata'
    };

    const panchangam = calculateDailyPanchangam(targetDate, location);
    const comparison = compareMuttTraditions(panchangam);

    return reply.send({
      panchangamSummary: {
        date: panchangam.date,
        sunrise: panchangam.timings.sunrise,
        sunset: panchangam.timings.sunset,
        tithi: panchangam.angas.tithi.name,
        nakshatra: panchangam.angas.nakshatra.name,
        chandraMasa: panchangam.solarLunarInfo.chandraMasa.amanta,
        sauraMasa: panchangam.solarLunarInfo.sauraMasa.tamil
      },
      comparison
    });
  });
}
