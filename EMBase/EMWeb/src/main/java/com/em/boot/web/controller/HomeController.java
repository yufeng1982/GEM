package com.em.boot.web.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.em.boot.core.controller.AbsController;
import com.em.boot.core.model.security.Verification;
import com.em.boot.core.service.AbsService;
import com.em.boot.core.service.security.CorporationService;
import com.em.boot.core.service.security.UserService;


/**
 * @author FengYu
 */
@Controller
@RequestMapping
public class HomeController  extends AbsController<Object> {
	@Autowired private CorporationService corporationService;
	@Autowired private UserService userService;
	
	@RequestMapping("/app/login")
	public String login(ModelMap modelMap,HttpServletRequest request, HttpServletResponse response) {
		modelMap.addAttribute("showVerifyMsg", Verification.temp != Verification.acutal);
		modelMap.addAttribute("corporations", corporationService.getAll());
		Subject subject = SecurityUtils.getSubject();
		if(subject.isAuthenticated()) {
			try {
				WebUtils.redirectToSavedRequest(request, response, "/app/gem/ui/mainFrame");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return "home"; 
		
	}
	
	@RequestMapping("/back")
	public String backend(ModelMap modelMap,HttpServletRequest request, HttpServletResponse response) {
		return "/backend/backend"; 
		
	}
	
//	@RequestMapping("/forgetPassword")
//	public String forgetPassword(@RequestParam(value= "userEmail" ,required=false) String userEmail ,RedirectAttributes redirectAttributes) {
//		if(userService.sendforgotPasswordMail(userEmail)) {
//			redirectAttributes.addFlashAttribute("message", ResourceUtils.getText("Com.Mail.SendMail"));
//			redirectAttributes.addFlashAttribute("messageFlag", true);
//			return "redirect:/app/toForgetPassword"; 
//		}
//		redirectAttributes.addFlashAttribute("messageFlag", false);
//		redirectAttributes.addFlashAttribute("message", ResourceUtils.getText("Com.Mail.MailNotExist"));
//		return "redirect:/app/toForgetPassword"; 
//		
//	}
//	@RequestMapping("/toForgetPassword")
//	public String toForgetPassword(RedirectAttributes redirectAttributes) {
//		return "forgetPassword"; 
//		
//	}
//	@RequestMapping("/toResetPassword/{id}")
//	public String toResetPassword(RedirectAttributes redirectAttributes,@PathVariable(value="id") String entryptValidationCode,ModelMap modelMap) {
//		User findByEntryptValidationCode = userService.findByEntryptValidationCode(entryptValidationCode);
//		if(findByEntryptValidationCode!=null) {	
//			modelMap.put("entryptValidationCode",entryptValidationCode);
//			return "resetPassword";
//		}
//		return "redirect:/app/login"; 
//		
//	}
//	@RequestMapping("/doResetPassword")
//	public String doResetPassword(RedirectAttributes redirectAttributes, @RequestParam(value="entryptValidationCode") String entryptValidationCode, @RequestParam(value="plainPassword") String plainPassword,ModelMap modelMap) {
//		User user = userService.findByEntryptValidationCode(entryptValidationCode);
//		if(user!=null) {	
//			user.setPlainPassword(plainPassword);
//			userService.saveUserAndEncrypt(user);
//			redirectAttributes.addFlashAttribute("message", "Password reset success! Please relogin");
//			return "redirect:/app/login";
//		}
//		return "redirect:/app/login"; 
//		
//	}
	@RequestMapping("/controlPanel")
	public String controlPanel() {
		return "controlPanel";
	}

	@SuppressWarnings("rawtypes")
	@Override
	protected AbsService getEntityService() {
		return null;
	}
	
}

