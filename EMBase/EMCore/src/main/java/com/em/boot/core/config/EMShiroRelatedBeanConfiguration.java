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
     *  ����Shiro��ע��(��@RequiresRoles,@RequiresPermissions),�����SpringAOPɨ��ʹ��Shiroע�����,���ڱ�Ҫʱ���а�ȫ�߼���֤
     * ������������bean(DefaultAdvisorAutoProxyCreator��AuthorizationAttributeSourceAdvisor)����ʵ�ִ˹���
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
//     * register DelegatingFilterProxy��Shiro��
//     * 
//     */ 
//	@Bean 
//    public FilterRegistrationBean filterRegistrationBean() {
//        FilterRegistrationBean filterRegistration = new FilterRegistrationBean();
//        //  ��ֵȱʡΪfalse,��ʾ����������SpringApplicationContext����,
//        //  ����Ϊtrue���ʾ��ServletContainer����  filterRegistration.addInitParameter("targetFilterLifecycle", "true");
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
//        // �������� SecurityManager  
//        shiroFilterFactoryBean.setSecurityManager(getDefaultWebSecurityManager(shiroRealm)); 
//        // ���������Ĭ�ϻ��Զ�Ѱ��Web���̸�Ŀ¼�µ�"/login.jsp"ҳ�� 
//        shiroFilterFactoryBean.setLoginUrl("/app/login"); 
//        // ��¼�ɹ���Ҫ��ת������ 
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
//     * ����shiroFilterȨ�޿��ƹ��򣨴����ݿ��ȡȻ�����ã�
//     */ 
//    private void loadShiroFilterChain(ShiroFilterFactoryBean shiroFilterFactoryBean){ 
//    	/////////////////////// ������Щ��������������õ������ļ��� /////////////////////// 
//    	Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>(); 
//    	// authc���ù������µ�ҳ�������֤����ܷ��ʣ�����Shiro���õ�һ��������org.apache.shiro.web.filter.authc.FormAuthenticationFilter 
//    	// anon������Ӧ�Ĺ����������ǿյ�,ʲô��û��
//    	logger.info("##################�����ݿ��ȡȨ�޹��򣬼��ص�shiroFilter��##################");
////        filterChainDefinitionMap.put("/user/edit/**", "authc,perms[user:edit]");
//    	filterChainDefinitionMap.put("/app/gem/createadmin", "anon");
//    	filterChainDefinitionMap.put("/app/login", "authc");
//    	filterChainDefinitionMap.put("/app/logout", "logout");
//        filterChainDefinitionMap.put("/app/**", "authc");
//        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
//    } 
}
