import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // 图谱应用
    {//智能问答
      path: '/',
      name: 'tpyy',
      component: resolve => require(['@/view/tpyy/index'], resolve)
    },
    {//智能助手
      path: '/znzs',
      name: 'znzs',
      component: resolve => require(['@/view/tpyy/znzs'], resolve)
    },
    // 知识图谱
    {
      path: '/zstp',
      name: 'zstp',
      component: resolve => require(['@/view/zstp/index'], resolve)
    },
    {//知识图谱  详情
      path: '/zstpDetail',
      name: 'zstp',
      component: resolve => require(['@/view/zstp/detail'], resolve)
    },
    {//知识图谱  添加创建
      path: '/zstpAdd',
      name: 'zstp',
      component: resolve => require(['@/view/zstp/add'], resolve),
    },

    // 模型管理 列表页
    {
      path: '/mxgl',
      name: 'mxgl',
      component: resolve => require(['@/view/mxgl/index'], resolve),
    },
    {//模型管理  添加
      path: '/add-detail',
      name: 'mxgl',
      component: resolve => require(['@/view/mxgl/add-detail'], resolve),
    },
    // 数据源管理
    {//结构化数据
      path: '/sjygl',
      name: 'sjygl',
      component: resolve => require(['@/view/sjygl/jghsj'], resolve)
    },
    // 数据源管理
    {//非结构化数据
      path: '/fjghsj',
      name: 'fjghsj',
      component: resolve => require(['@/view/sjygl/fjghsj'], resolve)
    },
  ]
})
