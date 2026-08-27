import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { authRoutes } from './routes/auth.js';
import { adminRoutes } from './routes/admin.js';
import { userShraddhaRoutes } from './routes/userShraddha.js';
import { panchangamRoutes } from './routes/panchangam.js';
import { muttRoutes } from './routes/mutt.js';
import { shraddhaPublicRoutes } from './routes/shraddhaPublic.js';
import { locationRoutes } from './routes/locations.js';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export async function buildServer() {
  const server = fastify({
    logger: {
      level: 'info'
    }
  });

  // 1. Enable CORS for all consumer apps (web, mobile, third-party)
  await server.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
  });

  // 2. JWT Setup
  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'panchangam-om-shree-maha-ganapataye-namah-2026'
  });

  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized: Invalid or missing token.' });
    }
  });

  // 3. Swagger / OpenAPI 3.0 Documentation
  await server.register(swagger, {
    openapi: {
      info: {
        title: 'Real Panchangam & Shraddha API',
        description: 'High-Precision, Multi-Mutt Drigganita Real Panchangam and Ancestral Shraddha Remembrance Engine for any location on Earth.',
        version: '1.0.0',
        contact: {
          name: 'Real Panchangam API Team',
          url: 'https://realpanchangam.run.place'
        }
      },
      servers: [
        {
          url: 'https://realpanchangam.run.place',
          description: 'Production Server (realpanchangam.run.place)'
        },
        {
          url: 'http://localhost:4000',
          description: 'Local Development Server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your JWT token obtained from /api/v1/auth/login or /api/v1/auth/register'
          }
        }
      }
    }
  });

  await server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true
    },
    staticCSP: true
  });

  // 4. Register API Routes
  await server.register(authRoutes, { prefix: '/api/v1/auth' });
  await server.register(adminRoutes, { prefix: '/api/v1/admin' });
  await server.register(userShraddhaRoutes, { prefix: '/api/v1/user/shraddha' });
  await server.register(panchangamRoutes, { prefix: '/api/v1/panchangam' });
  await server.register(muttRoutes, { prefix: '/api/v1/mutt' });
  await server.register(shraddhaPublicRoutes, { prefix: '/api/v1/shraddha' });
  await server.register(locationRoutes, { prefix: '/api/v1/locations' });

  // 5. Health Check & Welcome Endpoint
  server.get('/', async (request, reply) => {
    return reply.send({
      name: 'Vedic Panchangam & Multi-Mutt Platform API',
      version: '1.0.0',
      status: 'HEALTHY',
      documentation: '/docs',
      endpoints: {
        dailyPanchangam: '/api/v1/panchangam',
        muttComparison: '/api/v1/mutt/compare',
        shraddhaCalculation: '/api/v1/shraddha/calculate',
        locationSearch: '/api/v1/locations/search',
        auth: '/api/v1/auth/login'
      }
    });
  });

  return server;
}

async function start() {
  try {
    const server = await buildServer();
    const port = Number(process.env.PORT) || 4000;
    const host = '0.0.0.0';

    await server.listen({ port, host });
    console.log(`\n🕉️  Real Panchangam API Server running at http://localhost:${port}`);
    console.log(`📖 Interactive Swagger Documentation at http://localhost:${port}/docs\n`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  start();
}
