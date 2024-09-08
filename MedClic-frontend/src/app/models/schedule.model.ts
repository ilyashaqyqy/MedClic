import { TimeSlot } from './time-slot.model';

export interface Schedule {
  id: number;
  availability: { [date: string]: TimeSlot };
}
