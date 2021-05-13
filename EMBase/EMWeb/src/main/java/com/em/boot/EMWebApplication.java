/**
 * 
 */
package com.em.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.em.boot.core.utils.AppUtils;
import com.em.boot.web.interceptors.ThreadLocalHandlerInterceptor;

/**
 * @author FengYu
 *
 */
@Configuration
@SpringBootApplication(scanBasePackages="com.em.boot.web,com.em.boot.core")
@ServletComponentScan("com.em.boot.core")
public class EMWebApplication implements WebMvcConfigurer {
	
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(EMWebApplication.class);
	}
	
	@Bean
	public ThreadLocalHandlerInterceptor getThreadLocalHandlerInterceptor() {
		AppUtils.APP_NAME = "gem";
		return new ThreadLocalHandlerInterceptor();
	}
	 /**
     * ≈‰÷√¿πΩÿ∆˜
     * @param registry
     */
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
	   registry.addInterceptor(getThreadLocalHandlerInterceptor()).addPathPatterns("/app/**");
	}
	
	@Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("index");
    }
	
	public static void main(String[] args) throws Exception {
		SpringApplication.run(EMWebApplication.class, args);
	}
}
