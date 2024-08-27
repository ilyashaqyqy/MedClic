package com.medclic.med.mapper;

import com.medclic.med.dto.UserDTO;
import com.medclic.med.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "role", target = "role")
    UserDTO toDTO(User user);

    @Mapping(source = "role", target = "role")
    User toEntity(UserDTO userDTO);
}
