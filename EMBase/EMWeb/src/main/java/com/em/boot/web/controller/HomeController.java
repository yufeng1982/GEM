package com.em.boot.web.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class HomeController {

	@Autowired
	private MessageSource messageSource;

	@RequestMapping
	public String home() {
//		String message_zh = messageSource.getMessage("Active", new Object[0], Locale.CHINESE);
//		String message_en = messageSource.getMessage("Active", new Object[0], Locale.ENGLISH);
//		String message_fr = messageSource.getMessage("Active", new Object[0], Locale.CANADA_FRENCH);
//		String message_es = messageSource.getMessage("Active", new Object[0], new Locale("es", "", ""));
		return "home";
//		return message_zh + " " + message_en + " " + message_fr + " " + message_es;
	}
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
	    return "home"; 
	}
	
	@RequestMapping("/app/controlPanel")
	public String controlPanel(ModelMap modelMap) {
		return "controlPanel";
	}
	
	@RequestMapping("/app/logout")
	public String test2() {
		return "2";
	}
}
