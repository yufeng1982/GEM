/**
 * 
 */
package com.em.boot.core.service;

import com.em.boot.core.dao.AbsCodeNameEntityRepository;
import com.em.boot.core.model.AbsCodeNameEntity;
import com.em.boot.core.utils.PageInfo;

/**
 * @author YF
 *
 */
public abstract class AbsCodeNameEntityService<T extends AbsCodeNameEntity, P extends PageInfo<T>> extends AbsCodeEntityService<T, P> {

	protected abstract AbsCodeNameEntityRepository<T> getRepository();

	public abstract boolean isCommonAccess();

}
