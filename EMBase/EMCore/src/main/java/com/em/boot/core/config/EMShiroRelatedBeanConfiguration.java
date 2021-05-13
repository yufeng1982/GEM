/**
 * 
 */
package com.em.boot.core.config;

import org.apache.shiro.cache.CacheManager;
import org.apache.shiro.cache.MemoryConstrainedCacheManager;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.config.DefaultShiroFilterChainDefinition;
import org.apache.shiro.spring.web.config.ShiroFilterChainDefinition;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.em.boot.security.ShiroRealm;

/**
 * @author FengYu
 *
 */
@Configuration
public class EMShiroRelatedBeanConfiguration {

	private static final Logger logger = LoggerFactory.getLogger(EMShiroRelatedBeanConfiguration.class); 

	/**this is spring boot shrio web starter config*/
	@Bean("authorizer")
    public ShiroRealm shiroRealm() {
		ShiroRealm realm = new ShiroRealm();
		logger.info("Shiro realm auto injected");
        return realm;
    }

	
	@Bean
    public ShiroFilterChainDefinition shiroFilterChainDefinition() {
        DefaultShiroFilterChainDefinition chainDefinition = new DefaultShiroFilterChainDefinition();
        chainDefinition.addPathDefinition("/app/gem/updateadmin", "anon");
        chainDefinition.addPathDefinition("/app/gem/showMs", "anon");
       // chainDefinition.addPathDefinition("/static/**", "anon");
        chainDefinition.addPathDefinition("/app/login", "authc"); // need to accept POSTs from the login form
        chainDefinition.addPathDefinition("/app/logout", "logout");
        chainDefinition.addPathDefinition("/app/**", "authc");
        logger.info("Shiro Filter Chain auto injected");
        return chainDefinition;
    }
	
	/**
	 * important bean : use srping dynmaic proxy (if don't config this bean will use JDK dynamic proxy so just auto inject interface) 
	 */
	@Bean
    public DefaultAdvisorAutoProxyCreator advisorAutoProxyCreator(){
        DefaultAdvisorAutoProxyCreator advisorAutoProxyCreator = new DefaultAdvisorAutoProxyCreator();
        advisorAutoProxyCreator.setProxyTargetClass(true);
        return advisorAutoProxyCreator;
    }
  
	/**
     *  开启Shiro的注解(如@RequiresRoles,@RequiresPermissions),需借助SpringAOP扫描使用Shiro注解的类,并在必要时进行安全逻辑验证
     * 配置以下两个bean(DefaultAdvisorAutoProxyCreator和AuthorizationAttributeSourceAdvisor)即可实现此功能
     * @return
     */
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor() {
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(getDefaultWebSecurityManager(shiroRealm()));
        return authorizationAttributeSourceAdvisor;
    }

