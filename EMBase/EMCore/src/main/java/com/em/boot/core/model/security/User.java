/**
 * 
 */
package com.em.boot.core.model.security;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.Parameter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.envers.Audited;

import com.em.boot.core.enums.Language;
import com.em.boot.core.enums.RoleType;
import com.em.boot.core.model.AbsEntity;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.utils.CustomEncryptedStringType;

/**
 * @author FengYu
 *
 */

@TypeDef(name="commonEncryptedString", typeClass=CustomEncryptedStringType.class, parameters= {@Parameter(name="encryptorRegisteredName", value="commonStringEncryptor")})


@Entity
@Table(name = "users", schema = "public")
@Audited
public class User extends AbsEntity {

	private static final long serialVersionUID = 4915236783993823684L;
	public static final String SUPER_ADMIN_NAME = "admin";
	
	private String username;
	private String password;
	
	@Type(type="true_false")
	private Boolean enabled = Boolean.FALSE;
	
	private String email;
	
	@Type(type="commonEncryptedString")
	private String phone;
	
	@Enumerated(EnumType.STRING) 
	private Language language;
	
	private String salt;
	
	@ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
	@JoinTable(name = "user_role")
	private Set<Role> roles = new LinkedHashSet<Role>();

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSalt() {
		return salt;
	}

	public void setSalt(String salt) {
		this.salt = salt;
	}

	public Language getLanguage() {
		return language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Transient
	public boolean isSuperAdmin() {
		return this.getUsername() != null && this.getUsername().equals(SUPER_ADMIN_NAME);
	}
	
	@Override
	public String getDisplayString() {
		return null;
	}
	
	public Set<Role> getAvailableRoles(Corporation corporation) {
		Set<Role> availableRoles = new HashSet<>();
		if(corporation != null){
			for(Role role : roles){
				if(role.getCorporation().equals(corporation) || RoleType.GroupRole.equals(role.getRoleType())){
					availableRoles.add(role);
				}
			}
		}else{
			return getRoles();
		}
		return availableRoles;
	}

}
