package com.em.boot.core.web.controller.article;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.em.boot.core.controller.AbsQueryPagedListController;
import com.em.boot.core.model.article.PaymentRecords;
import com.em.boot.core.service.article.PaymentRecordsService;
import com.em.boot.core.vo.article.PaymentRecordsQueryInfo;

/**
 * @author FengYu
 */
@Controller
@RequestMapping(value="/app/gem/payment/list")
public class PaymentRecordsListController extends AbsQueryPagedListController<PaymentRecords, PaymentRecordsQueryInfo> {
	
	private static final String PAGE_PAY_LIST = "article/payment/paymentRecords";
	
	@Autowired private PaymentRecordsService paymentRecordsService;

	@Override
	protected PaymentRecordsService getEntityService() {
		return paymentRecordsService;
	}
	
	@RequestMapping("show")
	public String show(ModelMap modelMap) {
		return PAGE_PAY_LIST;
	}
	
	@RequestMapping("json")
	public ModelAndView json(@ModelAttribute("pageQueryInfo") PaymentRecordsQueryInfo queryInfo) {
		Page<PaymentRecords> pagedPaymentRecords = getEntityService().getPaymentRecordsBySearch(queryInfo);
		return toJSONView(pagedPaymentRecords);
	}

	@Override
	public PaymentRecordsQueryInfo newPagedQueryInfo() {
		return new PaymentRecordsQueryInfo();
	}
	
}
