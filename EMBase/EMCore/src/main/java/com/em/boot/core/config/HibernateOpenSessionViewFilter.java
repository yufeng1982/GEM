/**
 * 
 */
package com.em.boot.core.config;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;

import org.springframework.orm.hibernate5.support.OpenSessionInViewFilter;

/**
 * @author YF
 *
 */
@WebFilter(filterName = "hibernateFilter",urlPatterns = "/*")
public class HibernateOpenSessionViewFilter implements Filter {
	private final OpenSessionInViewFilter filter;
	 
    public HibernateOpenSessionViewFilter() {
        filter = new OpenSessionInViewFilter();
        filter.setSessionFactoryBeanName("entityManagerFactory");
        
    }
 
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        filter.init(filterConfig);
    }
 
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        filter.doFilter(request, response, chain);
    }
 
    @Override
    public void destroy() {
        filter.destroy();
    }

}
