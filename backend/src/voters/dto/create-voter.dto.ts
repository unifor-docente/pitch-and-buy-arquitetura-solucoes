import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateVoterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsUUID()
  teamId: string;
}