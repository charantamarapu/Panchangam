import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { searchLocations, CURATED_CITIES } from '../locations/cities.js';

export async function locationRoutes(server: FastifyInstance) {
  server.get('/search', {
    schema: {
      tags: ['Locations & Geocoding'],
      summary: 'Search world cities, temple towns, and resolve coordinates and timezones',
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string', description: 'City name or search query' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Querystring: { q?: string } }>, reply: FastifyReply) => {
    const query = request.query.q || '';
    const results = await searchLocations(query);
    return reply.send(results);
  });

  server.get('/featured', {
    schema: {
      tags: ['Locations & Geocoding'],
      summary: 'Get curated sacred temple towns and major metropolises'
    }
  }, async (request, reply) => {
    return reply.send(CURATED_CITIES);
  });
}
