package com.medclic.med.mapper;

import com.medclic.med.dto.AppointmentDTO;
import com.medclic.med.model.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PatientMapper.class, DoctorMapper.class})
public interface AppointmentMapper {
    @Mapping(source = "patient.id", target = "patientId")
    @Mapping(source = "doctor.id", target = "doctorId")
    AppointmentDTO toDTO(Appointment appointment);

    @Mapping(source = "patientId", target = "patient.id")
    @Mapping(source = "doctorId", target = "doctor.id")
    Appointment toEntity(AppointmentDTO appointmentDTO);
}