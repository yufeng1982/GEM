/**
 * 
 */
package com.em.boot.core.config;

import javax.servlet.annotation.WebServlet;

/**
 * @author YF
 *
 */
@WebServlet(name = "PackServlet",urlPatterns = "*.pack")
public class PackServlet extends net.sf.packtag.servlet.PackServlet {

	private static final long serialVersionUID = 1616833427148132829L;

}
