/**
 * 
 */
package com.em.boot.core.service;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import com.em.boot.core.model.AbsEntity;
import com.em.boot.core.model.security.User;
import com.em.boot.core.utils.DateTimeUtils;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.utils.ThreadLocalUtils;

/**
 * @author YF
 *
 */
@Aspect
@Component
public class EntityAopService {

	@Before(value = "execution(* com.em.boot.core.service..*.save*(..))")
	public void preprocessEntity(JoinPoint joinPoint) {
		if(joinPoint.getTarget().getClass().getName().startsWith("com.em.boot")) {
			processCreationAndModification(joinPoint);
		}
	}
	
	private void processCreationAndModification(JoinPoint joinPoint) {
		User currentUser = ThreadLocalUtils.getCurrentUser();
		if(joinPoint.getArgs()[0] instanceof AbsEntity) {
			AbsEntity entity = (AbsEntity) joinPoint.getArgs()[0];
			if(Strings.isEmpty(entity.getId()) || entity.getCreatedBy() == null || entity.getCreationDate() == null) {
				if(entity.getCreatedBy() == null) entity.setCreatedBy(currentUser != null ? currentUser.getUsername() : "");
				if(entity.getCreationDate() == null) entity.setCreationDate(DateTimeUtils.dateTimeNow());
				entity.setModifiedBy(currentUser!=null?currentUser.getUsername():"");
				entity.setModificationDate(DateTimeUtils.dateTimeNow());
			} else {
				entity.setModifiedBy(currentUser!=null?currentUser.getUsername():"");
				entity.setModificationDate(DateTimeUtils.dateTimeNow());
			}
		}
	}
	
}
