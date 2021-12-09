import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    curStep: 1,//知识图谱创建   当前步骤
    zstpStatus: true,//用来判断是首次创建还是添加数据  true  首次创建   false  添加
    isBack: false,//从第三步点击返回修改时只能到第二步
  },
  mutations: {
    addStep (state) {
      state.curStep++;
    },
    minusStep (state) {
      state.curStep--;
    },
    initStep (state) {
      state.curStep = 1;
    },
    changeZstpStatus(state, data) {//改变知识图谱创建状态
      state.zstpStatus = data;
    },
    changeIsBack(state, data) {
      state.isBack = data;
    }
  }
})
