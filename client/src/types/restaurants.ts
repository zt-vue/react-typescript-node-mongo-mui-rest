export interface Review {
  _id: string;
  rating: number;
  visited: string;
  ratedBy: string;
  comment?: string;
  reply?: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  address: string;
  avgRating: number;
  reviews: Review[];
  owner?: string;
}
