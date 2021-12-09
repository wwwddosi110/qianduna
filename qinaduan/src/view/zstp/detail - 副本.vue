<template>
    <div class="editBox p-relative">
      <div id="mynetwork"></div>
      <!-- 实体/关系  滑过展示的详细信息 -->
      <div class="networkInfo solid bg-white">
        <el-scrollbar style="height: 100%;">
          <!-- 标签 -->
          <div class="tabBox flex align-center flex-wrap padding-lr-sm" v-if="hoverBq.length > 0">
            标签：<span class="hover-pointer text-white" v-for="(item, index) in hoverBq" :key="index" :style="{background: color2[Math.floor(Math.random() * 4)]}">{{item}}</span>
          </div>
          <div class="padding-sm" style="line-height: 20px;" v-if="hoverBq.length > 0">
            属性：
            <span class="margin-right-sm" v-for="(item, index) in hoverSx" :key="index">{{item[0]}}: {{item[2]}};</span>
          </div>
        </el-scrollbar>
      </div>
      <!-- 知识图谱   AB路径 -->
      <div class="leftBox p-absolute bg-white">
        <!-- 切换 -->
        <div class="tabBox flex solid text-16 padding-tb-xs">
          <p class="margin-right hover-pointer padding-left" :class="(curType == '0' ? 'active' : '')" @click="handleTp"><i class="iconfont icon-people-network-full margin-right-xs"></i>知识图谱</p>
          <p class="hover-pointer" :class="(curType == '1' ? 'active' : '')" @click="handleLj">AB路径</p>
        </div>
        <template v-if="curType == 0">
          <!-- 搜索 -->
          <div class="searchBox p-relative flex solid align-center padding-right-sm">
            <el-select v-model="lVal" placeholder="请选择" @change="selectSwitch">
              <el-option
                v-for="item in lSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-divider direction="vertical"></el-divider>
            <el-input
                placeholder=""
                v-model="searchVal"
                 @focus="inputKeyup"
                @input="inputKeyup">
            </el-input>
            <i class="el-icon-search text-20 hover-pointer" @click="handleSearch" style="color: #64dd7e;"></i>
            <!-- 实时列表 -->
            <div class="relaTimeList p-absolute bg-white" v-show="isShowSearchList">
              <el-scrollbar style="height: 100%;">
                <p class="item hover-pointer padding-lr-sm ellipse" :title="item.name" v-for="(item, index) in searchList" :key="index" @click="clickList(item)">{{item.name}}</p>
                <el-empty :image-size="120" v-show="searchList.length < 1"></el-empty>
              </el-scrollbar>
            </div>
          </div>
          <!-- 标签 -->
          <el-scrollbar style="height: calc(400px - 86px);">
            <p class="text-18 padding-xs">实体标签</p>
            <div class="tabBox flex text-white flex-wrap">
              <span class="hover-pointer" v-for="(item, index) in stbq" :key="index" @click="stLabelClick(item, index)" :style="{background: stColor[index]}">{{item}}</span>
            </div>
            <p class="text-18 padding-xs">关系类型</p>
            <div class="tabBox flex text-white flex-wrap padding-bottom-sm">
              <span class="hover-pointer" v-for="(item, index) in gxbq" :key="index" @click="gxTypeClick(item, index)" :style="{background: color2[Math.floor(Math.random() * 4)]}">{{item}}</span>
            </div>
          </el-scrollbar>
        </template>
        <template v-if="curType == 1">
          <div class="abPath padding-sm p-relative">
            <el-timeline>
              <el-timeline-item timestamp="" placement="top" color="#fbd69d">
                <template v-slot="dot">
                  <div class="p-relative">
                    <div class="itemBox flex">
                      <el-input v-model="startVal" @input="pathInput($event, 'start')" :clearable="true" placeholder="起点名称"></el-input>
                    </div>
                    <ul class="p-absolute"></ul>
                  </div>
                </template>
              </el-timeline-item>
              <!-- <el-timeline-item timestamp="" placement="top">
                <template v-slot="dot">
                  <el-input v-model="passVal" :clearable="true" placeholder="途径名称"></el-input>
                </template>
              </el-timeline-item> -->
              <el-timeline-item timestamp="" placement="top" color="#fbd69d">
                <template v-slot="dot">
                  <el-input v-model="endVal" @input="pathInput($event, 'end')" :clearable="true" placeholder="终点名称"></el-input>
                </template>
              </el-timeline-item>
            </el-timeline>
            <div class="flex">
              <el-radio-group v-model="radio">
                <el-radio :label="1">综合结果</el-radio>
                <!-- <el-radio :label="2">仅途径审批</el-radio>
                <el-radio :label="3">仅途径部门</el-radio> -->
              </el-radio-group>
            </div>

            <div class="abList p-absolute bg-white" v-show="isShowPath" :style="{left: pathLeft + 'px', top: pathTop + 'px'}">
              <el-scrollbar style="height: 100%;">
                <p class="padding-lr-xs solid-bottom hover-pointer ellipse" :title="item.name" @click="pathListClick(item)" v-for="(item, index) in pathList" :key="index">{{item.name}}</p>
                <el-empty :image-size="110" v-show="pathList.length < 1"></el-empty>
              </el-scrollbar>
            </div>
          </div>
        </template>
      </div>
      <!-- 知识图谱   AB路径   .end-->

      <!-- 数据追踪 -->
      <p class="sjzz p-absolute hover-pointer text-16" @click="dataTrace"><i class="iconfont icon-people-network-full text-theme margin-right-xs"></i>数据追踪</p>
      <!-- 添加数据 -->
      <p class="tjsj p-absolute hover-pointer text-16" @click="navto"><i class="iconfont icon-a-148tianjiashujufenxitianjiashujubiao text-theme margin-right-xs"></i>添加数据</p>
      <!-- 数据追踪  抽屉-->
      <el-drawer
        title="数据追踪"
        :modal="false"
        :size="300"
        :wrapperClosable="false"
        :visible.sync="drawer"
        :direction="direction">
        <el-scrollbar style="height: 100%;">
          <div class="padding-lr-sm">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                placement="top"
                :timestamp="activity.time">
                <template v-slot="dot">
                  <p v-if="activity.info" class="ellipse" v-for="(item, ind) in activity.info" :title="item.tables + '（' + item.db_name + '-' + item.db_type + '）'" :key="ind">
                    {{item.tables}}（{{item.db_name}}||{{item.db_type}}）
                  </p>
                </template>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-scrollbar>
      </el-drawer>
      <!-- 数据追踪.end -->
      <!-- 节点/关系信息 -->
      <div class="infoData bg-white p-absolute" v-show="isInfoShow" :style="{left: leftVal+'px', top: topVal+'px'}">

      </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        id: '',//图谱id
        kg_name: '',
        model_name: 'asd',
        kg_decribe: '',
        isInfoShow: false,//节点/关系 点击后展示信息框
        leftVal: 0,
        topVal: 0,
        curType: 0, //当前选中  知识图谱(0)/AB路径(1)
        radio: 1,//AB路径当前选择
        lVal: '实体',//搜索选择  实体/关系
        isShowSearchList: false,
        searchList: [],//实时搜索返回的列表
        searchId: '',//要搜索实体id
        lSelect: [{//搜索左侧下拉选择
          value: '实体',
          label: '实体'
        }, {
          value: '关系',
          label: '关系'
        }],
        searchVal: '',//左侧搜索内容
        stColor: [],
        color2: ['#ffcc99', '#9cc', '#c99', '#f96', '#99cc99', '#1aad82', '#ffcc00', '#fcc', '#66f', '#c66'],
        stbq: [],
        gxbq: [],
        drawer: false,//右侧数据追踪是否展示
        direction: 'rtl',//抽屉打开方式
        nodes: [],
        edges: [],
        nodesBackup: [],//后台返回实体数据
        edgesBackup: [],//后台返回关系数据
        activities: [],//添加数据
        startVal: '',
        passVal: '',
        endVal: '',
        hoverBq: [],//滑过实体时 对应标签
        hoverSx: [],//滑过实体时 对应属性
        pathLeft: 48,//ab路径候选项列表left
        pathTop: 61,//ab路径候选项列表top
        pathList: [],//搜索后的列表
        isShowPath: false,//ab搜索列表是否展示
        abState: 'start',//AB当前输入
        startId: null,
        endId: null,
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.kg_name = this.$route.query.name;
      this.loadData();
    },
    mounted() {
      this.initVis();
    },
    methods: {
      getRandomColor(){//随机生成颜色
        return '#'+Math.floor(Math.random()*0xffffff).toString(16);
      },
      // 详情接口数据加载
      loadData() {
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.detailAtlas({
          id: this.id
        }).then(res => {
          loading.close();
          console.log('图谱详情', res)
          // 实体 关系数据
          this.stbq = res.data.en_biaoqian;//实体标签
          this.gxbq = res.data.re_biaoqian;//关系标签
          this.stbq.unshift(`全部(${res.data.entity_total})`);
          this.gxbq.unshift(`全部(${res.data.relation_total})`);
          this.stbq.forEach((item, index) => {
            var c = this.getRandomColor();
            console.log(c)
            if(this.stColor.includes(c) || c == '#ffffff' || c.length < 7) {
              console.log(this.getRandomColor(),'12')
              this.stColor.push(this.getRandomColor())
            }else {
              this.stColor.push(c)
            }
          })
          console.log(this.stColor)
          // -------------------------
          this.kg_name = res.data.kg_name;//模型名称
          this.model_name = res.data.model_name;//概念模型
          this.kg_decribe = res.data.kg_decribe;//模型描述
          // {id: 1, label: 'Node 1'}
          this.nodes = res.data.entity_label;
          this.nodes.forEach(item => {
            item.label = item.name
          })
          this.edges = res.data.entity_relation;
          this.edges.forEach(item => {
            if(item.fx == '单向') {item.arrows = "to"}
            if(item.fx == '双向') {item.arrows = "to, from"}
            if(item.fx == '无向') {item.arrows = ""}
            item.label = item.name;
          })
          this.nodesBackup = JSON.stringify(res.data.entity_label) //将数据转化为json字符串
          this.edgesBackup = JSON.stringify(res.data.entity_relation)
          this.initVis();
        }).catch(err => {
          loading.close();
          this.$message.error('详情加载失败：' + err)
        })
      },
      // 图谱画布初始化
      initVis() {
        var _this = this;
        var container = document.getElementById("mynetwork");
        var data = {
              nodes: _this.nodes,
              edges: _this.edges,
            };
        var options = {
              nodes: {
                shape: 'dot', //节点形状
                font: {
                  color: '#333', //
                },
                borderWidth: 0, //节点边框宽度
                size: 13, //节点大小
                chosen: {
                  node: function(e) {
                    e.color = '#409EFF';
                  }
                },
                // chosen: true
              },
              // 设置关系连线
              edges: {
                color: {
                  color: '#999', //线颜色
                },
                font: {
                  color: '#333', //线条上的文字颜色
                  strokeWidth: 0, //文字描边
                },
              },
              interaction: {//交互
                hover: true,//hoverNode事件才能生效
              }
            };
        var network = new vis.Network(container, data, options);
        // 鼠标滑过节点
        network.on('hoverNode', function(e) {
          console.log(e)
          var id = e.node;//当前滑过节点id
          JSON.parse(_this.nodesBackup).forEach(item => {
            if(item.id === id) {
              _this.hoverBq = item.bq;
              _this.hoverSx = item.property
            }
          })

          // _this.isInfoShow = true;
          // var x = e.pointer.DOM.x,
          //     y = e.pointer.DOM.y;
          // _this.leftVal = x + 20;
          // _this.topVal = y + 20;
          // if(y > 490) {
          //   _this.topVal = y - 300
          // }
          // if(x > 730) {
          //   _this.leftVal = x - 200
          // }
        })
        // network.on('blurNode', function(e) {
        //   _this.isInfoShow = false;
        // })


        // network.on('hoverEdge', function(e) {
        //   console.log(e)
        // })

        // network.on('selectNode', function(e) {
        //   _this.isInfoShow = false;
        // })
        // network.on('selectEdge', function(e) {
        //   _this.isInfoShow = false;
        // })


        network.on("oncontext", function (e) {
          console.log(this.getNodeAt(e.pointer.DOM))

          e.event.preventDefault();
        })

      },
      selectSwitch() {//实体  标签 下拉框切换
        this.isShowSearchList = false;
        this.searchVal = '';
      },
      // 实体  关系  输入框 键盘输入事件
      inputKeyup() {
        if(this.searchVal == '') return this.isShowSearchList = false;
        this.isShowSearchList = true;
        this.searchList = [];
        if(this.lVal == '实体') {
          this.loadStList()
        }
        if(this.lVal == '关系') {
          this.loadGxList();
        }
      },
      // 实体输入  实时内容
      loadStList() {
        this.$api.stSearchList({//graph/node_index_select/
          kg_name: this.kg_name,
          search: this.searchVal,
        }).then(res => {
          console.log('实体实时搜索结果', res)
          this.searchList = res.data.index_result;
        }).catch(err => {
          // loading.close();
          this.$message.error('错误：' + err)
        })
      },
      // 关系输入  实时内容
      loadGxList() {
        this.$api.gxSearchList({
          kg_name: this.kg_name,
          search: this.searchVal,
        }).then(res => {
          console.log('关系实时列表', res)
          res.data.re_name.forEach(item => {
            this.searchList.push({name: item});
          })
          console.log(this.searchList)
        })
      },
      // 点击实时返回的数据
      clickList(item) {
        this.searchList = [];
        this.searchId = item.id;
        this.searchVal =  item.name;
        if(this.lVal == '实体') {
          const loading = this.$loading({
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$api.entitySearch({
            id: item.id
          }).then(res => {
            loading.close();
            console.log('点击实体searchlist搜索结果', res);
            this.nodes = res.data.index_result;
            this.nodes.forEach(item => {
              item.label = item.name
            })
            this.isShowSearchList = false;
            this.initVis();
          }).catch(err => {
            this.isShowSearchList = false;
            loading.close();
            this.$message.error('搜索错误' + err)
          })
        }
        if(this.lVal == '关系') {
          this.gxSearch(item.name)
        }
      },
      gxSearch(val) {//点击关系搜索候选项  或者  icon 直接搜索
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.relationSearch({
          kg_name: this.kg_name,
          re_name: val
        }).then(res => {
          console.log('关系点击候选项列表搜索', res)
          loading.close();
          this.nodes = res.data.entity;
          this.nodes.forEach(item => {
            item.label = item.name
          })
          this.edges = res.data.sanyuanzu;
          this.edges.forEach(item => {
            if(item.fx == '单向') {item.arrows = "to"}
            if(item.fx == '双向') {item.arrows = "to, from"}
            if(item.fx == '无向') {item.arrows = ""}
            item.label = item.name;
          })
          this.isShowSearchList = false;
          this.initVis();
        }).catch(err => {
          this.isShowSearchList = false;
          loading.close();
          this.$message.error('搜索错误' + err)
        })
      },
      // 左侧  实体 /关系 通过点击icon  进行搜索
      handleSearch() {
        if(this.searchVal == '') return this.$message.error('请输入要搜索的内容');
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if(this.lVal == '实体') {
          this.$api.stSearchList({//graph/node_index_select/
            kg_name: this.kg_name,
            search: this.searchVal,
          }).then(res => {
            loading.close();
            console.log('点击搜索icon实体实时搜索结果', res)
            this.isShowSearchList = false;
            if(res.data.index_result.length < 1) return this.$message.error('暂无符合条件的相关数据');
            this.nodes = res.data.index_result;
            this.nodes.forEach(item => {
              item.label = item.name
            })
            this.initVis();
          }).catch(err => {
            loading.close();
            this.$message.error('错误：' + err)
          })
        }
        if(this.lVal == '关系'){
          this.gxSearch(this.searchVal)
        }
      },
      pathInput(e, type) {//AB路径输入
        if(e == '') return this.isShowPath = false;
        this.abState = type;
        if(type == 'start') {this.pathTop = 61; this.startId = null;}
        if(type == 'end') {this.pathTop = 125; this.endId = null;}
        this.pathSearch(e);
      },
      pathSearch(e) {
        this.isShowPath = true;
        this.$api.stSearchList({//graph/node_index_select/
          kg_name: this.kg_name,
          search: e,
        }).then(res => {
          console.log('AB路径搜索结果', res)
          this.pathList = res.data.index_result;
        }).catch(err => {
          // loading.close();
          this.$message.error('错误：' + err)
        })
      },
      pathListClick(item) {//AB路径搜索列表点击

        if(this.abState == 'start') {
          this.startVal = item.name;
          this.startId = item.id;
          if(this.endId) {
            this.AbSearch();
          }
        };
        if(this.abState == 'end') {
          this.endVal = item.name;
          this.endId = item.id;
          if(this.startId) {
            this.AbSearch();
          }
        };
        this.isShowPath = false;
        this.pathList = [];

      },
      // AB路径搜索
      AbSearch() {
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.AbPath({
          a_id: this.startId,
          b_id: this.endId
        }).then(res => {
          loading.close();
          console.log('AB搜索', res)
          if(res.data.entity.length == 0) {
            this.$message.error('暂无符合条件数据')
            this.nodes = [];
            this.edges = [];
            this.initVis();
            return
          }
          this.nodes = res.data.entity_label;
          this.nodes.forEach(item => {
            item.label = item.name
          })
          this.edges = res.data.entity_relation;
          this.edges.forEach(item => {
            if(item.fx == '单向') {item.arrows = "to"}
            if(item.fx == '双向') {item.arrows = "to, from"}
            if(item.fx == '无向') {item.arrows = ""}
            item.label = item.name;
          })
          this.initVis();
        }).catch(err => {
          loading.close();
          console.log('AB路径', res)
          this.$message.error('错误：' + err)
        })
      },
      dataTrace() {//数据追踪
        this.drawer = true;
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.dataTrace({
          id: this.id
        }).then(res => {
          console.log('数据追踪', res)
          loading.close()
          this.activities = res.data.route_info;
          console.log(this.activities)
        }).catch(err => {
          loading.close()
          this.$message.error('数据追踪错误' + err)
        })
      },
      // 实体标签点击
      stLabelClick(name, index) {
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.stLableClick({
          id: this.id,
          search: index == 0 ? '' : name,
        }).then(res => {
          loading.close()
          console.log('实体标签点击搜索', res)
          this.nodes = res.data.entity_label;
          this.nodes.forEach(item => {
            item.label = item.name
          })
          this.edges = [];
          this.initVis();
        }).catch(err => {
          loading.close()
          this.$message.error('错误' + err)
        })
      },
      // 关系类型点击
      gxTypeClick(name, index) {
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if(index == 0) {
          this.nodes = JSON.parse(this.nodesBackup);
          this.edges = JSON.parse(this.edgesBackup);
          this.initVis();
          loading.close()
          return;
        }
        this.$api.gxTypeClick({
          id: this.id,
          search: name
        }).then(res => {
          loading.close()
          console.log('关系类型点击搜索', res)
          if(res.data.entity.length == 0) {
            this.$message.error('暂无符合条件数据')
            this.nodes = [];
            this.edges = [];
            this.initVis();
            return
          }
          this.nodes = res.data.entity;
          this.nodes.forEach(item => {
            item.label = item.name
          })
          this.edges = res.data.sanyuanzu;
          this.edges.forEach(item => {
            if(item.fx == '单向') {item.arrows = "to"}
            if(item.fx == '双向') {item.arrows = "to, from"}
            if(item.fx == '无向') {item.arrows = ""}
            item.label = item.name;
          })
          this.initVis();
        }).catch(err => {
          loading.close()
          this.$message.error('错误' + err)
        })
      },
      // 左侧点击图谱
      handleTp() {
        this.curType = 0;
        this.isShowPath = false; //AB路径搜索列表隐藏
        this.pathList = [];
        this.startVal = '';
        this.endVal = '';
      },
      // 左侧点击路径
      handleLj() {
        this.curType = 1;
        this.searchVal = '';
        this.isShowSearchList = false; //知识图谱 搜索列表隐藏
        this.searchList = [];
      },
      // 添加数据
      navto() {
        this.$store.commit('changeZstpStatus', false);
        this.$router.push({
          path: '/zstpAdd',
          query: {
            id: this.id,
            kg_name: this.kg_name,
            model_name: this.model_name,
            kg_decribe: this.kg_decribe,
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .editBox {
    width: 100%;
    height: 100%;
    .sjzz {
      right: 10px;
      top: 10px;
    }
    .tjsj {
      right: 10px;
      top: 40px;
    }
    #mynetwork {
      width: 100%;
      height: calc(100% - 80px);
    }
    .networkInfo {
      width: 100%;
      height: 80px;
      border-radius: 5px;
    }

    .leftBox {
      top: 0;
      left: 0;
      width: 300px;
      height: 350px;
      border-radius: 4px;
      .tabBox {
        p {
          i {font-size: 20px; color: #64dd7e;}
        }
        p.active {color: #ffb341;}
      }

      .searchBox {
        border-radius: 3px;
        .el-select {
          width: 100px;
          /deep/ .el-input__inner {border: none;}
        }
        .el-input {
          width: 180px;
          /deep/ .el-input__inner {border: none;}
        }

        // 实时列表
        .relaTimeList {
          left: 0px;
          top: 42px;
          width: 100%;
          height: 325px;
          z-index: 9;
          .item {
            line-height: 32px;
          }
          .item:hover {background: #f7f7f7;}
        }
      }


    }

    .tabBox {
      span {padding: 4px 6px; border-radius: 7px; margin: 5px 0 0 10px;}
    }

    // AB路径中样式
    .abPath {
      /deep/ .el-timeline {
        .el-timeline-item__timestamp.is-top {margin-bottom: 0;}
        .el-input__inner {
          border: none;
          border-bottom: 1px solid #DCDFE6;
          border-radius: 0;
        }
        .el-timeline-item__tail {
          border: 1px dashed #E4E7ED;
        }
      }

      .abList {
        width: 232px;
        height: 230px;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.12);
        p {
          line-height: 30px;
        }
        p:last-child {
          border: none;
        }
      }
    }
    // 点击实体/关系后飘窗
    .infoData {
      width: 200px;
      height: 300px;
      border-radius: 5px;
      box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.12);
    }
  }
</style>
