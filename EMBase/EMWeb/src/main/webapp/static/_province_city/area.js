function showLocation(province , city , town) {
	
	var loc	= new Location();
	var title	= ['省份' , '地级市' , '县、区'];
	$j.each(title , function(k , v) {
		title[k]	= '<option value="">'+v+'</option>';
	})
	
	$j('#loc_province').append(title[0]);
	$j('#loc_city').append(title[1]);
	$j('#loc_town').append(title[2]);
	
	
	$j('#loc_province').change(function() {
		$j('#loc_city').empty();
		$j('#loc_city').append(title[1]);
		loc.fillOption('loc_city' , '0,'+$j('#loc_province').val());
		$j('#loc_town').empty();
		$j('#loc_town').append(title[2]);
		//$j('input[@name=location_id]').val($j(this).val());
	})
	
	$j('#loc_city').change(function() {
		$j('#loc_town').empty();
		$j('#loc_town').append(title[2]);
		loc.fillOption('loc_town' , '0,' + $j('#loc_province').val() + ',' + $j('#loc_city').val());
		//$j('input[@name=location_id]').val($(this).val());
	})
	
	$j('#loc_town').change(function() {
		//$j('input[@name=location_id]').val($j(this).val());
	})
	
	if (province) {
		loc.fillOption('loc_province' , '0' , province);
		
		if (city) {
			loc.fillOption('loc_city' , '0,'+province , city);
			
			if (town) {
				loc.fillOption('loc_town' , '0,'+province+','+city , town);
			}
		}
		
	} else {
		loc.fillOption('loc_province' , '0');
	}
		
}