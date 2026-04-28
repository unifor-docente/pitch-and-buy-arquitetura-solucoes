import { Injectable } from '@nestjs/common';
import { PurchaseIntent, SolutionRating } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  private solutionRatingScore(value: SolutionRating): number {
    const scores = {
      LIKE: 100,
      PARTIAL: 50,
      DISLIKE: 0,
    };

    return scores[value];
  }

  private purchaseIntentScore(value: PurchaseIntent): number {
    const scores = {
      BUY: 100,
      MAYBE: 50,
      NO: 0,
    };

    return scores[value];
  }

  private percent(count: number, total: number): number {
    if (total === 0) return 0;
    return Number(((count / total) * 100).toFixed(2));
  }

  private getStatus(score: number): string {
    if (score >= 85) return 'Solução altamente atrativa';
    if (score >= 70) return 'Solução aprovada pelo mercado';
    if (score >= 50) return 'Solução promissora, mas precisa evoluir';
    return 'Solução com baixa aderência';
  }

  async getTeamResult(teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        votes: true,
      },
    });

    if (!team) {
      return null;
    }

    const totalVotes = team.votes.length;

    const solutionRatingCounts = {
      LIKE: team.votes.filter((vote) => vote.solutionRating === 'LIKE').length,
      PARTIAL: team.votes.filter((vote) => vote.solutionRating === 'PARTIAL')
        .length,
      DISLIKE: team.votes.filter((vote) => vote.solutionRating === 'DISLIKE')
        .length,
    };

    const purchaseIntentCounts = {
      BUY: team.votes.filter((vote) => vote.purchaseIntent === 'BUY').length,
      MAYBE: team.votes.filter((vote) => vote.purchaseIntent === 'MAYBE')
        .length,
      NO: team.votes.filter((vote) => vote.purchaseIntent === 'NO').length,
    };

    const acceptanceScore =
      totalVotes === 0
        ? 0
        : Number(
            (
              team.votes.reduce(
                (sum, vote) => sum + this.solutionRatingScore(vote.solutionRating),
                0,
              ) / totalVotes
            ).toFixed(2),
          );

    const purchaseScore =
      totalVotes === 0
        ? 0
        : Number(
            (
              team.votes.reduce(
                (sum, vote) => sum + this.purchaseIntentScore(vote.purchaseIntent),
                0,
              ) / totalVotes
            ).toFixed(2),
          );

    const finalScore = Number(((acceptanceScore + purchaseScore) / 2).toFixed(2));

    return {
      team: {
        id: team.id,
        name: team.name,
        solutionName: team.solutionName,
        theme: team.theme,
      },
      totalVotes,
      solutionRating: {
        counts: solutionRatingCounts,
        percentages: {
          LIKE: this.percent(solutionRatingCounts.LIKE, totalVotes),
          PARTIAL: this.percent(solutionRatingCounts.PARTIAL, totalVotes),
          DISLIKE: this.percent(solutionRatingCounts.DISLIKE, totalVotes),
        },
        score: acceptanceScore,
      },
      purchaseIntent: {
        counts: purchaseIntentCounts,
        percentages: {
          BUY: this.percent(purchaseIntentCounts.BUY, totalVotes),
          MAYBE: this.percent(purchaseIntentCounts.MAYBE, totalVotes),
          NO: this.percent(purchaseIntentCounts.NO, totalVotes),
        },
        score: purchaseScore,
      },
      finalScore,
      status: this.getStatus(finalScore),
    };
  }

  async getRanking() {
    const teams = await this.prisma.team.findMany({
      include: {
        votes: true,
      },
    });

    const results = await Promise.all(
      teams.map((team) => this.getTeamResult(team.id)),
    );

    return results
      .filter(Boolean)
      .sort((a, b) => (b?.finalScore ?? 0) - (a?.finalScore ?? 0));
  }
}