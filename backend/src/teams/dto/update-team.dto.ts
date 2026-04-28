import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @IsOptional()
  @MaxLength(80)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  solutionName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  theme?: string;
}