package com.em.boot.core.service.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.em.boot.core.model.security.User;
import com.em.boot.core.utils.EncodeUtils;
import com.em.boot.core.utils.ResourceUtils;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.utils.ThreadLocalUtils;

/**
 * @author FengYu
 */
@Component
public class UserValidator {

	@Autowired UserService userService;
	
	public void validateResetPassword(User user) {
		String oldPassword = user.getPlainPassword();
		if(!Strings.isEmpty(oldPassword)) {
			
			String inputPassword = userService.entryptPassword(oldPassword,EncodeUtils.decodeHex(user.getSalt()));
			if(inputPassword != null &&!inputPassword.equals(user.getPassword())) {
				ThreadLocalUtils.addErrorMsg(ResourceUtils.getText("User.Validat.Password.Different"));
			}
		}
		if(!userService.isPropertyUnique("username", user.getUsername(), user.getId())) {
			ThreadLocalUtils.addErrorMsg(ResourceUtils.getText("User.Validat.Name.Unique"));
		}
	}
	public void validate(User user) {
		if(!Strings.isEmpty(user.getPlainPassword())) {
			if(!user.getPassword().equals(user.getPlainPassword())) {
				ThreadLocalUtils.addErrorMsg(ResourceUtils.getText("User.Validat.Password.Different"));
			}
		}
		if(!userService.isPropertyUnique("username", user.getUsername(), user.getId())) {
			ThreadLocalUtils.addErrorMsg(ResourceUtils.getText("User.Validat.Name.Unique"));
		}
	}
}
