/**
 * 
 */
package com.em.boot.core.service.security;

import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.em.boot.core.dao.UserRepository;
import com.em.boot.core.model.security.User;

/**
 * @author FengYu
 *
 */
@Service
@Transactional(readOnly = true)
public class UserService {
	
	public static final String HASH_ALGORITHM = "SHA-1";
	public static final int HASH_INTERATIONS = 1024;
	private static final int SALT_SIZE = 8;
	
	@Autowired private UserRepository userRepository;
	
	protected UserRepository getRepository() {
		return userRepository;
	}
	
	public User findByLoginName(String loginName) {
		return getRepository().findByUsernameAndActiveTrue(loginName);
	}
	
	public SimpleAuthorizationInfo getUerPermissions(){
//		List<FunctionNode> nodeList=functionNodeManager.findValidFunctionNodesForCurrentUser();
		SimpleAuthorizationInfo result = new SimpleAuthorizationInfo();
//		Iterable<Role> roles = ThreadLocalUtils.getCurrentUser().getAvailableRoles(ThreadLocalUtils.getCurrentCorporation());
//        for(Role role: roles){
//      	  	result.addRole(role.getName());
//      	  	addResourcePermission(result, role);
//        }
//        for(FunctionNode node: nodeList){
//	        	String resourceName = node.getName();
//	        	if(!Strings.isEmpty(resourceName)){
//	                result.addStringPermission(resourceName);
//	        	}
//        }
        return result;
	}
}
