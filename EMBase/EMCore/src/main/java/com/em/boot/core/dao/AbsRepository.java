/**
 * 
 */
package com.em.boot.core.dao;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.em.boot.core.model.IEntity;

/**
 * @author YF
 *
 */
@NoRepositoryBean
public interface AbsRepository <T extends IEntity> extends PagingAndSortingRepository<T, String>, JpaSpecificationExecutor<T> {

}
