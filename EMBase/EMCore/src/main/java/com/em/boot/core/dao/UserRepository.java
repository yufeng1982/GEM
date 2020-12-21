/**
 * 
 */
package com.em.boot.core.dao;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.em.boot.core.enums.Language;
import com.em.boot.core.model.security.User;

/**
 * @author YF
 *
 */
public interface UserRepository extends AbsEntityRepository<User> {
	
	
//	@Query("select u from User u where u.firstName = :firstName or u.lastName = :lastName")
//	public User findByLastNameOrFirstName(@Param("lastName") String lastname, @Param("firstName") String firstName);
	
	@Query("select u from User u where u.email = ?1")
	public User findByEmail(String email);
	
	public User findByUsernameAndActiveTrue(String username);
	public User findByUsernameOrEmail(String username, String email);
	
	@Modifying
	@Query("update User u set u.language = ?1 where u.corporation = ?2")
	public int setUserLanguage(Language language, String corporation);
	
//	public User findByEntryptValidationCode(String entryptPassword);
	
//	@Query("select distinct u from User u left join u.roles role left join role.corporation cor where cor.code = ?1")
//	public List<User> findUsersByCorporation(String corporation);
	
//	@Query("select u from User u where u.corporation = ?1 and u.active = 'T'")
//	public List<User> findByCorporation(Corporation corporation);
	
//	public User findByProfile(Profile profile);
	
//	@Query("select u from User u left join u.roles role where role = ?1")
//	public List<User> findByRole(Role role);
	
//	@Query("select u from User u left join u.profile pf where pf.secretCode = ?1")
//	public User findBySecretCode(String secretCode);

//	public User findByLoginNameAndCorporationAndActiveTrue(String loginName, Corporation corporation);

}
