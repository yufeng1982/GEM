/**
 * 
 */
package com.em.boot.core.dao;

import org.springframework.data.repository.NoRepositoryBean;

import com.em.boot.core.model.AbsCodeNameEntity;

/**
 * @author YF
 *
 */
@NoRepositoryBean
public interface AbsCodeNameEntityRepository<T extends AbsCodeNameEntity> extends AbsCodeEntityRepository<T> {

}
