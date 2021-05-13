/**
 * 
 */
package com.em.boot.core.service.article;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;

import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.em.boot.core.dao.article.PaymentRecordsRepository;
import com.em.boot.core.model.article.Article;
import com.em.boot.core.model.article.Chapters;
import com.em.boot.core.model.article.PaymentRecords;
import com.em.boot.core.model.security.User;
import com.em.boot.core.service.AbsEntityService;
import com.em.boot.core.vo.article.PaymentRecordsQueryInfo;

/**
 * @author FengYu
 *
 */
@Service("paymentRecordsService")
public class PaymentRecordsService extends AbsEntityService<PaymentRecords, PaymentRecordsQueryInfo>{
	
	@Autowired private PaymentRecordsRepository paymentRecordsRepository;
	
	@Transactional(readOnly = false)
	public PaymentRecords save(PaymentRecords paymentRecords) {
		return getRepository().save(paymentRecords);
	}

	public Page<PaymentRecords> getPaymentRecordsBySearch(final PaymentRecordsQueryInfo queryInfo){
		return getRepository().findAll((Specification<PaymentRecords>) (root, query, cb) -> {
			Predicate predicate = cb.conjunction();
			Join<PaymentRecords, Article> chapterjoin =  root.join("chapters", JoinType.LEFT);
			Join<Chapters, Article> articlejoin =  chapterjoin.join("article", JoinType.LEFT);
			if(!Strings.isEmpty(queryInfo.getSf_LIKE_article())){
				predicate.getExpressions().add(cb.equal(articlejoin.get("title"), queryInfo.getSf_LIKE_article()));
			}
			if(!Strings.isEmpty(queryInfo.getSf_LIKE_chapters())){
				predicate.getExpressions().add(cb.equal(chapterjoin.get("title"), queryInfo.getSf_LIKE_chapters()));
			}
			if(!Strings.isEmpty(queryInfo.getSf_LIKE_paymentUser())){
				Join<PaymentRecords, User> join =  root.join("paymentUser", JoinType.LEFT);
				predicate.getExpressions().add(cb.equal(join.get("username"), queryInfo.getSf_LIKE_paymentUser()));
			}
			predicate.getExpressions().add(cb.equal(root.get("active"), true));
			return predicate;
		}, queryInfo);
	}
	
	@Override
	public boolean isCommonAccess() {
		return false;
	}

	@Override
	protected PaymentRecordsRepository getRepository() {
		return paymentRecordsRepository;
	}
}
