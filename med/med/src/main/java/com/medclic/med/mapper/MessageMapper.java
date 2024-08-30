package com.medclic.med.mapper;

import com.medclic.med.dto.MessageDTO;
import com.medclic.med.model.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface MessageMapper {

    @Mapping(source = "sender.id", target = "senderId")
    @Mapping(source = "receiver.id", target = "receiverId")
    MessageDTO toDTO(Message message);

    @Mapping(source = "senderId", target = "sender.id")
    @Mapping(source = "receiverId", target = "receiver.id")
    Message toEntity(MessageDTO messageDTO);
}