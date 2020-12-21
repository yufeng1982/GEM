/**
 * 
 */
package com.em.boot.core.config;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.Filter;

import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.filter.authc.LogoutFilter;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.embedded.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.DelegatingFilterProxy;

import com.em.boot.core.service.security.UserService;
import com.em.boot.security.ShiroRealm;

/**
 * @author FengYu
 *
 */
@Configuration
public class EMShiroRelatedBeanConfiguration {

	private static final Logger logger = LoggerFactory.getLogger(EMShiroRelatedBeanConfiguration.class); 
	
	/**
     * ע��DelegatingFilterProxy��Shiro��
     * @create 2016��4��15��
     */ 
	@Bean 
    public FilterRegistrationBean filterRegistrationBean() {
        FilterRegistrationBean filterRegistration = new FilterRegistrationBean();
        //  ��ֵȱʡΪfalse,��ʾ����������SpringApplicationContext����,
        //  ����Ϊtrue���ʾ��ServletContainer����  filterRegistration.addInitParameter("targetFilterLifecycle", "true");
        filterRegistration.setFilter(new DelegatingFilterProxy("shiroFilter"));
        filterRegistration.addInitParameter("targetFilterLifecycle", "true");
        filterRegistration.setEnabled(true);
        filterRegistration.addUrlPatterns("/*"); 
        return filterRegistration;
    } 
	
	@Bean(name = "lifecycleBeanPostProcessor") 
    public LifecycleBeanPostProcessor getLifecycleBeanPostProcessor() { 
    	return new LifecycleBeanPostProcessor();
    } 
	
	@Bean(name = "securityManager") 
    public DefaultWebSecurityManager getDefaultWebSecurityManager(ShiroRealm shiroRealm) {
        DefaultWebSecurityManager dwsm = new DefaultWebSecurityManager();
        dwsm.setRealm(shiroRealm); 
        // <!-- �û���Ȩ/��֤��ϢCache, ����EhCache ���� -->  
        dwsm.setCacheManager(getEhCacheManager()); 
        return dwsm;
    } 
	
	@Bean(name = "shiroRealm")
    public ShiroRealm shiroRealm(EhCacheManager cacheManager,UserService userService) {  
		ShiroRealm shiroRealm = new ShiroRealm(); 
		shiroRealm.setCacheManager(cacheManager);
		shiroRealm.setUserService(userService);
        return shiroRealm;
    }  
	
	@Bean
	public EhCacheManager getEhCacheManager() {  
        EhCacheManager em = new EhCacheManager();  
        em.setCacheManagerConfigFile("classpath:ehcache-shiro.xml"); 
        return em;  
    } 
	
//    @Bean 
//    public DefaultAdvisorAutoProxyCreator getDefaultAdvisorAutoProxyCreator() {
//        DefaultAdvisorAutoProxyCreator daap = new DefaultAdvisorAutoProxyCreator();
//        daap.setProxyTargetClass(true); 
//        return daap;
//    } 
    
    
//    @Bean 
//    public AuthorizationAttributeSourceAdvisor getAuthorizationAttributeSourceAdvisor(ShiroRealm shiroRealm) {
//        AuthorizationAttributeSourceAdvisor aasa = new AuthorizationAttributeSourceAdvisor();
//        aasa.setSecurityManager(getDefaultWebSecurityManager(shiroRealm)); 
//        return new AuthorizationAttributeSourceAdvisor();
//    }
    
    /**
     * ShiroFilter<br/>
     * @param shiroRealm
     * @param userService
     */ 
    @Bean(name = "shiroFilter") 
    public ShiroFilterFactoryBean getShiroFilterFactoryBean(ShiroRealm shiroRealm) {

        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean(); 
        // �������� SecurityManager  
        shiroFilterFactoryBean.setSecurityManager(getDefaultWebSecurityManager(shiroRealm)); 
        // ���������Ĭ�ϻ��Զ�Ѱ��Web���̸�Ŀ¼�µ�"/login.jsp"ҳ�� 
        shiroFilterFactoryBean.setLoginUrl("/app/login"); 
        // ��¼�ɹ���Ҫ��ת������ 
        shiroFilterFactoryBean.setSuccessUrl("/app/controlPanel");
        shiroFilterFactoryBean.setUnauthorizedUrl("/app/login");
        LogoutFilter logOutFilter = new LogoutFilter();
        logOutFilter.setRedirectUrl("/app/login");
        Map<String, Filter> filters = new HashMap<String, Filter>();
        filters.put("logout", logOutFilter);
        shiroFilterFactoryBean.setFilters(filters);
        loadShiroFilterChain(shiroFilterFactoryBean); 
        return shiroFilterFactoryBean;
    }

    /**
     * ����shiroFilterȨ�޿��ƹ��򣨴����ݿ��ȡȻ�����ã�
     */ 
    private void loadShiroFilterChain(ShiroFilterFactoryBean shiroFilterFactoryBean){ 
    	/////////////////////// ������Щ��������������õ������ļ��� /////////////////////// 
    	Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>(); 
    	// authc���ù������µ�ҳ�������֤����ܷ��ʣ�����Shiro���õ�һ��������org.apache.shiro.web.filter.authc.FormAuthenticationFilter 
    	// anon������Ӧ�Ĺ����������ǿյ�,ʲô��û��
    	logger.info("##################�����ݿ��ȡȨ�޹��򣬼��ص�shiroFilter��##################");
//        filterChainDefinitionMap.put("/user/edit/**", "authc,perms[user:edit]");
    	filterChainDefinitionMap.put("/app/login", "authc");
    	filterChainDefinitionMap.put("/app/logout", "logout");
        filterChainDefinitionMap.put("/app/**", "authc");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
    } 
}
