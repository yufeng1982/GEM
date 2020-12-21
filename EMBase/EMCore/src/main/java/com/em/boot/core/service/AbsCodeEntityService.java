/**
 * 
 */
package com.em.boot.core.service;

import com.em.boot.core.dao.AbsCodeEntityRepository;
import com.em.boot.core.model.AbsCodeEntity;
import com.em.boot.core.utils.PageInfo;

/**
 * @author YF
 *
 */
public abstract class AbsCodeEntityService<T extends AbsCodeEntity, P extends PageInfo<T>> extends AbsEntityService<T, P> {

	protected abstract AbsCodeEntityRepository<T> getRepository();
	
	public abstract boolean isCommonAccess();

	
	public T findByCode(String code) {
		return getRepository().findByCodeAndActiveTrue(code);
	}
	
//	public T findByCodeAndCorporation(String code, Corporation corporation) {
//		return getRepository().findByCodeAndCorporationAndActiveTrue(code, corporation);
//	}
}
