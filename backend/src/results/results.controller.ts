import { Controller, Get, Param } from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get('team/:teamId')
  getTeamResult(@Param('teamId') teamId: string) {
    return this.resultsService.getTeamResult(teamId);
  }

  @Get('ranking')
  getRanking() {
    return this.resultsService.getRanking();
  }
}