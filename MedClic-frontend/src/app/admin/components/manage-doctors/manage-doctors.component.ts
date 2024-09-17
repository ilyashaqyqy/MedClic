import { Component, OnInit, ViewChild } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { Doctor } from '../../../models/doctor.model';
import { DoctorDialogComponent } from '../../../admin/components/doctor-dialog/doctor-dialog.component'; 
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-manage-doctors',
  templateUrl: './manage-doctors.component.html',
  styleUrls: ['./manage-doctors.component.css']
})
export class ManageDoctorsComponent implements OnInit {
  displayedColumns: string[] = ['profilePhoto', 'name', 'specialization', 'yearsOfExperience', 'consultationFee', 'actions'];
  doctors: Doctor[] = [];
  dataSource: MatTableDataSource<Doctor> = new MatTableDataSource<Doctor>([]);
  errorMessage: string | null = null;
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private doctorService: DoctorService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(
      (data: Doctor[]) => {
        this.doctors = data;
        this.dataSource = new MatTableDataSource<Doctor>(this.doctors);
        this.dataSource.paginator = this.paginator;
      },
      error => this.errorMessage = 'Error loading doctors'
    );
  }

  openDialog(doctor: Doctor | null = null): void {
    const dialogRef = this.dialog.open(DoctorDialogComponent, {
      width: '500px',
      data: { 
        doctor: doctor || { id: 0, firstName: '', lastName: '', email: '', specialization: '', yearsOfExperience: 0, consultationFee: 0, profilePhoto: '', bio: '', education: '', certifications: '' } 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDoctors();
      }
    });
  }

  deleteDoctor(id: number): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe(
        () => this.loadDoctors(),
        error => this.errorMessage = 'Error deleting doctor'
      );
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
