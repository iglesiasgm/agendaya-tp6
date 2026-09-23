export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "ABSENT"
  | "CANCELLED";

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  notes?: string;
}
