import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';

export async function authRoutes(server: FastifyInstance) {
  // 1. Mobile Registration
  server.post('/register', {
    schema: {
      tags: ['Authentication'],
      summary: 'Register new user with Mobile Number & Password',
      body: {
        type: 'object',
        required: ['phone', 'name', 'password'],
        properties: {
          phone: { type: 'string', description: '10-digit mobile number or with country code' },
          name: { type: 'string', description: 'Full name' },
          password: { type: 'string', minLength: 6, description: 'User password (min 6 chars)' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                phone: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: { phone: string; name: string; password: string } }>, reply: FastifyReply) => {
    const { phone, name, password } = request.body;

    const cleanPhone = phone.replace(/\s+/g, '').replace(/-/g, '');
    if (cleanPhone.length < 8) {
      return reply.status(400).send({ error: 'Please enter a valid mobile number.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone: cleanPhone }
    });

    if (existingUser) {
      return reply.status(409).send({ error: 'Mobile number already registered. Please log in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        phone: cleanPhone,
        name: name.trim(),
        passwordHash,
        role: 'USER'
      }
    });

    const token = server.jwt.sign({
      id: newUser.id,
      phone: newUser.phone,
      role: newUser.role
    });

    return reply.status(201).send({
      token,
      user: {
        id: newUser.id,
        phone: newUser.phone,
        name: newUser.name,
        role: newUser.role
      }
    });
  });

  // 2. Mobile Login
  server.post('/login', {
    schema: {
      tags: ['Authentication'],
      summary: 'Login with Mobile Number & Password',
      body: {
        type: 'object',
        required: ['phone', 'password'],
        properties: {
          phone: { type: 'string' },
          password: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: { phone: string; password: string } }>, reply: FastifyReply) => {
    const { phone, password } = request.body;
    const cleanPhone = phone.replace(/\s+/g, '').replace(/-/g, '');

    const user = await prisma.user.findUnique({
      where: { phone: cleanPhone }
    });

    if (!user) {
      return reply.status(401).send({ error: 'Invalid mobile number or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return reply.status(401).send({ error: 'Invalid mobile number or password.' });
    }

    const token = server.jwt.sign({
      id: user.id,
      phone: user.phone,
      role: user.role
    });

    return reply.send({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role
      }
    });
  });

  // 3. Current User Profile
  server.get('/me', {
    onRequest: [server.authenticate],
    schema: {
      tags: ['Authentication'],
      summary: 'Get current user profile (Requires Bearer token)',
      security: [{ bearerAuth: [] }]
    }
  }, async (request: any, reply: FastifyReply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: { shraddhaProfiles: true }
        }
      }
    });

    if (!user) {
      return reply.status(404).send({ error: 'User not found.' });
    }

    return reply.send(user);
  });
}
