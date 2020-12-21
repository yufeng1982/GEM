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
     * 注册DelegatingFilterProxy（Shiro）
     * @create 2016年4月15日
     */ 
	@Bean 
    public FilterRegistrationBean filterRegistrationBean() {
        FilterRegistrationBean filterRegistration = new FilterRegistrationBean();
        //  该值缺省为false,表示生命周期由SpringApplicationContext管理,
        //  设置为true则表示由ServletContainer管理  filterRegistration.addInitParameter("targetFilterLifecycle", "true");
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
        // <!-- 用户授权/认证信息Cache, 采用EhCache 缓存 -->  
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
        // 必须设置 SecurityManager  
        shiroFilterFactoryBean.setSecurityManager(getDefaultWebSecurityManager(shiroRealm)); 
        // 如果不设置默认会自动寻找Web工程根目录下的"/login.jsp"页面 
        shiroFilterFactoryBean.setLoginUrl("/app/login"); 
        // 登录成功后要跳转的连接 
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
     * 加载shiroFilter权限控制规则（从数据库读取然后配置）
     */ 
    private void loadShiroFilterChain(ShiroFilterFactoryBean shiroFilterFactoryBean){ 
    	/////////////////////// 下面这些规则配置最好配置到配置文件中 /////////////////////// 
    	Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>(); 
    	// authc：该过滤器下的页面必须验证后才能访问，它是Shiro内置的一个拦截器org.apache.shiro.web.filter.authc.FormAuthenticationFilter 
    	// anon：它对应的过滤器里面是空的,什么都没做
    	logger.info("##################从数据库读取权限规则，加载到shiroFilter中##################");
//        filterChainDefinitionMap.put("/user/edit/**", "authc,perms[user:edit]");
    	filterChainDefinitionMap.put("/app/login", "authc");
    	filterChainDefinitionMap.put("/app/logout", "logout");
        filterChainDefinitionMap.put("/app/**", "authc");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
    } 
}
