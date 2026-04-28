import { PurchaseIntent, SolutionRating } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class CreateVoteDto {
  @IsUUID()
  teamId: string;

  @IsUUID()
  voterId: string;

  @IsEnum(SolutionRating)
  solutionRating: SolutionRating;

  @IsEnum(PurchaseIntent)
  purchaseIntent: PurchaseIntent;
}