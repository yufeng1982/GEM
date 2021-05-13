/**
 * 
 */
package com.em.boot.core.service;

import javax.annotation.PostConstruct;

import org.jasypt.hibernate4.encryptor.HibernatePBEStringEncryptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.em.boot.core.model.security.Role;
import com.em.boot.core.model.security.User;
import com.em.boot.core.service.security.RoleService;
import com.em.boot.core.service.security.UserService;

/**
 * @author FengYu
 *
 */
@Component
@Lazy(false)
public class DataInitJob {
	
	@Autowired private UserService userService;
	@Autowired private RoleService roleService;
	
	// THIS IS A HACK, DON'T KNOW WHY THE HELL HAVE TO ANNOUNCE IT BEFORE THE ENTITY USE IT.....
	@Autowired 
	@Qualifier("commonHibernateStringEncryptor")
	private HibernatePBEStringEncryptor commonHibernateStringEncryptor;
	
	@PostConstruct
	public void init() throws Exception {
		System.out.println(commonHibernateStringEncryptor.getRegisteredName());
		
		roleService.initRoles();
		User user = userService.findByLoginName("admin");
		if (user == null ) {
			userService.createAdmin();
		}
	}
}
