/**
 * 
 */
package com.em.boot.core.model;

import java.util.List;

public interface ISerial {
	public static final int sequenceLength = 6;
	public String getSequence();
	public String getSequenceName();
	public String getPrefix();
	public int getSequenceLength();
	public void setSequence(String sequence);
	public String getSequenceNameSuffix();
	
	public List<String> getOtherDiscriminatorNames();
	public List<Object> getOtherDiscriminatorValues();
	
	public static final String  TIME_ENTRY = "TE";
								
	
	public static final String  SO_SEQUENCE = "document.so_sequence", 
								PO_SEQUENCE = "document.po_sequence", 
								SI_SEQUENCE = "document.si_sequence", 
								PI_SEQUENCE = "document.pi_sequence", 
								RO_SEQUENCE = "document.ro_sequence", 
								CN_SEQUENCE = "document.cn_sequence",
								SP_SEQUENCE = "document.sp_sequence", 
								TO_SEQUENCE = "document.to_sequence", 
								IA_SEQUENCE = "document.ia_sequence",
								RP_SEQUENCE = "document.rp_sequence",
								TL_SEQUENCE = "document.tl_sequence",
								LS_SEQUENCE = "document.ls_sequence",
								QT_SEQUENCE = "document.qt_sequence",
								PR_SEQUENCE = "document.pr_sequence",
								WO_SEQUENCE = "document.wo_sequence",
								TW_SEQUENCE = "document.tw_sequence",
								IC_SEQUENCE = "document.ic_sequence",
								MPS_SEQUENCE = "document.mps_sequence",
								PS_SEQUENCE = "document.ps_sequence",
								CT_SEQUENCE = "crm.contact_sequence",
								ST_SEQUENCE = "crm.ship_to_sequence",
								SF_SEQUENCE = "crm.ship_from_sequence",
								C_SEQUENCE = "crm.customer_sequence",
								V_SEQUENCE = "crm.vendor_sequence",
								MIX_SEQUENCE = "external.tag_mix",
								TAG_W_SEQUENCE = "external.tag_w_sequence",
								TAG_V_SEQUENCE = "external.tag_v_sequence",
								TAG_C_SEQUENCE = "external.tag_c_sequence",
								TAG_T_SEQUENCE = "external.tag_t_sequence",
								TAG_B_SEQUENCE = "external.tag_b_sequence",
								TAG_F_SEQUENCE = "external.tag_f_sequence",
								TAG_S_SEQUENCE = "external.tag_s_sequence",
								TAG_P_SEQUENCE = "external.tag_p_sequence",
								TAG_K_SEQUENCE = "external.tag_k_sequence",
								TAG_H_SEQUENCE = "external.tag_h_sequence",
								TAG_R_SEQUENCE = "external.tag_r_sequence",
								TAG_EDI_NV_SEQUENCE = "external.tag_edi_nv_sequence",
								TAG_EDI_STELCO_SEQUENCE = "external.tag_edi_stelco_sequence",
								TIME_ENTRY_SEQUENCE = "hr.time_entry_sequence",
								BATCH_TIME_ENTRY_SEQUENCE = "hr.batch_time_entry_sequence";
}
