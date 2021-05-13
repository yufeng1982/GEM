/**
 * 
 */
package com.em.boot.core.dao;

import com.em.boot.core.service.security.Corporation;

/**
 * @author FengYu
 *
 */
public interface CorporationRepository extends AbsCodeNameEntityRepository<Corporation> {

	public Corporation findByActiveTrue();
}
