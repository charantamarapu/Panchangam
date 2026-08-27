import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  calculateDailyPanchangam,
  evaluateMuttObservances,
  SampradayaType,
  AyanamshaType,
  CalendarSystemType,
  ObserverLocation
} from '@panchangam/engine';

export async function panchangamRoutes(server: FastifyInstance) {
  // 1. Daily Panchangam
  server.get('/', {
    schema: {
      tags: ['Panchangam Core'],
      summary: 'Get complete daily Panchangam for any location on Earth',
      querystring: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'YYYY-MM-DD (defaults to today)' },
          latitude: { type: 'number', default: 13.0827 },
          longitude: { type: 'number', default: 80.2707 },
          elevation: { type: 'number', default: 10 },
          timezone: { type: 'string', default: 'Asia/Kolkata' },
          ayanamsha: { type: 'string', enum: ['LAHIRI', 'KP', 'RAMAN'], default: 'LAHIRI' },
          mutt: { type: 'string', default: 'STANDARD' },
          calendarSystem: { type: 'string', default: 'CHANDRAMANA_AMANTA', enum: ['SOURAMANA', 'CHANDRAMANA_AMANTA', 'CHANDRAMANA_PURNIMANTA'] }
        }
      }
    }
  }, async (request: FastifyRequest<{
    Querystring: {
      date?: string;
      latitude?: number;
      longitude?: number;
      elevation?: number;
      timezone?: string;
      ayanamsha?: string;
      mutt?: string;
      calendarSystem?: string;
    }
  }>, reply: FastifyReply) => {
    const q = request.query;
    const targetDate = q.date ? new Date(q.date + 'T06:00:00Z') : new Date();

    const location: ObserverLocation = {
      latitude: q.latitude ?? 13.0827,
      longitude: q.longitude ?? 80.2707,
      elevationMeters: q.elevation ?? 10,
      timezone: q.timezone || 'Asia/Kolkata'
    };

    const ayanamshaType = (q.ayanamsha as AyanamshaType) || AyanamshaType.LAHIRI;
    const calendarSystem = (q.calendarSystem as CalendarSystemType) || CalendarSystemType.CHANDRAMANA_AMANTA;
    const panchangam = calculateDailyPanchangam(targetDate, location, ayanamshaType, calendarSystem);

    const muttId = (q.mutt as SampradayaType) || SampradayaType.STANDARD;
    const observance = evaluateMuttObservances(panchangam, muttId);

    return reply.send({
      ...panchangam,
      muttObservance: observance
    });
  });

  // 2. Monthly Calendar
  server.get('/calendar', {
    schema: {
      tags: ['Panchangam Core'],
      summary: 'Get 30-day monthly calendar grid with Tithis and Festivals',
      querystring: {
        type: 'object',
        properties: {
          year: { type: 'integer' },
          month: { type: 'integer', description: '1 to 12' },
          latitude: { type: 'number', default: 13.0827 },
          longitude: { type: 'number', default: 80.2707 },
          timezone: { type: 'string', default: 'Asia/Kolkata' },
          mutt: { type: 'string', default: 'STANDARD' }
        }
      }
    }
  }, async (request: FastifyRequest<{
    Querystring: {
      year?: number;
      month?: number;
      latitude?: number;
      longitude?: number;
      timezone?: string;
      mutt?: string;
    }
  }>, reply: FastifyReply) => {
    const now = new Date();
    const yr = request.query.year || now.getFullYear();
    const mo = request.query.month || (now.getMonth() + 1); // 1-indexed

    const location: ObserverLocation = {
      latitude: request.query.latitude ?? 13.0827,
      longitude: request.query.longitude ?? 80.2707,
      timezone: request.query.timezone || 'Asia/Kolkata'
    };

    const muttId = (request.query.mutt as SampradayaType) || SampradayaType.STANDARD;

    // Number of days in month
    const daysInMonth = new Date(yr, mo, 0).getDate();
    const calendarDays = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dObj = new Date(Date.UTC(yr, mo - 1, d, 6, 0, 0));
      const p = calculateDailyPanchangam(dObj, location);
      const obs = evaluateMuttObservances(p, muttId);

      calendarDays.push({
        date: p.date,
        dayOfMonth: d,
        dayOfWeek: p.angas.vara.english,
        tithi: p.angas.tithi.name,
        paksha: p.angas.tithi.paksha,
        nakshatra: p.angas.nakshatra.name,
        festivals: obs.festivalsAndEvents,
        isEkadashi: obs.isEkadashiFastingDay,
        isTharpanam: obs.isTharpanamDay
      });
    }

    return reply.send({
      year: yr,
      month: mo,
      location,
      mutt: muttId,
      days: calendarDays
    });
  });

  // 3. Muhurtha Timings
  server.get('/muhurtha', {
    schema: {
      tags: ['Panchangam Core'],
      summary: 'Get auspicious & inauspicious windows for any day',
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
  }, async (request: any, reply: FastifyReply) => {
    const q = request.query;
    const targetDate = q.date ? new Date(q.date + 'T06:00:00Z') : new Date();

    const location: ObserverLocation = {
      latitude: q.latitude ?? 13.0827,
      longitude: q.longitude ?? 80.2707,
      timezone: q.timezone || 'Asia/Kolkata'
    };

    const panchangam = calculateDailyPanchangam(targetDate, location);
    return reply.send({
      date: panchangam.date,
      timings: panchangam.timings,
      divisions: panchangam.divisions
    });
  });
}
