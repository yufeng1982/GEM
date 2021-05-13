package com.em.boot.core.web.controller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.em.boot.core.controller.AbsFormController;
import com.em.boot.core.enums.Language;
import com.em.boot.core.model.security.Role;
import com.em.boot.core.model.security.User;
import com.em.boot.core.service.security.CorporationService;
import com.em.boot.core.service.security.RoleService;
import com.em.boot.core.service.security.UserService;
import com.em.boot.core.service.security.UserValidator;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.utils.ThreadLocalUtils;


/**
 * @author FengYu
 */
@Controller
@RequestMapping(value="/app/gem/user/form")
public class UserController extends AbsFormController<User> {
	
	private static final String PAGE_USER_FORM = "security/user/user";
	private static final String PAGE_PASSWORD_FORM = "security/user/passwordChange";
	private static final String PAGE_EMAIL_FORM = "security/user/emailChange";

	@Autowired private UserService userService;
	@Autowired private RoleService roleService;
	@Autowired private CorporationService corporationService;
	@Autowired private UserValidator userValidator;

	@Override
	protected UserService getEntityService() {
		return userService;
	}
	
	@RequestMapping(value = "{id}/cancel", method = {RequestMethod.PUT, RequestMethod.POST})
	public ModelAndView cancel(ModelMap modelMap) {
		return closePage(modelMap);
	}
	
	@RequestMapping(value = "{id}/apply", method = {RequestMethod.PUT, RequestMethod.POST})
	public ModelAndView apply(@RequestParam("roleListJSON") JSONArray roleListJSONArray, 
						ModelMap modelMap, 
						@ModelAttribute("entity") User user, BindingResult result) {
		
		saveUser(roleListJSONArray, user, result);
		return redirectTo("user/form/" + (Strings.isEmpty(user.getId()) ? NEW_ENTITY_ID : user.getId())  + "/show", modelMap);
	}
	@RequestMapping(value = "{id}/ok", method = {RequestMethod.PUT, RequestMethod.POST})
	public ModelAndView ok(@RequestParam("roleListJSON") JSONArray roleListJSONArray, 
						ModelMap modelMap, 
						@ModelAttribute("entity") User user, BindingResult result) {
		
		if(saveUser(roleListJSONArray, user, result)) {
			return closePage(modelMap);
		}
		return redirectTo("user/form/" + (Strings.isEmpty(user.getId()) ? NEW_ENTITY_ID : user.getId())  + "/show", modelMap);
	}
	
	@RequestMapping(value = "{id}/password/rest")
	public String showUserRestPassword(@ModelAttribute("entity") User user, ModelMap modelMap) {
		populateAttributes(user, modelMap);
		return PAGE_PASSWORD_FORM;
	}
	@RequestMapping(value = "{id}/email/change")
	public String showUserChangeEmail(@ModelAttribute("entity") User user, ModelMap modelMap) {
		
		populateAttributes(user, modelMap);
		return PAGE_EMAIL_FORM;
	}
	
	@RequestMapping(value = "{id}/password/superResetOk")
	@ResponseBody
	public String superResetPassword(@PathVariable(value="id") String userId, @RequestParam("plainPassword") String plainPassword, ModelMap modelMap){
		User user =userService.get(userId);
		if(user!=null){
			user.setPassword(plainPassword);
			userService.saveUserAndEncrypt(user);
			return "true";
		} 
		return "false";
	}
	
	@RequestMapping(value = "{id}/password/ok", method = {RequestMethod.PUT, RequestMethod.POST})
	public ModelAndView resetPasswordOk(@ModelAttribute("entity") User user, @RequestParam("oldPassword") String oldPassword,BindingResult result, ModelMap modelMap) {
		String newPassword=user.getPlainPassword();
		user.setPlainPassword(oldPassword);
		userValidator.validateResetPassword(user);
		user.setPlainPassword(newPassword);
		boolean isSucceed = !hasErrorMessages();
		if (isSucceed) {
			userService.saveUserAndEncrypt(user);
			return redirectTo("/logout",modelMap);
		}
		return redirectTo("user/form/" + (Strings.isEmpty(user.getId()) ? NEW_ENTITY_ID : user.getId()) + "/password/rest", modelMap);
	}

	@RequestMapping(value = "{id}/email/activeNewEmail",  method = RequestMethod.GET)
	public String doChangeEmail(@PathVariable(value="id") String entryptValidationCode, RedirectAttributes redirectAttributes, ModelMap modelMap) {
		Boolean isSuccess = userService.activeEmailByValidationCode(entryptValidationCode);
		String MainPath = "redirect:/app/pgm/pulseLoginSuccess";
		if(isSuccess) {
			redirectAttributes.addFlashAttribute("success", true);
			redirectAttributes.addFlashAttribute("message", "Congratulations. New Email actived.");
			return MainPath;
		}
		redirectAttributes.addFlashAttribute("success",  false);
		redirectAttributes.addFlashAttribute("message", "Error happend...");
		return MainPath;
	}
	@RequestMapping(value = "{id}/password/cancel", method = {RequestMethod.PUT, RequestMethod.POST})
	public ModelAndView resetPasswordCancel(ModelMap modelMap) {
		return closePage(modelMap);
	}
	
	private boolean saveUser(JSONArray roleListJSONArray,User user, BindingResult result) {
		userValidator.validate(user);
		boolean isSucceed = !hasErrorMessages();
		if (isSucceed) {
			retrieveData(roleListJSONArray, user);
			userService.saveUserAndEncrypt(user);
		}
		return isSucceed;
	}
	
	@RequestMapping(value = "{id}/show")
	public String showUser(@ModelAttribute("entity") User user, ModelMap modelMap) {
		modelMap.addAttribute("isSuperAdmin", ThreadLocalUtils.getCurrentUser().getUsername().equals("admin"));
		populateAttributes(user, modelMap);
		return PAGE_USER_FORM;
	}
	
	protected void populateAttributes(User user, ModelMap modelMap) {
		modelMap.addAttribute("corporations", user.getAvailableCorporations());
		modelMap.addAttribute("languages", Language.getLanguages());
		modelMap.addAttribute("userId", user.getId());
//		modelMap.addAttribute("questions", Question.getQuestions());
	}
//	private JSONArray buildCorporationCoboxData(List<Corporation> list) {
//		JSONArray array = new JSONArray();
//		for (Corporation c : list) {
//			JSONObject jso = new JSONObject();
//			jso.put("code", c.getCode());
//			jso.put("name", c.getName());
//			array.put(jso);
//		}
//		return array;
//	}

	@ModelAttribute("entity")
	public User populateUser(@PathVariable(value="id") String id) {
		User user = null;
		if(isNew(id)) {
			user = new User();
		} else {
			user = userService.get(id);
		}
		
		return user;
	}
	
	private void retrieveData(JSONArray roleListJSONArray, User user) {
		user.clearRoles();
		if(roleListJSONArray == null) return ;
		for(int i = 0, size = roleListJSONArray.length(); i < size; i ++) {
			JSONObject jo = roleListJSONArray.getJSONObject(i);
			if(jo.has("id")){
				String roleId = jo.getString("id");
				if(!Strings.isEmpty(roleId)) {
					Role role = roleService.get(roleId);
					if(role != null) user.addRole(role);
				}
			}
		}
	}
}
