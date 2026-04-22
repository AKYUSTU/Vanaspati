package com.vanaspati.mapper;

import com.vanaspati.dto.response.UserResponse;
import com.vanaspati.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);
}
