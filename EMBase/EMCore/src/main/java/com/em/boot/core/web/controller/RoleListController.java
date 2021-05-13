package com.em.boot.core.web.controller;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.em.boot.core.controller.AbsQueryPagedListController;
import com.em.boot.core.model.UserType;
import com.em.boot.core.model.security.Role;
import com.em.boot.core.model.security.User;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.service.security.CorporationService;
import com.em.boot.core.service.security.RoleService;
import com.em.boot.core.service.security.UserService;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.utils.ThreadLocalUtils;
import com.em.boot.core.vo.RoleQueryInfo;

/**
 * @author FengYu
 */
@Controller
@RequestMapping(value="/app/gem/role/list")
public class RoleListController extends AbsQueryPagedListController<Role, RoleQueryInfo> {
	
	private static final String PAGE_ROLE_LIST = "security/user/roles";
	@Autowired private RoleService roleService;
	
	@Autowired private UserService userService;
	@Autowired private CorporationService corporationService;

	@Override
	protected RoleService getEntityService() {
		return roleService;
	}
	
	@RequestMapping("show")
//	@RequiresPermissions("role:list")
	public String show(ModelMap modelMap) {
		return PAGE_ROLE_LIST;
	}

	@RequestMapping("json")
	public ModelAndView json(@ModelAttribute("pageQueryInfo") RoleQueryInfo queryInfo, @RequestParam(required = false) String userId) {
		if(!Strings.isEmpty(userId)) {
			User user = userService.get(userId);
			if(user != null) {
				return toRoleJSONView(user.getRoles());
			} else {
				return toRoleJSONView(new ArrayList<Role>());
			}
		}
		User user = ThreadLocalUtils.getCurrentUser();
		if (user.getUserType().equals(UserType.Normal)) queryInfo.setSf_EQ_createdBy(user); 
		Iterable<Role> roles = getEntityService().search(queryInfo);
		return toRoleJSONView(roles);
	}
	
	private ModelAndView toRoleJSONView(Iterable<Role> list) {
		JSONObject jso = new JSONObject();
		JSONArray ja = new JSONArray();
		for (Role role : list) {
			JSONObject obj = role.toJSONObject();
			Corporation corporation = role.getCorporation();
			obj.put("corporationName", corporation == null ? "" : corporation.getDisplayName());
			ja.put(obj);
			
		}
		jso.put("data", ja);
		return toJSONView(jso.toString());
	}

	@Override
	public RoleQueryInfo newPagedQueryInfo() {
		return new RoleQueryInfo();
	}
}
