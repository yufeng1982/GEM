/**
 * 
 */
package com.em.boot.core.model.article;

import javax.persistence.ConstraintMode;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.envers.Audited;
import org.json.JSONObject;

import com.em.boot.core.model.AbsEntity;
import com.em.boot.core.model.security.User;
import com.em.boot.core.utils.FormatUtils;

/**
 * @author YF
 *
 */
@Entity
@Table(name = "payment_records", schema = "article")
@Audited
public class PaymentRecords extends AbsEntity {

	private static final long serialVersionUID = -5427010831622116471L;
	
	@ManyToOne
	@JoinColumn(name = "payment_user_id", foreignKey = @ForeignKey(name = "none",value = ConstraintMode.NO_CONSTRAINT))
	private User paymentUser;
	
	@ManyToOne
	@JoinColumn(name = "chapters_id", foreignKey = @ForeignKey(name = "none",value = ConstraintMode.NO_CONSTRAINT))
	private Chapters chapters;
	
	private Double amount = new Double(0); 

	public User getPaymentUser() {
		return paymentUser;
	}

	public void setPaymentUser(User paymentUser) {
		this.paymentUser = paymentUser;
	}


	public Chapters getChapters() {
		return chapters;
	}

	public void setChapters(Chapters chapters) {
		this.chapters = chapters;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public JSONObject toJSONObject() {
    	JSONObject jo = super.toJSONObject();
    	jo.put("article", FormatUtils.displayString(chapters.getArticle()));
    	jo.put("chapters", FormatUtils.intValue(chapters.getChapterNo()));
    	jo.put("paymentUser", FormatUtils.displayString(paymentUser));
    	jo.put("amount", FormatUtils.doubleValue(amount));
    	return jo;
	}
	
	@Override
	public String getDisplayString() {
		return null;
	}

}