	@Bean(name = "securityManager") 
	public DefaultWebSecurityManager getDefaultWebSecurityManager(ShiroRealm shiroRealm) {
		DefaultWebSecurityManager dwsm = new DefaultWebSecurityManager();
		dwsm.setRealm(shiroRealm);
		dwsm.setCacheManager(getEhCacheManager()); 
		return dwsm;
	} 
	@Bean
	public CacheManager getEhCacheManager() {  
		MemoryConstrainedCacheManager em = new MemoryConstrainedCacheManager();  
        return em;  
    } 
	
//	/**    following is shiro spring config
//     * register DelegatingFilterProxy（Shiro）
//     * 
//     */ 
//	@Bean 
//    public FilterRegistrationBean filterRegistrationBean() {
//        FilterRegistrationBean filterRegistration = new FilterRegistrationBean();
//        //  该值缺省为false,表示生命周期由SpringApplicationContext管理,
//        //  设置为true则表示由ServletContainer管理  filterRegistration.addInitParameter("targetFilterLifecycle", "true");
//        filterRegistration.setFilter(new DelegatingFilterProxy("shiroFilter"));
//        filterRegistration.addInitParameter("targetFilterLifecycle", "true");
//        filterRegistration.setEnabled(true);
//        filterRegistration.addUrlPatterns("/*"); 
//        return filterRegistration;
//    } 
//	
//	@Bean(name = "lifecycleBeanPostProcessor") 
//    public LifecycleBeanPostProcessor getLifecycleBeanPostProcessor() { 
//    	return new LifecycleBeanPostProcessor();
//    } 
//	
//	@Bean(name = "securityManager") 
//    public DefaultWebSecurityManager getDefaultWebSecurityManager(ShiroRealm shiroRealm) {
//        DefaultWebSecurityManager dwsm = new DefaultWebSecurityManager();
//        dwsm.setRealm(shiroRealm);
//        dwsm.setCacheManager(getEhCacheManager()); 
//        return dwsm;
//    } 
//	
//	@Bean(name = "shiroRealm")
//    public ShiroRealm shiroRealm(CacheManager cacheManager) {  
//		ShiroRealm shiroRealm = new ShiroRealm(); 
//		shiroRealm.setCacheManager(cacheManager);
//        return shiroRealm;
//    }  
//	
//	@Bean
//	public CacheManager getEhCacheManager() {  
//		MemoryConstrainedCacheManager em = new MemoryConstrainedCacheManager();  
//        return em;  
//    }  
//    
//    @Bean 
//    public AuthorizationAttributeSourceAdvisor getAuthorizationAttributeSourceAdvisor(ShiroRealm shiroRealm) {
//        AuthorizationAttributeSourceAdvisor aasa = new AuthorizationAttributeSourceAdvisor();
//        aasa.setSecurityManager(getDefaultWebSecurityManager(shiroRealm)); 
//        return new AuthorizationAttributeSourceAdvisor();
//    }
//    
//    /**
//     * ShiroFilter<br/>
//     * @param shiroRealm
//     * @param userService
//     */ 
//    @Bean(name = "shiroFilter") 
//    public ShiroFilterFactoryBean getShiroFilterFactoryBean(ShiroRealm shiroRealm) {
//
//        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean(); 
//        // 必须设置 SecurityManager  
//        shiroFilterFactoryBean.setSecurityManager(getDefaultWebSecurityManager(shiroRealm)); 
//        // 如果不设置默认会自动寻找Web工程根目录下的"/login.jsp"页面 
//        shiroFilterFactoryBean.setLoginUrl("/app/login"); 
//        // 登录成功后要跳转的连接 
//        shiroFilterFactoryBean.setSuccessUrl("/app/controlPanel");
//        shiroFilterFactoryBean.setUnauthorizedUrl("/app/login");
//        LogoutFilter logOutFilter = new LogoutFilter();
//        logOutFilter.setRedirectUrl("/app/login");
//        Map<String, Filter> filters = new HashMap<String, Filter>();
//        filters.put("logout", logOutFilter);
//        shiroFilterFactoryBean.setFilters(filters);
//        loadShiroFilterChain(shiroFilterFactoryBean); 
//        return shiroFilterFactoryBean;
//    }
//
//    /**
//     * 加载shiroFilter权限控制规则（从数据库读取然后配置）
//     */ 
//    private void loadShiroFilterChain(ShiroFilterFactoryBean shiroFilterFactoryBean){ 
//    	/////////////////////// 下面这些规则配置最好配置到配置文件中 /////////////////////// 
//    	Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>(); 
//    	// authc：该过滤器下的页面必须验证后才能访问，它是Shiro内置的一个拦截器org.apache.shiro.web.filter.authc.FormAuthenticationFilter 
//    	// anon：它对应的过滤器里面是空的,什么都没做
//    	logger.info("##################从数据库读取权限规则，加载到shiroFilter中##################");
////        filterChainDefinitionMap.put("/user/edit/**", "authc,perms[user:edit]");
//    	filterChainDefinitionMap.put("/app/gem/createadmin", "anon");
//    	filterChainDefinitionMap.put("/app/login", "authc");
//    	filterChainDefinitionMap.put("/app/logout", "logout");
//        filterChainDefinitionMap.put("/app/**", "authc");
//        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
//    } 
}
