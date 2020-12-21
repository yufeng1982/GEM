package com.em.boot.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.em.boot.core.utils.ERPServletContext;

/**
 * @author FengYu
 *
 */

@Configuration
public class EMBeanConfiguration {

	@Bean
	public ERPServletContext getERPServletContext() {
		return new ERPServletContext();
	}
	
}
