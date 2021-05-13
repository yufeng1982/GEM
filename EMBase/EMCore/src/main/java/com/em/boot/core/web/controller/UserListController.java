package com.em.boot.core.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.em.boot.core.controller.AbsQueryPagedListController;
import com.em.boot.core.model.UserType;
import com.em.boot.core.model.security.User;
import com.em.boot.core.service.security.UserService;
import com.em.boot.core.utils.ThreadLocalUtils;
import com.em.boot.core.vo.UserQueryInfo;

/**
 * @author FengYu
 */
@Controller
@RequestMapping(value="/app/gem/user/list")
public class UserListController extends AbsQueryPagedListController<User, UserQueryInfo> {
	
	private static final String PAGE_USER_LIST = "security/user/users";
	
	@Autowired private UserService userService;

	@Override
	protected UserService getEntityService() {
		return userService;
	}
	
	@RequestMapping("show")
	public String show(ModelMap modelMap) {
		return PAGE_USER_LIST;
	}
	
	@RequestMapping("json")
	public ModelAndView json(@ModelAttribute("pageQueryInfo") UserQueryInfo queryInfo) {
		Sort sort = Sort.by(Direction.ASC, "username");
		queryInfo.setSort(sort);
		User user = ThreadLocalUtils.getCurrentUser();
		if (user.getUserType().equals(UserType.Normal)) queryInfo.setSf_EQ_createdBy(user); 
		Page<User> pagedUsers = getEntityService().getUsersBySearch(queryInfo);
		return toJSONView(pagedUsers);
	}

	@RequestMapping("json4RO")
	public ModelAndView json4RO(@ModelAttribute("pageQueryInfo") UserQueryInfo queryInfo) {
		Sort sort = Sort.by(Direction.ASC, "username");
		queryInfo.setSort(sort);
		Page<User> pagedUsers = getEntityService().getUsersBySearch(queryInfo);
		return toJSONView(pagedUsers);
	}
	
	@RequestMapping("isComponentExsit")
	@ResponseBody
	public Boolean isNameExsit(@RequestParam String property, @RequestParam String value){
		User user = null;
		if (property.equals("username")) {
			user = getEntityService().findByLoginName(value);
		} else if(property.equals("email")){
			user = getEntityService().findByEmail(value);
		} else if(property.equals("nickname")){
			user = getEntityService().findByNickname(value);
		}
		
		if (user != null) {
			 return Boolean.TRUE;
		} 
		return Boolean.FALSE;
	}
	
	
	@Override
	public UserQueryInfo newPagedQueryInfo() {
		return new UserQueryInfo();
	}
	
}
