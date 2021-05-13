/**
 * 
 */
package com.em.boot.core.service.security;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.em.boot.core.dao.UserRepository;
import com.em.boot.core.enums.Language;
import com.em.boot.core.model.UserType;
import com.em.boot.core.model.security.Role;
import com.em.boot.core.model.security.User;
import com.em.boot.core.service.AbsEntityService;
import com.em.boot.core.utils.DateTimeUtils;
import com.em.boot.core.utils.Digests;
import com.em.boot.core.utils.EncodeUtils;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.utils.ThreadLocalUtils;
import com.em.boot.core.vo.UserQueryInfo;
import com.google.common.collect.Lists;

/**
 * @author FengYu
 *
 */
@Service("userService")
public class UserService extends AbsEntityService<User, UserQueryInfo>{
	
	public static final String HASH_ALGORITHM = "SHA-1";
	public static final int HASH_INTERATIONS = 1024;
	private static final int SALT_SIZE = 8;
	
	@Autowired private UserRepository userRepository;
	@Autowired private RoleService roleService;
	
	protected UserRepository getRepository() {
		return userRepository;
	}
	
	public User findByLoginName(String loginName) {
		return getRepository().findByUsernameAndActiveTrue(loginName);
	}
	
	public User findByEmail(String email) {
		return getRepository().findByEmail(email);
	}
	
	public User findByNickname(String nickname) {
		return getRepository().findByNicknameAndActiveTrue(nickname);
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
	public User save(User user) {
		return userRepository.save(user);
	}
	
	private void encryptPassword(User user) {
		byte[] salt = Digests.generateSalt(SALT_SIZE);
		user.setSalt(EncodeUtils.encodeHex(salt));
		byte[] hashPassword = Digests.sha1(user.getPassword().getBytes(), salt, HASH_INTERATIONS);
		user.setPassword(EncodeUtils.encodeHex(hashPassword));
		
	}
	
	public String entryptPassword(String password ,byte[] salt) {
		byte[] hashPassword = Digests.sha1(password.getBytes(), salt, HASH_INTERATIONS);
		return EncodeUtils.encodeHex(hashPassword);
	}
	
	@Transactional(readOnly = false)
	public Boolean activeEmailByValidationCode(String entryptValidationCode) {
		User user = getRepository().findByEntryptValidationCode(entryptValidationCode);
		if(user != null && user.getTempEmail()!=null) {
			user.setEmail(user.getTempEmail());
			userRepository.save(user);
			return true;
		}
		return false;
	}
	
	@Transactional(readOnly = false)
	public void createAdmin() {
		User user = new User();
		user.setUsername("admin");
		user.setPassword("123");
		user.setEnabled(true);
		user.setEmail("admin@gmail.com");
		user.setPhone("xxxxxxxxxxx");
		user.setLanguage(Language.Chinese);
		user.setCreationDate(DateTimeUtils.dateTimeNow());
		user.setModificationDate(DateTimeUtils.dateTimeNow());
		user.setCreatedBy("admin");
		user.setModifiedBy("admin");
		user.setUserType(UserType.Supper);
		Set<Role> roles = new HashSet<Role>();
		roles.add(roleService.getUniqueByName("adminrole"));
		user.setRoles(roles);
		saveUserAndEncrypt(user);
	}

	public List<User> findAll(final String strQuery) {
		List<User> users = userRepository.findAll(new Specification<User>() {
			
			public Predicate toPredicate(Root<User> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = Lists.newArrayList();
				Path<String> loginNameExp = root.get("loginName");
				Path<String> firstNameExp = root.get("firstName");
				Path<String> lastNameExp = root.get("lastName");
			    String q = "%" + strQuery + "%";
			    predicates.add(cb.like(loginNameExp, q));
			    predicates.add(cb.like(firstNameExp, q));
			    predicates.add(cb.like(lastNameExp, q));
				if (predicates.size() > 0) {
					return cb.or(predicates.toArray(new Predicate[predicates.size()]));
				}
				return cb.conjunction();
			}

		});
		return users;
	}

	public Page<User> getUsersBySearch(final UserQueryInfo queryInfo){
		if(queryInfo.getSf_EQ_corporation() == null) {
			queryInfo.setSf_EQ_corporation(ThreadLocalUtils.getCurrentCorporation());
		}
		return getRepository().findAll(
				new Specification<User>() {
			
			public Predicate toPredicate(Root<User> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				Join<User, Role> join = root.join("roles",JoinType.LEFT);
				List<Predicate> predicates = Lists.newArrayList();
				Path<String> loginNameExp = root.get("username");
				Path<String> idExp = root.get("id");
				Path<User> userExp = root.get("createdBy");
				Path<Boolean> enabledExp = root.get("enabled");
				Path<String> roleCorporationExp = join.get("corporation");
				Path<String> userCorporationExp = root.get("corporation");
				Path<String> roleExp = join.get("id");
				if(!Strings.isEmpty(queryInfo.getSf_LIKE_username())){
				    predicates.add(cb.like(loginNameExp, "%" + queryInfo.getSf_LIKE_username() + "%"));
				}
				if(!Strings.isEmpty(queryInfo.getSf_LIKE_query())){
				    predicates.add(cb.like(loginNameExp, "%" + queryInfo.getSf_LIKE_query() + "%"));
				}
//				if (queryInfo.getSf_EQ_createdBy() != null) {
//					predicates.add(cb.or(cb.equal(userExp, queryInfo.getSf_EQ_createdBy()), cb.equal(idExp, ThreadLocalUtils.getCurrentUser().getId())));
//				}
				if(queryInfo.getSf_EQ_corporation() != null){
				    predicates.add(cb.equal(roleCorporationExp, queryInfo.getSf_EQ_corporation()));
				}
//				if(!Strings.isEmpty(queryInfo.getSf_EQ_roleId())){
//					predicates.add(cb.equal(roleExp, queryInfo.getSf_EQ_roleId()));
//				}
				if(ThreadLocalUtils.getCurrentUser().isSuperAdmin()){
					 predicates.add(cb.isNull(userCorporationExp));
				}
			    predicates.add(cb.equal(enabledExp, queryInfo.getSf_EQ_enabled()));
				if (predicates.size() > 0) {
					query.distinct(true);
					return cb.and(predicates.toArray(new Predicate[predicates.size()]));
				}
				return cb.conjunction();
			}

		}, queryInfo);

	}
	
	@Override
	public boolean isCommonAccess() {
		return false;
	}
}
