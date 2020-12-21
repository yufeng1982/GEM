/**
 * Copyright (c) 2005-20010 springside.org.cn
 * We change/add some extra methods in order to fulfill our project.
 */
package com.em.boot.core.service;

import java.io.Serializable;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Service;

import com.em.boot.core.dao.DefaultEntityDAO;

/**
 * @author YF
 *
 */
@Service
public class DefaultEntityManagerImpl<T, PK extends Serializable> extends AbsEntityManagerImpl<T, PK> {

	protected DefaultEntityDAO<T, PK> entityDAO;

	@Override
	protected DefaultEntityDAO<T, PK> getEntityDAO() {
		return entityDAO;
	}

	@PersistenceContext
	public void setEntityManager(EntityManager entityManager) {
		this.entityDAO = new DefaultEntityDAO<T, PK>(entityManager, entityClass);
	}
	
	// this method was used to MSSQL
	public Integer getSerialNumber(String sequenceName) {
		return entityDAO.getSerialNumber(sequenceName);
	}
}