import { Body, Controller, Get, Param, Post, Delete, Patch } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsService } from './teams.service';
import { UpdateTeamDto } from './dto/update-team.dto';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateTeamDto) {
    return this.teamsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }
}