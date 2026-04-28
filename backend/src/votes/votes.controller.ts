import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  create(@Body() body: CreateVoteDto) {
    return this.votesService.create(body);
  }

  @Get()
  findAll() {
    return this.votesService.findAll();
  }

  @Get('team/:teamId')
  findByTeam(@Param('teamId') teamId: string) {
    return this.votesService.findByTeam(teamId);
  }
}