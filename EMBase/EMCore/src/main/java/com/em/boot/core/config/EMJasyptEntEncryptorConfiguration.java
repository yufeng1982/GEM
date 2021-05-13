/**
 * 
 */
package com.em.boot.core.config;

import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.hibernate4.encryptor.HibernatePBEStringEncryptor;
import org.jasypt.salt.StringFixedSaltGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author YF
 *
 */
@Configuration
public class EMJasyptEntEncryptorConfiguration {

	private static final Logger logger = LoggerFactory.getLogger(EMJasyptEntEncryptorConfiguration.class); 
	
	@Bean("saltGenerator")
	public StringFixedSaltGenerator getFixedStringSaltGenerator() {
		StringFixedSaltGenerator saltGenerator = new StringFixedSaltGenerator("_+=-()09");
		logger.info("Jasypt salt generator auto config done.");
		return saltGenerator;
	}
	
	@Bean("commonStrongEncryptor")
	public PooledPBEStringEncryptor getPooledPBEStringEncryptor(StringFixedSaltGenerator saltGenerator) {
		PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
		encryptor.setAlgorithm("PBEWithMD5AndTripleDES");
		encryptor.setPassword("odsAndTbs");
		encryptor.setPoolSize(2);
		encryptor.setSaltGenerator(saltGenerator);
		logger.info("Jasypt String Encryptor auto config done.");
		return encryptor;
	}
	
	@Bean("commonHibernateStringEncryptor")
	public HibernatePBEStringEncryptor getHibernatePBEStringEncryptor(PooledPBEStringEncryptor commonStrongEncryptor) {
		HibernatePBEStringEncryptor hibernateEncryptor = new HibernatePBEStringEncryptor();
		hibernateEncryptor.setEncryptor(commonStrongEncryptor);
		hibernateEncryptor.setRegisteredName("commonStringEncryptor");
		logger.info("Jasypt Hibernate String Encryptor auto config done.");
		return hibernateEncryptor;
	}
}

