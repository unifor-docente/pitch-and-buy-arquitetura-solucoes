import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; solutionName: string; theme?: string }) {
    return this.prisma.team.create({ data });
  }

  findAll() {
    return this.prisma.team.findMany({
      orderBy: { createdAt: 'desc' },
      include: { votes: true },
    });
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: { votes: true },
    });
    if (!team) throw new NotFoundException(`Time ${id} não encontrado`);
    return team;
  }

  async findAvailableForVoter(voterId: string) {
    const voter = await this.prisma.voter.findUnique({
      where: { id: voterId },
      include: { votes: true },
    });

    if (!voter) return [];

    const excludeIds = [voter.teamId, ...voter.votes.map((v) => v.teamId)]
      .filter((id): id is string => Boolean(id));

    return this.prisma.team.findMany({
      where: { id: { notIn: excludeIds } },
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, data: { name?: string; solutionName?: string; theme?: string }) {
    try {
      return await this.prisma.team.update({ where: { id }, data });
    } catch (error) {
      throw new NotFoundException(`Não foi possível atualizar: Time ${id} não encontrado`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.vote.deleteMany({ where: { teamId: id } });
      await this.prisma.voter.deleteMany({ where: { teamId: id } });
      return await this.prisma.team.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Time ${id} não encontrado para remover`);
    }
  }
}