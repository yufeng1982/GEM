package com.em.boot.web.controller;

import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;

import com.em.boot.core.controller.AbsController;
import com.em.boot.core.model.security.FunctionNodeType;
import com.em.boot.core.model.security.User;
import com.em.boot.core.service.AbsService;
import com.em.boot.core.service.StateService;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.service.security.CorporationService;
import com.em.boot.core.service.security.UserService;
import com.em.boot.core.utils.FormatUtils;
import com.em.boot.core.utils.ThreadLocalUtils;

/**
 * @author FengYu
 */
@Controller
public class MainFrameController extends AbsController<Object> {
	
	@Autowired UserService userService;
	@Autowired private CorporationService corporationService;
	@Autowired private StateService stateService;

	@SuppressWarnings("rawtypes")
	@Override
	protected AbsService getEntityService() {
		return null;
	}

	@RequestMapping("/app/gem/ui/mainFrame")
	public String mainFrame(ModelMap modelMap, WebRequest request, HttpServletRequest r, HttpServletResponse response) {
		
		User currentUser = ThreadLocalUtils.getCurrentUser();
		Iterable<Corporation> cs = currentUser.getAvailableCorporations();
		JSONArray ja = new JSONArray();
		for (Corporation c : cs) {
			JSONObject v = new JSONObject();
			v.put("id", c.getId());
			v.put("shortName", c.getShortName());
			ja.put(v);
		}
		try {
			modelMap.addAttribute("cs", java.net.URLEncoder.encode(ja.toString(), "utf-8"));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		modelMap.addAttribute("currentUser", currentUser);
		modelMap.addAttribute("isSuperAdmin", User.SUPER_ADMIN_NAME.equals(currentUser.getUsername()));
		Corporation corporation = ThreadLocalUtils.getCurrentCorporation();
		modelMap.addAttribute("currentCorporation", corporation);
		modelMap.addAttribute("workDate", FormatUtils.formatDate(ThreadLocalUtils.getCurrentWorkDate()));
		modelMap.addAttribute("language", ThreadLocalUtils.getCurrentLocale().getLanguage());
		
		modelMap.addAttribute("rootTree", getRootLevelMenuJSON().toString());
		return "ui/main";
	}
	
	@RequestMapping(value = "/app/gem/ui/resetPassword")
	@ResponseBody
	public String resetPassword(@RequestParam String userId, @RequestParam("plainPassword") String plainPassword,ModelMap modelMap){
		User user =userService.get(userId);
		if(user!=null){
			user.setPassword(plainPassword);
			userService.saveUserAndEncrypt(user);
			return "true";
		} 
		return "false";
	}
	
	private JSONArray getRootLevelMenuJSON() {
		List<FunctionNodeType> functionTypeList = functionNodeService.findValidFunctionNodeTypesForCurrentUser();
		JSONArray menuPanelItemsArray = new JSONArray();
		for (FunctionNodeType eachType : functionTypeList) {
			menuPanelItemsArray.put(eachType.toJson());
		}
		return menuPanelItemsArray;
	}

}
