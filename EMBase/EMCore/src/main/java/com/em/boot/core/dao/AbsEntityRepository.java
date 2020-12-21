/**
 * 
 */
package com.em.boot.core.dao;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

import com.em.boot.core.model.AbsEntity;

/**
 * @author YF
 *
 */
@NoRepositoryBean
public interface AbsEntityRepository<T extends AbsEntity> extends AbsRepository<T> {
	
	final static long maxValue = 9223372036854775807l;
	
	public List<T> findAllByActiveTrue();
	
	public List<T> findAllByActiveTrue(Sort sort);
	
//	public List<T> findAllByCorporationAndActiveTrue(Corporation corporation);
	
	
	@Modifying
	@Query(value = "CREATE SEQUENCE ?1 INCREMENT 1 MINVALUE 1 MAXVALUE 999 START 1" , nativeQuery = true )
	public int createSequence(Integer obj);

//	pg sql
	@Modifying
	@Query(value = "SELECT nextval( ?1 )", nativeQuery = true)
	public Integer getSerialNumber(String sequenceName);
	
//	MSSQL sql server donot support ?1 fro query sequence
//	@Modifying
//	@Query(value = "SELECT NEXT VALUE FOR ?1", nativeQuery = true)
//	public List<BigInteger> getSerialNumber(String sequenceName);

	
}
