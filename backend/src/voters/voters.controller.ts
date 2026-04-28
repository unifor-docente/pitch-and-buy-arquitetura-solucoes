import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateVoterDto } from './dto/create-voter.dto';
import { VotersService } from './voters.service';

@Controller('voters')
export class VotersController {
  constructor(private readonly votersService: VotersService) {}

  @Post()
  create(@Body() body: CreateVoterDto) {
    return this.votersService.create(body);
  }

  @Get()
  findAll() {
    return this.votersService.findAll();
  }

  @Get('team/:teamId')
  findByTeam(@Param('teamId') teamId: string) {
    return this.votersService.findByTeam(teamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.votersService.findOne(id);
  }
}