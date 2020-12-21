/**
 * 
 */
package com.em.boot.core.dao;

import java.util.List;

import org.springframework.data.repository.NoRepositoryBean;

import com.em.boot.core.model.AbsCodeEntity;

/**
 * @author YF
 *
 */
@NoRepositoryBean
public interface AbsCodeEntityRepository<T extends AbsCodeEntity> extends AbsEntityRepository<T> {

	public T findByCodeAndActiveTrue(String code);
	
//	public T findByCodeAndCorporationAndActiveTrue(String code, Corporation corporation);
	
	public List<T> findAllByActiveTrueOrderByCodeAsc();
	
//	public List<T> findAllByCorporationAndActiveTrueOrderByCodeAsc(Corporation corporation);
}
