import axios from "axios";

axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.defaults.timeout = 60000;

// Add a request interceptor
axios.interceptors.request.use(function(config) {
	// Do something before request is sent
	return config;
}, function(error) {
	// Do something with request error
	return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function(response) {
	// Do something with response data
	return response;
}, function(error) {
	// Do something with response error
	return Promise.reject(error);
});


export default {
	// fn(param) { //post
	//   return axios.post('', param)
	// },
	// fn(param) { //get
	//     return axios.get('', {
	//       params: param
	//     })
	// }
	//--------------------模型管理 ---------------------------

	saveModel(param) { //创建
		return axios.post('/model_manager/create/', param)
	},
	modelList(param) { //列表
		return axios.get('/model_manager/index/', {
			params: param
		})
	},
	modelDetail(param) { //模型详情
		return axios.get(`/model_manager/detail/${param.id}/`, {})
	},
	deleteModel(param) { //模型删除
		return axios.get(`/model_manager/delete/${param.id}/`, {})
	},
	editModel(param) { //模型编辑后保存
		return axios.post(`/model_manager/edit/${param.id}/`, param)
	},

	// ----------------------------知识图谱-----------------------
	zstpList(param) { //知识图谱列表内容
		return axios.get('/graph/index/', {
			params: param
		})
	},
	deleteAtlas(param) { //图谱删除
		return axios.get(`/graph/delete/${param.id}/`, {})
	},
	stepInfo(param) { //图谱创建  第一步基本信息
		return axios.post('/graph/create_info/', param)
	},
	modelDown(param) { //图谱创建  第一步概念模型下拉框信息
		return axios.get('/graph/create_entry/', {
			params: param
		})
	},
	dbinit(param) { //数据库索引页
		return axios.get('/data/index/', {
			params: param
		})
	},

	editAtlas(param) { //修改后  重新生成
		return axios.post(`/graph/create/${param.id}/`, param)
	},
	detailAtlas(param) { //图谱详情
		return axios.get(`/graph/detail/${param.id}/`, {})
	},
	stSearchList(param) { //实体  实时搜索返回列表
		return axios.post('/graph/node_index_select/', param)
	},
	entitySearch(param) { //图谱详情  实体搜索
		return axios.get(`/graph/node_index/${param.id}/`, {})
	},
	relationSearch(param) { //图谱详情  关系搜索
		return axios.post('/graph/relation_index/', param)
	},
	gxSearchList(param) { //关系  实时搜索返回列表
		return axios.post('/graph/relation_index_select/', param)
	},
	AbPath(param) { //图谱详情  AB路径搜索
		return axios.post('/graph/node_route/', param)
	},
	dataTrace(param) { //数据追踪
		return axios.get(`/graph/graph_route/${param.id}/`, {
			params: param
		})
	},
	gxTypeClick(param) { //标签类型点击搜索
		return axios.get(`/graph/relation_label_choose/${param.id}/`, {
			params: param
		})
	},
	stLableClick(param) { //实体标签点击搜索
		return axios.get(`/graph/entity_label_choose/${param.id}/`, {
			params: param
		})
	},
	loadChildNode(param) { //实体标签点击搜索
		return axios.get(`/graph/node_click/${param.id}/`, {
			params: param
		})
	},
	// ----------------------------数据源管理-----------------------
	dataindex(param) { // 数据库索引页
		return axios.get('/data/index/', {
			params: param
		})
	},
	data_add(param) { //增加数据库
		return axios.post('/data/db_base/', param)
	},
	data_delete(param) { //删除数据库中的数据源
		return axios.post('/data/delete/', param)
	},
	ysgx(param) { // 关系映射
		return axios.post('/graph/gxyingse/', param)
	},
  ysst(param) { // 关系映射
		return axios.post('/graph/styingse/', param)
	},
	rkRequest(param) { // 入库
		return axios.post('/graph/create/', param)
	},
}
