import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VotersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; teamId: string }) {
    try {
      return await this.prisma.voter.create({
        data,
        include: { team: true },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(`O time com ID ${data.teamId} não existe.`);
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.voter.findMany({
      orderBy: { createdAt: 'desc' },
      include: { team: true, votes: true },
    });
  }

  async findOne(id: string) {
    const voter = await this.prisma.voter.findUnique({
      where: { id },
      include: { team: true, votes: true },
    });
    if (!voter) throw new NotFoundException(`Eleitor ${id} não encontrado`);
    return voter;
  }

  findByTeam(teamId: string) {
    return this.prisma.voter.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: { name?: string; teamId?: string }) {
    try {
      return await this.prisma.voter.update({
        where: { id },
        data,
        include: { team: true, votes: true },
      });
    } catch (error) {
      throw new NotFoundException(`Eleitor ${id} não encontrado`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.voter.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Eleitor ${id} não encontrado`);
    }
  }
}