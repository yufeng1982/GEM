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
import com.em.boot.core.utils.Digests;
import com.em.boot.core.utils.EncodeUtils;
import com.em.boot.core.utils.Strings;

/**
 * @author FengYu
 *
 */
@Service("userService")
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
	
	@Transactional(readOnly = false)
	public void saveUserAndEncrypt(User user) {
		if(!Strings.isEmpty(user.getPassword())) {
			encryptPassword(user);
		}
		userRepository.save(user);
	}
	
	@Transactional(readOnly = false)
	public void save(User user) {
		userRepository.save(user);
	}
	
	private void encryptPassword(User user) {
		byte[] salt = Digests.generateSalt(SALT_SIZE);
		user.setSalt(EncodeUtils.encodeHex(salt));
		byte[] hashPassword = Digests.sha1(user.getPassword().getBytes(), salt, HASH_INTERATIONS);
		user.setPassword(EncodeUtils.encodeHex(hashPassword));
		
	}
}
