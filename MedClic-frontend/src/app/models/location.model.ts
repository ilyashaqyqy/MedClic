import { Doctor } from './doctor.model';

export interface Location {
  id: number;
  name: string;
  address: string;
  doctors: Doctor[];
}
