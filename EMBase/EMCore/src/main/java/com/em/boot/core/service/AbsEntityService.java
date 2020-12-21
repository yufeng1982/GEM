/**
 * 
 */
package com.em.boot.core.service;

import java.text.DecimalFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import com.em.boot.core.dao.AbsEntityRepository;
import com.em.boot.core.model.AbsEntity;
import com.em.boot.core.model.ISerial;
import com.em.boot.core.utils.PageInfo;
import com.em.boot.core.utils.PropertyFilter;

/**
 * @author YF
 *
 */
public abstract class AbsEntityService<T extends AbsEntity, P extends PageInfo<T>> extends AbsService<T, P> {

	protected abstract AbsEntityRepository<T> getRepository();
	
	@Autowired private DefaultEntityManagerImpl defaultEntityManagerImpl;
	
	public void delete(String id) {
		delete(get(id));
	}
	
	public Iterable<T> getAll() {
		return getRepository().findAllByActiveTrue();
	}

	public T save(T t){
		return super.save(t);
	}
	
//	public Iterable<T> getAllByCorporation(Corporation corporation) {
//		return getRepository().findAllByCorporationAndActiveTrue(corporation);
//	}
	
	public Page<T> getAllByFilter(List<PropertyFilter> filters, PageInfo<T> queryInfo) {
		return getRepository().findAll(bySearchFilter(filters), queryInfo);
	}
	
	public String getSerialNumber(ISerial iSerial) {
		// fro ms sql
		Integer lSerialNumber = getRepository().getSerialNumber(iSerial.getSequenceName());
		// for pg sql
//		List<BigInteger> obj= getRepository().getSerialNumber( iSerial.getSequenceName() );
//		BigInteger lSerialNumber = obj.get(0);
		StringBuffer numOfZeros = new StringBuffer();
		for (int i = 0; i < iSerial.getSequenceLength(); i ++) {
			numOfZeros.append("0");
		}
		
		String sq = iSerial.getSequenceLength() == 0 ? lSerialNumber.toString() : new DecimalFormat(numOfZeros.toString()).format(lSerialNumber);

		String seq = new StringBuffer().append(iSerial.getPrefix()).append(sq).toString();
		
		return seq;
	}
	
//	public int resetSequenceStart(String seqName, Long start);

//	public T getBySourceEntityId(String sourceEntityId);
	
}
