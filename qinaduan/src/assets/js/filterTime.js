import Vue from 'vue'
// 全局过滤器

/* 过滤后台时间戳 */
Vue.filter('filterTime', function (value, format2) {
  if(!value) return;
	if (value.toString().length > 10) value = parseInt(value / 1000);
	let number = value;
	var format = format2 || 'Y-M-D h:m:s'
	var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
	var returnArr = [];
	var date = new Date(number * 1000);
	returnArr.push(date.getFullYear());
	returnArr.push(formatNumber(date.getMonth() + 1));
	returnArr.push(formatNumber(date.getDate()));

	returnArr.push(formatNumber(date.getHours()));
	returnArr.push(formatNumber(date.getMinutes()));
	returnArr.push(formatNumber(date.getSeconds()));

	for (var i in returnArr) {
		format = format.replace(formateArr[i], returnArr[i]);
	}
	return format;
})

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}
