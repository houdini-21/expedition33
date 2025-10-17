export interface BookingResult {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  userId: string;
  status: 'active' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
}
