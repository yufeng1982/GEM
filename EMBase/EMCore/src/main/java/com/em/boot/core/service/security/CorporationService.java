/**
 * 
 */
package com.em.boot.core.service.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.em.boot.core.dao.CorporationRepository;
import com.em.boot.core.service.AbsCodeNameEntityService;
import com.em.boot.core.vo.CorporationPageInfo;

/**
 * @author FengYu
 *
 */
@Component
public class CorporationService extends AbsCodeNameEntityService<Corporation, CorporationPageInfo> {
	
	@Autowired CorporationRepository corporationRepository;
	
	public Corporation findByActiveTrue(){
		return getRepository().findByActiveTrue();
	}
	
	@Override
	protected CorporationRepository getRepository() {
		return corporationRepository;
	}

	@Override
	public boolean isCommonAccess() {
		return false;
	}

}
