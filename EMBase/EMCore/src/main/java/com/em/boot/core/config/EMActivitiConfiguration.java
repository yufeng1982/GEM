///**
// * 
// */
//package com.em.boot.core.config;
//
//import java.io.IOException;
//
//import javax.sql.DataSource;
//
//import org.activiti.spring.SpringAsyncExecutor;
//import org.activiti.spring.SpringProcessEngineConfiguration;
//import org.activiti.spring.boot.AbstractProcessEngineAutoConfiguration;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.transaction.PlatformTransactionManager;
//
///**
// * @author FengYu
// * override Activiti configuration SpringProcessEngineConfiguration to resolve Chinese Unrecognizable Code
// */
//@Configuration
//public class EMActivitiConfiguration extends AbstractProcessEngineAutoConfiguration {
//
//	@Bean
//    public SpringProcessEngineConfiguration springProcessEngineConfiguration(
//						    		DataSource dataSource, 
//						    		PlatformTransactionManager transactionManager, 
//						    		SpringAsyncExecutor springAsyncExecutor) throws IOException {
//		SpringProcessEngineConfiguration spec = baseSpringProcessEngineConfiguration(dataSource, transactionManager, springAsyncExecutor);
//        spec.setLabelFontName("¿¬Ìå");
//		spec.setActivityFontName("¿¬Ìå");
//		return spec;
//    }
//	
//}
