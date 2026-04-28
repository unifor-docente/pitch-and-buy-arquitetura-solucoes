import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; solutionName: string; theme?: string }) {
    return this.prisma.team.create({
      data,
    });
  }

  findAll() {
    return this.prisma.team.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        votes: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.team.findUnique({
      where: { id },
      include: {
        votes: true,
      },
    });
  }

  async findAvailableForVoter(voterId: string) {
  const voter = await this.prisma.voter.findUnique({
    where: { id: voterId },
    include: {
      votes: true,
    },
  });

  if (!voter) {
    return [];
  }

  const votedTeamIds = voter.votes.map((vote) => vote.teamId);

  return this.prisma.team.findMany({
    where: {
      id: {
        notIn: [voter.teamId, ...votedTeamIds],
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}
}