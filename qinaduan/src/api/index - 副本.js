import axios from "axios";

axios.defaults.headers.post['Content-Type'] = 'application/json';

// http request 请求拦截器，有token值则配置上token值
axios.interceptors.request.use(
  config => {
    var token = sessionStorage.token;
    var tokenendtime = sessionStorage.tokenendtime;
    if (token) {
      // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
      config.headers.Authorization = token;
      config.headers.token = token;
    }

    if (tokenendtime) {
      // 每次发送请求之前判断是否存在tokenendtime  存在则带上  向后端提醒 token 快过期了  要替换token
      config.headers.tokenendtime = tokenendtime;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  })

//拦截 ajax
axios.interceptors.response.use(
  response => {

    //保存后端在headers中传过来的token tokenendtime
    if (response.headers.tokenendtime != undefined && response.headers.token != undefined) {

      sessionStorage.setItem("token", response.headers.token);
      sessionStorage.setItem("tokenendtime", response.headers.tokenendtime);

      localStorage.setItem("token", response.headers.token);
      localStorage.setItem("tokenendtime", response.headers.tokenendtime);
    }

    return response;
  },
  error => {
    //断网提示
    // window.location = '#/network'
  })


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

  saveModel(param) {//创建
    return axios.post('/model_manager/create/', param)
  },
  modelList(param) {//列表
    return axios.get('/model_manager/index/', {
      params: param
    })
  },
  modelDetail(param) {//模型详情
    return axios.get(`/model_manager/detail/${param.id}/`, {})
  },
  deleteModel(param) {//模型删除
    return axios.get(`/model_manager/delete/${param.id}/`, {})
  },




  // ----------------------------知识图谱-----------------------
  zstpList(param) {//知识图谱列表内容
    return axios.get('/graph/index/', {
      params: param
    })
  },
}
