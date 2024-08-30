package com.medclic.med.mapper;

import com.medclic.med.dto.ReminderDTO;
import com.medclic.med.model.Reminder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {AppointmentMapper.class})
public interface ReminderMapper {

    @Mapping(source = "appointment.id", target = "appointmentId")
    ReminderDTO toDTO(Reminder reminder);

    @Mapping(source = "appointmentId", target = "appointment.id")
    Reminder toEntity(ReminderDTO reminderDTO);
}