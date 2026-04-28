import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VotersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; teamId: string }) {
    return this.prisma.voter.create({
      data,
      include: {
        team: true,
      },
    });
  }

  findAll() {
    return this.prisma.voter.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        team: true,
        votes: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.voter.findUnique({
      where: { id },
      include: {
        team: true,
        votes: true,
      },
    });
  }

  findByTeam(teamId: string) {
    return this.prisma.voter.findMany({
      where: { teamId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}