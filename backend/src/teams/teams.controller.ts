import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() body: CreateTeamDto) {
    return this.teamsService.create(body);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get('available/:voterId')
  findAvailableForVoter(@Param('voterId') voterId: string) {
    return this.teamsService.findAvailableForVoter(voterId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }
}