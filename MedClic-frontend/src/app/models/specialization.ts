import { Doctor } from './doctor.model';

export interface Specialization {
  id: number;
  name: string;
  doctors: Doctor[];
}

