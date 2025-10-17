
export interface PollOption {
  id: string;
  caption: string;
  image: string; // base64 encoded image
}

export type PollStatus = 'IDLE' | 'ACTIVE' | 'ENDED';

export interface Poll {
  // FIX: Add _id to satisfy MongoDB Document constraint.
  _id: any;
  id: string;
  options: PollOption[];
  status: PollStatus;
  votes: Record<string, number>; // Maps optionId to vote count
}
