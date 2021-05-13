<c:set var="COUNTRY_TPL">
	'<tpl for="."><div class="x-combo-list-item"><tpl if="name == &quot;CAN&quot; || name == &quot;USA&quot; || name == &quot;MEX&quot;"><h3>{text}</h3></tpl><tpl if="name != &quot;CAN&quot; && name != &quot;USA&quot; && name != &quot;MEX&quot;">{text}</tpl></div></tpl>'
</c:set>