
package com.em.boot.core.dao;

import org.springframework.data.repository.NoRepositoryBean;

import com.em.boot.core.enums.SourceEntityType;
import com.em.boot.core.model.AbsSourceEntity;
import com.em.boot.core.service.security.Corporation;

/**
 * @author YF
 *
 */
@NoRepositoryBean
public interface AbsSourceEntityRepository<T extends AbsSourceEntity> extends AbsRepository<T> {

	public T findByOwnerTypeAndOwnerId(SourceEntityType ownerType, String ownerId);

	public T findByCodeAndOwnerTypeAndCorporation(String code, SourceEntityType ownerType, Corporation corporation);
}
