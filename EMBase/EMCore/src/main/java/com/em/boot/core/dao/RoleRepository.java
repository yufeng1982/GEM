/**
 * 
 */
package com.em.boot.core.dao;



import java.util.List;

import org.springframework.data.jpa.repository.Query;

import com.em.boot.core.model.security.Role;

/**
 * @author YF
 *
 */
public interface RoleRepository extends AbsCodeNameEntityRepository<Role> {

	public Iterable<Role> findAllByFunctionNodeIdsLike(String fnId);
	
	@Query("select r from Role r where r.corporation = ?1 and r.roleType = 'OrganizationRole' and r.active = 'T' and r.isAdminRole = 'F'")
	public List<Role> findByCoporation(String corporation);
	
	
//	@Query("select count(*) from Notification n where n.notificationRole = ?1 and n.active = 'T'")
//	public Long findNotificationByNotificationRole(Role notificationRole);
	
//	@Query("select count(*) from RoleGroup r where r.role = ?1 and r.active = 'T'")
//	public Long findRoleGroupByRole(Role role);
	
//	@Query("select count(*) from StatusOwnerLine s where s.role = ?1 and s.corporation = ?2 and s.active = 'T'")
//	public Long findStatusOwnerLineByRoleAndCorporation(Role role, Corporation corporation);
//	
//	@Query("select count(*) from StatusOwnerLine s where s.statusNotifyRole = ?1 and s.corporation = ?2 and s.active = 'T'")
//	public Long findStatusOwnerLineByStatusNotifyRoleAndCorporation(Role statusNotifyRole, Corporation corporation);
//	
//	@Query("select count(*) from StatusOwnerLine s where s.dueDateNotifyRole = ?1 and s.corporation = ?2 and s.active = 'T'")
//	public Long findStatusOwnerLineByDueDateNotifyRoleAndCorporation(Role dueDateNotifyRole, Corporation corporation);

}
