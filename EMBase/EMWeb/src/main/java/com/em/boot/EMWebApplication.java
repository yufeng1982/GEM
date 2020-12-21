/**
 * 
 */
package com.em.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.em.boot.web.interceptors.ThreadLocalHandlerInterceptor;

/**
 * @author FengYu
 *
 */
@Configuration
@SpringBootApplication(scanBasePackages="com.em.boot.web,com.em.boot.core")
public class EMWebApplication extends WebMvcConfigurerAdapter {
	
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(EMWebApplication.class);
	}
	
	@Bean
	public ThreadLocalHandlerInterceptor getThreadLocalHandlerInterceptor() {
		return new ThreadLocalHandlerInterceptor();
	}
	 /**
     * ����������
     * @param registry
     */
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
	   registry.addInterceptor(getThreadLocalHandlerInterceptor()).addPathPatterns("/app/**");
	}
	
	public static void main(String[] args) throws Exception {
		SpringApplication.run(EMWebApplication.class, args);
	}
}
