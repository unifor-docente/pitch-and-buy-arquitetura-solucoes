import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  solutionName: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  theme?: string;
}