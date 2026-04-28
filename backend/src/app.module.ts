import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TeamsModule } from './teams/teams.module';
import { VotesModule } from './votes/votes.module';
import { VotersModule } from './voters/voters.module';
import { ResultsModule } from './results/results.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, TeamsModule, VotesModule, VotersModule, ResultsModule, HealthModule]
})
export class AppModule {}
