import { Appointment } from './appointment.model';
import { Location } from './location.model';
import { Specialization } from './specialization';
import { Schedule } from './schedule.model';
import { User } from './user.model';


export interface Doctor extends User {
  specialization: string;
  yearsOfExperience: number;
  consultationFee: number;
  profilePhoto: string;
  bio: string;
  education: string;
  certifications: string;
  schedule: Schedule;
  location: Location;
  appointments: Appointment[];
  specializations: Specialization[];
  locationId?: number;
}
