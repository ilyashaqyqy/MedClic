package com.medclic.med.mapper;

import com.medclic.med.dto.UserDTO;
import com.medclic.med.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "notifications", ignore = true)
    @Mapping(target = "sentMessages", ignore = true)
    @Mapping(target = "receivedMessages", ignore = true)
    UserDTO toDTO(User user);

    @Mapping(target = "notifications", ignore = true)
    @Mapping(target = "sentMessages", ignore = true)
    @Mapping(target = "receivedMessages", ignore = true)
    User toEntity(UserDTO userDTO);
}