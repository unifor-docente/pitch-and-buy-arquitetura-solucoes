import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PurchaseIntent, SolutionRating } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    teamId: string;
    voterId: string;
    solutionRating: SolutionRating;
    purchaseIntent: PurchaseIntent;
  }) {
    const team = await this.prisma.team.findUnique({
      where: { id: data.teamId },
    });

    if (!team) {
      throw new NotFoundException('Equipe avaliada não encontrada.');
    }

    const voter = await this.prisma.voter.findUnique({
      where: { id: data.voterId },
    });

    if (!voter) {
      throw new NotFoundException('Votante não encontrado.');
    }

    if (voter.teamId === data.teamId) {
      throw new BadRequestException(
        'Você não pode votar na sua própria equipe.',
      );
    }

    const existingVote = await this.prisma.vote.findUnique({
      where: {
        teamId_voterId: {
          teamId: data.teamId,
          voterId: data.voterId,
        },
      },
    });

    if (existingVote) {
      throw new ConflictException('Você já votou nesta equipe.');
    }

    return this.prisma.vote.create({
      data,
      include: {
        team: true,
        voter: true,
      },
    });
  }

  findAll() {
    return this.prisma.vote.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        team: true,
        voter: true,
      },
    });
  }

  findByTeam(teamId: string) {
    return this.prisma.vote.findMany({
      where: {
        teamId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        voter: true,
      },
    });
  }
}