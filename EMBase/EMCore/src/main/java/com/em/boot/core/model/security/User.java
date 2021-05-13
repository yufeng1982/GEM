/**
 * 
 */
package com.em.boot.core.model.security;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TreeSet;

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
import org.json.JSONObject;

import com.em.boot.core.enums.Language;
import com.em.boot.core.enums.RoleType;
import com.em.boot.core.model.AbsEntity;
import com.em.boot.core.model.UserType;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.utils.CustomEncryptedStringType;
import com.em.boot.core.utils.FormatUtils;

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
	@Transient private String plainPassword;
	
	@Type(type="true_false")
	private Boolean enabled = Boolean.TRUE;
	
	@Type(type="commonEncryptedString")
	private String email;
	
	@Type(type="commonEncryptedString")
	private String tempEmail;
	
	@Type(type="commonEncryptedString")
	private String phone;
	
	@Enumerated(EnumType.STRING) 
	private Language language = Language.Chinese;
	
	private String salt;
	
	@ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
	@JoinTable(name = "user_role")
	private Set<Role> roles = new LinkedHashSet<Role>();

	private String employeeNo;
	
	private String entryptValidationCode;
	
	private String nickname;
	
	@Enumerated(EnumType.STRING)
	private UserType userType = UserType.Normal;
	
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

	public String getEmployeeNo() {
		return employeeNo;
	}

	public void setEmployeeNo(String employeeNo) {
		this.employeeNo = employeeNo;
	}

	public String getPlainPassword() {
		return plainPassword;
	}

	public void setPlainPassword(String plainPassword) {
		this.plainPassword = plainPassword;
	}

	public void addRole(Role role) {
		this.roles.add(role);
	}
	
	public String getTempEmail() {
		return tempEmail;
	}

	public void setTempEmail(String tempEmail) {
		this.tempEmail = tempEmail;
	}

	public UserType getUserType() {
		return userType;
	}

	public void setUserType(UserType userType) {
		this.userType = userType;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getEntryptValidationCode() {
		return entryptValidationCode;
	}

	public void setEntryptValidationCode(String entryptValidationCode) {
		this.entryptValidationCode = entryptValidationCode;
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

	public Set<Corporation> getAvailableCorporations() {
		Set<Corporation> corporations = new TreeSet<Corporation>();
		Set<Role> roles = this.getRoles();
		if(roles != null && !roles.isEmpty()) {
			for (Role role : roles) {
				Corporation corporation = role.getCorporation();
				if(corporation == null){
					continue;
				}
				corporations.add(corporation);
			}
		}
		return corporations;

	}
	public void clearRoles() {
		this.roles.clear();
	}
	
	public JSONObject toJSONObject() {
    	JSONObject jo = super.toJSONObject();
    	jo.put("code", FormatUtils.stringValue(username));
    	jo.put("name", FormatUtils.stringValue(username));
    	jo.put("corporation", FormatUtils.displayString(getCorporation()));
    	jo.put("email", FormatUtils.stringValue(email));
    	jo.put("enabled", FormatUtils.booleanValue(enabled));
    	jo.put("employeeNo", FormatUtils.stringValue(employeeNo));
    	jo.put("phone", FormatUtils.stringValue(phone));
    	return jo;
	}
}
