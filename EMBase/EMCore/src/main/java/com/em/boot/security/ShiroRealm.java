package com.em.boot.security;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;

import com.em.boot.core.model.security.User;
import com.em.boot.core.service.security.UserService;
import com.em.boot.core.utils.EncodeUtils;


public class ShiroRealm extends AuthorizingRealm {

	@Autowired private UserService userService;

	public ShiroRealm() {
		super();	
		//设置认证token的实现类
		setAuthenticationTokenClass(UsernamePasswordToken.class);
		//设置加密算法
		HashedCredentialsMatcher matcher = new HashedCredentialsMatcher(UserService.HASH_ALGORITHM);
		matcher.setHashIterations(UserService.HASH_INTERATIONS);
		setCredentialsMatcher(matcher);
	}

	//授权
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
	     String loginName = (String) principalCollection.fromRealm(getName()).iterator().next();
	     User user = userService.findByLoginName(loginName);
	     if (null == user) {
	          return null;
	     } else {
	          SimpleAuthorizationInfo result = userService.getUerPermissions();
	          return result;
	     }
	}
	//认证
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
	     UsernamePasswordToken upToken = (UsernamePasswordToken) token;
	     User user = userService.findByLoginName(upToken.getUsername());
	     if (user != null) {
	    	 if (!user.isEnabled() || !user.isActive()) return null;
	    	 byte[] salt = EncodeUtils.decodeHex(user.getSalt());
	         return new SimpleAuthenticationInfo(user.getUsername(), user.getPassword(), ByteSource.Util.bytes(salt), getName());
	     }
	     return null;
	}
}
