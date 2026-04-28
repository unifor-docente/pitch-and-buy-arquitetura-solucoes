import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateVoterDto {
  @IsString()
  @IsOptional()
  @MaxLength(120)
  name?: string;

  @IsUUID()
  @IsOptional()
  teamId?: string;
}