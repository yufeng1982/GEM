package com.em.boot.web.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.em.boot.core.enums.Language;
import com.em.boot.core.model.security.User;
import com.em.boot.core.service.security.UserService;
import com.em.boot.core.service.security.UserService;
import com.em.boot.core.utils.DateTimeUtils;

@Controller
public class HomeController {

	@Autowired private MessageSource messageSource;
    @Autowired private UserService userService;
	
	
//	@RequestMapping("login.html")
//	public String home() {
//		String message_zh = messageSource.getMessage("Active", new Object[0], Locale.CHINESE);
//		String message_en = messageSource.getMessage("Active", new Object[0], Locale.ENGLISH);
//		String message_fr = messageSource.getMessage("Active", new Object[0], Locale.CANADA_FRENCH);
//		String message_es = messageSource.getMessage("Active", new Object[0], new Locale("es", "", ""));
//		return "login";
//		return message_zh + " " + message_en + " " + message_fr + " " + message_es;
//	}
	@RequestMapping("/app/login")
	public String login(ModelMap modelMap,HttpServletRequest request, HttpServletResponse response) {
		Subject subject = SecurityUtils.getSubject();
		if(subject.isAuthenticated()){
			try {
				WebUtils.redirectToSavedRequest(request, response, "/app/controlPanel");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	    return "login"; 
	}
	
	@RequiresRoles("admin")
	@RequestMapping("/app/controlPanel")
	public String controlPanel(ModelMap modelMap) {
		modelMap.addAttribute("name", "YF");
		modelMap.addAttribute("subject", SecurityUtils.getSubject());
		return "hello";
	}
	
	@RequestMapping("/logout")
	public String logout() {
		Subject subject=SecurityUtils.getSubject();
		subject.logout();
		return "login";
	}
	
	@RequestMapping("/app/gem/createadmin")
	@ResponseBody
	public String createadmin() {
		User user = new User();
		user.setUsername("admin");
		user.setPassword("123");
		user.setEnabled(true);
		user.setEmail("admin@gmail.com");
		user.setLanguage(Language.English);
		user.setCreationDate(DateTimeUtils.dateTimeNow());
		user.setModificationDate(DateTimeUtils.dateTimeNow());
		user.setCreatedBy("admin");
		user.setModifiedBy("admin");
		userService.saveUserAndEncrypt(user);
		return "create admin success";
	}
	
	@RequestMapping("/app/gem/updateadmin")
	@ResponseBody
	public String updateadmin() {
		User user = userService.findByLoginName("admin");
		user.setPhone("15941145227");
		userService.save(user);
		return "update admin success";
	}
	
}
