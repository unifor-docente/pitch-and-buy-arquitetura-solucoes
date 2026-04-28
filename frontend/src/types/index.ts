export type Team = {
  id: string;
  name: string;
  solutionName: string;
  theme?: string;
  createdAt: string;
};

export type Voter = {
  id: string;
  name: string;
  teamId: string;
  createdAt: string;
  team?: Team;
};

export type SolutionRating = 'LIKE' | 'PARTIAL' | 'DISLIKE';

export type PurchaseIntent = 'BUY' | 'MAYBE' | 'NO';

export type TeamResult = {
  team: Team;
  totalVotes: number;
  solutionRating: {
    counts: {
      LIKE: number;
      PARTIAL: number;
      DISLIKE: number;
    };
    percentages: {
      LIKE: number;
      PARTIAL: number;
      DISLIKE: number;
    };
    score: number;
  };
  purchaseIntent: {
    counts: {
      BUY: number;
      MAYBE: number;
      NO: number;
    };
    percentages: {
      BUY: number;
      MAYBE: number;
      NO: number;
    };
    score: number;
  };
  finalScore: number;
  status: string;
};