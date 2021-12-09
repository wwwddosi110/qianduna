<template>
    <div class="editBox p-relative">
      <div id="mynetwork"></div>
      <!-- 实体/关系  滑过展示的详细信息 -->
      <div class="networkInfo solid bg-white">
        <el-scrollbar style="height: 100%;">
          <!-- 标签 -->
          <div class="tabBox flex align-center flex-wrap padding-lr-sm" v-if="hoverBq.length > 0">
            标签：<span class="hover-pointer text-white" v-for="(item, index) in hoverBq" :key="index" :style="{background: color2[Math.floor(Math.random() * 8)]}">{{item}}</span>
          </div>
          <div class="padding-tb-xs padding-lr-sm" style="line-height: 20px;" v-if="hoverBq.length > 0">
            <span class="margin-right-sm" v-for="(item, index) in hoverSx" :key="index">{{item[0]}}：{{item[1]}}<br></span>
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
            <el-autocomplete
              class="inline-input"
              v-model="searchVal"
              :fetch-suggestions="querySearchAsync"
              placeholder=""
              @select="handleSelect"
            ></el-autocomplete>
            <i class="el-icon-search text-20 hover-pointer" @click="handleSearch" style="color: #64dd7e;"></i>

          </div>
          <!-- 标签 -->
          <el-scrollbar style="height: calc(270px - 86px);">
            <p class="text-18 padding-xs">实体标签</p>
            <div class="tabBox flex text-white flex-wrap">
              <span class="hover-pointer" v-for="(item, index) in stbq" :key="index" @click="stLabelClick(item, index)" :style="{background: stColor[index]}">{{item}}</span>
            </div>
            <p class="text-18 padding-xs">关系类型</p>
            <div class="tabBox flex text-white flex-wrap padding-bottom-sm">
              <span class="hover-pointer" v-for="(item, index) in gxbq" :key="index" @click="gxTypeClick(item, index)" :style="{background: gxColor[index]}">{{item}}</span>
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
                      <!-- <el-input v-model="startVal" @input="pathInput($event, 'start')" :clearable="true" placeholder="起点名称"></el-input> -->
                      <el-autocomplete
                        class="inline-input"
                        v-model="startVal"
                        :fetch-suggestions="abSearchAsync"
                        placeholder=""
                        @focus="ABInput('start')"
                        @select="abHandleSelect"
                      ></el-autocomplete>
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
                  <!-- <el-input v-model="endVal" @input="pathInput($event, 'end')" :clearable="true" placeholder="终点名称"></el-input> -->
                  <el-autocomplete
                    class="inline-input"
                    v-model="endVal"
                    :fetch-suggestions="abSearchAsync"
                    placeholder=""
                    @focus="ABInput('end')"
                    @select="abHandleSelect"
                  ></el-autocomplete>
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

          </div>
        </template>
      </div>
      <!-- 知识图谱   AB路径   .end-->

      <!-- AB路径   最终结果展示 -->
      <div class="abResult p-absolute bg-white padding-lr-xs" v-show="isAB">
        <el-scrollbar style="height: 100%;">
          <el-collapse v-model="activeName" accordion @change="abChange">
            <el-collapse-item v-for="(item, index) in JSON.parse(ABPathArr)" :key="index" :title="'路径' + (index + 1)" :name="index">
              <div class="text-16">路径长度：{{item.lenth}}</div>
              <div class="text-16">途径条目：</div>
              <div>
                <div class="flex padding-tb-xs" v-for="(ite, ind) in item.relations" :key="ind">
                  <!-- 路径开始左侧需要从startId开始   结尾右侧需要以endId结尾 -->
                  <!-- 0 -->
                  <template v-if="ind == 0">
                    <template v-if="ite.from_id == startId">
                      <p class="ellipse" :title="ite.from_name" style="width: 105px;">{{ite.from_name}}</p>
                      <div class="text-theme tc" style="padding: 0 5px;">
                        <p class="ellipse" :title="ite.re_name">{{ite.re_name}}</p>
                        <template v-if="ite.fx == '无向'">
                          —————
                        </template>
                        <template v-if="ite.fx == '单向'">
                          ————>
                        </template>
                        <template v-if="ite.fx == '双向'">
                          <———>
                        </template>
                      </div>
                      <p class="ellipse" style="width: 105px;" :title="ite.to_name">{{ite.to_name}}</p>
                    </template>
                    <template v-if="ite.to_id == startId">
                      <p class="ellipse" :title="ite.to_name" style="width: 105px;">{{ite.to_name}}</p>
                      <div class="text-theme tc" style="padding: 0 5px;">
                        <p class="ellipse" :title="ite.re_name">{{ite.re_name}}</p>
                        <template v-if="ite.fx == '无向'">
                          —————
                        </template>
                        <template v-if="ite.fx == '单向'">
                          <————
                        </template>
                        <template v-if="ite.fx == '双向'">
                          <———>
                        </template>
                      </div>
                      <p class="ellipse" style="width: 105px;" :title="ite.from_name">{{ite.from_name}}</p>
                    </template>
                  </template>

                  <!-- 中间 -->
                  <template v-if="ind !== 0 && ind !== item.relations.length - 1">
                    <template v-if="ite.from_name == item.relations[ind - 1].from_name || ite.from_name == item.relations[ind - 1].to_name">
                      <p class="ellipse" :title="ite.from_name" style="width: 105px;">{{ite.from_name}}</p>
                      <div class="text-theme tc" style="padding: 0 5px;">
                        <p class="ellipse" :title="ite.re_name">{{ite.re_name}}</p>
                        <template v-if="ite.fx == '无向'">
                          —————
                        </template>
                        <template v-if="ite.fx == '单向'">
                          ————>
                        </template>
                        <template v-if="ite.fx == '双向'">
                          <———>
                        </template>
                      </div>
                      <p class="ellipse" style="width: 105px;" :title="ite.to_name">{{ite.to_name}}</p>
                    </template>
                    <template v-if="ite.to_name == item.relations[ind - 1].to_name || ite.to_name == item.relations[ind - 1].from_name">
                      <p class="ellipse" :title="ite.to_name" style="width: 105px;">{{ite.to_name}}</p>
                      <div class="text-theme tc" style="padding: 0 5px;">
                        <p class="ellipse" :title="ite.re_name">{{ite.re_name}}</p>
                        <template v-if="ite.fx == '无向'">
                          —————
                        </template>
                        <template v-if="ite.fx == '单向'">
                          <————
                        </template>
                        <template v-if="ite.fx == '双向'">
                          <———>
                        </template>
                      </div>
                      <p class="ellipse" style="width: 105px;" :title="ite.from_name">{{ite.from_name}}</p>
                    </template>
                  </template>

                  <!-- length-1 -->
                  <template v-if="ind == item.relations.length - 1">
                    <template v-if="ite.from_id == endId">
                      <p class="ellipse" :title="ite.to_name" style="width: 105px;">{{ite.to_name}}</p>
                      <div class="text-theme tc" style="padding: 0 5px;">
                        <p class="ellipse" :title="ite.re_name">{{ite.re_name}}</p>
                        <template v-if="ite.fx == '无向'">
                          —————
                        </template>
                        <template v-if="ite.fx == '单向'">
                          <————
                        </template>
                        <template v-if="ite.fx == '双向'">
                          <———>
                        </template>
                      </div>
                      <p class="ellipse" style="width: 105px;" :title="ite.from_name">{{ite.from_name}}</p>
                    </template>
                    <template v-if="ite.to_id == endId">
                      <p class="ellipse" :title="ite.from_name" style="width: 105px;">{{ite.from_name}}</p>
                      <div class="text-theme tc" style="padding: 0 5px;">
                        <p class="ellipse" :title="ite.re_name">{{ite.re_name}}</p>
                        <template v-if="ite.fx == '无向'">
                          —————
                        </template>
                        <template v-if="ite.fx == '单向'">
                          ————>
                        </template>
                        <template v-if="ite.fx == '双向'">
                          <———>
                        </template>
                      </div>
                      <p class="ellipse" style="width: 105px;" :title="ite.to_name">{{ite.to_name}}</p>
                    </template>
                  </template>

                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </div>
      <!-- AB路径   最终结果展示.end -->

      <!-- 数据追踪 -->
      <p class="sjzz p-absolute hover-pointer text-20" @click="dataTrace"><i class="iconfont icon-people-network-full text-theme margin-right-xs"></i>数据追踪</p>
      <!-- 添加数据 -->
      <div class="margin-top-xl"></div>
      <p class="tjsj p-absolute hover-pointer text-20" @click="navto"><i class="iconfont icon-a-148tianjiashujufenxitianjiashujubiao text-theme margin-right-xs"></i>添加数据</p>
      <!-- 数据追踪  抽屉-->
      <el-drawer
        title="数据追踪"
        :modal="false"
        :size="300"
        :wrapperClosable="true"
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
                    {{item.tables}}（{{item.db_name}}[{{item.db_type}}]）
                  </p>
                </template>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-scrollbar>
      </el-drawer>
      <!-- 数据追踪.end -->
      <!-- 鼠标右键 展示菜单 -->
      <div class="infoData text-white p-absolute tc" v-show="isInfoShow" :style="{left: leftVal+'px', top: topVal+'px'}">
        <span class="hover-pointer margin-right-xs" @click="childNode"><i class="iconfont icon-people-network-full" style="font-size: 20px;"></i></span>
        <span class="hover-pointer" @click="hiddenNode"><i class="iconfont icon-yanjing" style="font-size: 20px;"></i></span>
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
        isInfoShow: false,//鼠标右键  展示信息框
        leftVal: 0,
        topVal: 0,
        curType: 0, //当前选中  知识图谱(0)/AB路径(1)
        radio: 1,//AB路径当前选择
        lVal: '实体',//搜索选择  实体/关系
        lSelect: [{//搜索左侧下拉选择
          value: '实体',
          label: '实体'
        }, {
          value: '关系',
          label: '关系'
        }],
        searchVal: '',//左侧搜索内容
        stColor: [],
        gxColor: [],
        color2: ['#ffcc99', '#9cc', '#c99', '#f96', '#99cc99', '#1aad82', '#ffcc00', '#fcc', '#66f', '#c66'],
        stbq: [],
        gxbq: [],
        drawer: false,//右侧数据追踪是否展示
        direction: 'rtl',//抽屉打开方式
        nodes: [],
        edges: [],
        nodesBackup: [],//后台返回实体数据
        quanbunode:[], //全部实体
        quanbuedge:[],//全部关系
        edgesBackup: [],//后台返回关系数据
        activities: [],//添加数据
        startVal: '',//AB路径开始值
        passVal: '',
        endVal: '',//AB路径结束值
        hoverBq: [],//滑过实体时 对应标签
        hoverSx: [],//滑过实体时 对应属性
        pathList: [],//搜索后的列表---------------
        startId: null,//AB路径开始值对应id
        curAB: null,//当前输入状态
        endId: null,//AB路径结束时对应id
        curNodeId: null,//当前鼠标右键选中的节点id
        timeout: null,
        activeName: 0,//AB路径结果 折叠面板当前展开
        isAB: false,
        ABPathArr: null,//AB路径搜索的所有N条路径
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
      loadData() {// 详情接口数据加载
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.detailAtlas({
          id: this.id
        }).then(res => {
          loading.close();
          // 实体 关系数据
          this.stbq = res.data.en_biaoqian;//实体标签
          this.gxbq = res.data.re_biaoqian;//关系标签
          this.stbq.unshift(`全部(${res.data.entity_total})`);
          this.gxbq.unshift(`全部(${res.data.relation_total})`);
          // 生成实体对应的不同颜色
          this.stbq.forEach((item, index) => {
            var c = this.getRandomColor();
            if(this.stColor.includes(c) || c == '#ffffff' || c.length < 7) {
              console.log(this.getRandomColor(),'12')
              this.stColor.push(this.getRandomColor())
            }else {
              this.stColor.push(c)
            }
          })
          // 生成关系对应的不同颜色
          this.gxbq.forEach((item, index) => {
            var c = this.getRandomColor();
            if(this.gxColor.includes(c) || c == '#ffffff' || c.length < 7) {
              console.log(this.getRandomColor(),'12')
              this.gxColor.push(this.getRandomColor())
            }else {
              this.gxColor.push(c)
            }
          })
          // -------------------------
          this.kg_name = res.data.kg_name;//模型名称
          this.model_name = res.data.model_name;//概念模型
          this.kg_decribe = res.data.kg_decribe;//模型描述
          // {id: 1, label: 'Node 1'}
          this.nodes = res.data.entity_label;

          this.nodes.forEach(item => {
            if(item.name.length>4){
              item.name=item.name.substring(0,4)+'..'
            }else if(item.name.length===2){
              item.name=item.name[0]+'  '+item.name[0]
            }else if(item.name.length===1){
              item.name=' '+item.name+' '
            }
            item.label = item.name;
            var ind = this.stbq.findIndex(items => {return items == item.bq[0]});
            item.color = this.stColor[ind];
          })
          console.log('全部数据',this.nodesBackup)
          this.edges = res.data.entity_relation;
          this.edges.forEach(item => {
            if(item.fx == '单向') {item.arrows = "to"}
            if(item.fx == '双向') {item.arrows = "to, from"}
            if(item.fx == '无向') {item.arrows = ""}
            // var ind = this.gxbq.findIndex(items => {return items == item.lx});
            // item.color = this.gxColor[ind];
            item.label = item.name;
          })
          this.nodesBackup = JSON.stringify(res.data.entity_label)
          this.quanbunode=JSON.stringify(res.data.entity_label);
          this.edgesBackup = JSON.stringify(res.data.entity_relation)
          this.quanbuedge=JSON.stringify(res.data.entity_relation);

          this.initVis();
        }).catch(err => {
          loading.close();
          this.$message.error('详情加载失败：' + err)
        })
      },
      initVis() {// 图谱画布初始化
        var _this = this;
        var container = document.getElementById("mynetwork");
        var data = {
              nodes: _this.nodes,
              edges: _this.edges,
            };
        var options = {
          autoResize: true,
          nodes: {
            shadow: true,
            shape: 'circle', //节点形状
            font: {
              color: '#ffffff', //
              align: 'center'
            },
            borderWidth: 0, //节点边框宽度
            size: 100, //节点大小
            chosen: {
              node: function(e) {
                e.color = '#9932CC';
              }
            }
            // chosen: false
          },
          // 设置关系连线
          edges: {
            shadow: true,
            smooth: {
             enabled: false
            },
            color: {
              color:'#000000',
              highlight:'#00BFFF',
              hover:'#FF1493',
              opacity:3.0
            },
            font: {
              color: '#FF3030', //线条上的文字颜色
              strokeWidth: 0, //文字描边
              align: 'top'
            },
          },
          interaction: {//交互
            hover: true,//hoverNode事件才能生效
              }
            };
        var network = new vis.Network(container, data, options);
        // 鼠标滑过节点
        network.on('hoverNode', function(e) {
          // console.log(e)
          var id = e.node;//当前滑过节点id
          JSON.parse(_this.nodesBackup).forEach(item => {
            //console.log('当前所指的实体集合',item.id)
            if(item.id === id) {
              _this.hoverBq = item.bq;
              _this.hoverSx = item.property
              let mingzi;
              _this.hoverSx.map((val,i)=>{
                if(val[0]==='name'){
                  mingzi=val[1];
                  _this.hoverSx.splice(i,1)
                }
              })
              _this.hoverSx.splice(0, 0, ['名称',mingzi])
            }
          })
        })
        //点击鼠标右键
        network.on("oncontext", function (e) {
          _this.isInfoShow = true;
          var nodeId = this.getNodeAt(e.pointer.DOM),
              x = e.pointer.DOM.x,
              y = e.pointer.DOM.y;
          _this.curNodeId = nodeId;
          if(nodeId) {//如果是在节点上点击鼠标右键  返回的有id
            e.event.preventDefault();//关闭浏览器自带菜单
            _this.leftVal = x;
            _this.topVal = y;
            if(x > 730) {
              _this.leftVal = x - 75
            }
          }else {
            _this.isInfoShow = false;
          }
        })
        network.on("click", function() {
          _this.isInfoShow = false;
        })
      },
      selectSwitch() {//实体/关系   下拉框切换
        this.searchVal = '';
      },
      // input带输入下拉框建议
      querySearchAsync(queryString, cb) {
        var restaurants = [];
        if(this.lVal == '实体') {
          this.$api.stSearchList({//graph/node_index_select/
            kg_name: this.kg_name,
            search: queryString,
          }).then(res => {
            console.log('实体实时搜索结果', res)
            res.data.index_result.forEach(item => {
              item.value = item.name;
              restaurants.push(item);
            })
            cb(restaurants);
          }).catch(err => {
            this.$message.error('实体候选项错误：' + err)
          })
        }
        if(this.lVal == '关系') {
          this.$api.gxSearchList({
            kg_name: this.kg_name,
            search: this.searchVal,
          }).then(res => {
            console.log('关系实时列表', res)
            res.data.re_name.forEach(item => {
              restaurants.push({value: item});
            })
            cb(restaurants);
          }).catch(err => {
            this.$message.error('关系候选项错误：' + err)
          })
        }
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {//实体/关系  点击候选项后
        if(this.lVal == '实体') {
          this.stSearch(item.id);
        }
        if(this.lVal == '关系') {
          this.gxSearch(item.value);
        }
      },
      stSearch(id) {//实体点击候选项进行搜索
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.entitySearch({
          id: id
        }).then(res => {
          loading.close();
          //console.log('实体点击候选项搜索的结果', res);
          this.nodes = res.data.index_result;
          this.nodesBackup=JSON.stringify(this.nodes)
          this.nodes.forEach(item => {
            if(item.name.length>4){
              item.name=item.name.substring(0,4)+'..'
              }else if(item.name.length===2){
                item.name=item.name[0]+'  '+item.name[0]
              }else if(item.name.length===1){
                item.name=' '+item.name+' '
              }
            item.label = item.name;
            var ind = this.stbq.findIndex(items => {return items === item.bq[0]});
            item.color = this.stColor[ind];
          })
          this.initVis();
        })
      },
      gxSearch(val) {//关系点击候选项进行搜索  或者  点击搜索icon 直接搜索
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
            if(item.name.length>4){
              item.name=item.name.substring(0,4)+'..'
            }else if(item.name.length===2){
              item.name=item.name[0]+'  '+item.name[0]
            }else if(item.name.length===1){
              item.name=' '+item.name+' '
            }
            item.label = item.name;
            var ind = this.stbq.findIndex(items => {return items == item.bq[0]});
            item.color = this.stColor[ind];
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
          loading.close();
          this.$message.error('关系搜索错误' + err)
        })
      },
      handleSearch() {//实体 /关系   直接点击搜索icon  进行搜索
        if(this.searchVal == '') return this.$message.error('请输入要搜索的内容');
        if(this.lVal == '实体') {
          const loading = this.$loading({
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$api.stSearchList({//graph/node_index_select/
            kg_name: this.kg_name,
            search: this.searchVal,
          }).then(res => {
            loading.close();
            if(res.data.index_result.length < 1) return this.$message.error('暂无符合条件的相关数据');
            this.nodes = res.data.index_result;
            this.nodes.forEach(item => {
              if(item.name.length>4){
              item.name=item.name.substring(0,4)+'..'
              }else if(item.name.length===2){
                item.name=item.name[0]+'  '+item.name[0]
              }else if(item.name.length===1){
                item.name=' '+item.name+' '
              }
              item.label = item.name;
              var ind = this.stbq.findIndex(items => {return items == item.bq[0]});
              item.color = this.stColor[ind];
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

      abSearchAsync(queryString, cb) {
        var restaurants = [];
        this.$api.stSearchList({
          kg_name: this.kg_name,
          search: queryString,
        }).then(res => {
          console.log('AB路径搜索结果', res)
          res.data.index_result.forEach(item => {
            item.value = item.name;
            restaurants.push(item);
          });
          // cb(restaurants);
          var results = queryString ? restaurants.filter(this.abcreateStateFilter(queryString)) : restaurants;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results);
          }, 2000 * Math.random());
        })
      },
      abcreateStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      abHandleSelect(item) {//AB路径点击候选项时
        if(this.curAB == 'start') {
          this.startId = item.id;
          if(this.endId) {
            this.AbSearch();
          }
        }
        if(this.curAB == 'end') {
          this.endId = item.id;
          if(this.startId) {
            this.AbSearch();
          }
        }
      },
      ABInput(e) {//当前输入路径是开始还是结尾
        if(e == 'start') {this.curAB = e}
        if(e == 'end') {this.curAB = e}
      },
      AbSearch() {// AB路径开始搜索
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.AbPath({
          kg_name: this.kg_name,
          a_id: this.startId,
          b_id: this.endId
        }).then(res => {
          this.isAB = true;
          loading.close();
          console.log('AB搜索', res)
          if(res.data.route.length == 0) {
            this.$message.error('暂无符合条件数据')
            this.nodes = [];
            this.edges = [];
            this.initVis();
            return
          }
          this.ABPathArr = JSON.stringify(res.data.route);
          this.nodes = res.data.route[0].entity;
          this.nodes.forEach(item => {
            if(item.name.length>4){
              item.name=item.name.substring(0,4)+'..'
            }else if(item.name.length===2){
              item.name=item.name[0]+'  '+item.name[0]
            }else if(item.name.length===1){
              item.name=' '+item.name+' '
            }
            item.label = item.name;
            var ind = this.stbq.findIndex(items => {return items == item.bq[0]});
            item.color = this.stColor[ind];
          })
          this.edges = res.data.route[0].relations;
          this.edges.forEach(item => {
            if(item.fx == '单向') {item.arrows = "to"}
            if(item.fx == '双向') {item.arrows = "to, from"}
            if(item.fx == '无向') {item.arrows = ""}
            item.from = item.from_id;
            item.to = item.to_id;
            item.label = item.re_name;
          })
          this.initVis();
        }).catch(err => {
          this.isAB = false;
          loading.close();
          this.$message.error('AB路径搜索错误：' + err)
        })
      },
      abChange(e) {//AB路径结果  切换
        if(e || e == 0) {
          this.nodes = JSON.parse(this.ABPathArr)[e].entity;
          this.nodes.forEach(item => {
            if(item.name.length>4){
              item.name=item.name.substring(0,4)+'..'
            }else if(item.name.length===2){
              item.name=item.name[0]+'  '+item.name[0]
            }else if(item.name.length===1){
              item.name=' '+item.name+' '
            }
            item.label = item.name;
            var ind = this.stbq.findIndex(items => {return items == item.bq[0]});
            item.color = this.stColor[ind];
          })
          this.edges = JSON.parse(this.ABPathArr)[e].relations;
          this.edges.forEach(item => {
            if(item.fx == '单向') {item.arrows = "to"}
            if(item.fx == '双向') {item.arrows = "to, from"}
            if(item.fx == '无向') {item.arrows = ""}
            item.from = item.from_id;
            item.to = item.to_id;
            item.label = item.re_name;
          })
          this.initVis();
        }
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
      stLabelClick(name, index) {// 实体标签点击
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.stLableClick({
          id: this.id,
          search: index == 0 ? '' : name,
        }).then(res => {
          if(index == 0) {
          this.nodes = JSON.parse(this.quanbunode);
          this.nodesBackup=JSON.stringify(this.nodes)
          this.edges = JSON.parse(this.quanbuedge);
          this.initVis();
          loading.close()
          return;
        }
          loading.close()
          this.nodes = res.data.entity_label;
          this.nodesBackup=JSON.stringify(this.nodes)
          this.nodes.forEach(item => {
            if(item.name.length>4){
              item.name=item.name.substring(0,4)+'..'
              }else if(item.name.length===2){
                item.name=item.name[0]+'  '+item.name[0]
              }else if(item.name.length===1){
                item.name=' '+item.name+' '
              }
            item.label = item.name;
            var ind = this.stbq.findIndex(items => {return items == item.bq[0]});
            item.color = this.stColor[ind];
          })
          this.edges = [];
          this.initVis();
        }).catch(err => {
          loading.close()
          this.$message.error('错误' + err)
        })
      },
      gxTypeClick(name, index) {// 关系类型 点击
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if(index == 0) {
          this.nodes = JSON.parse(this.quanbunode);
          this.nodesBackup=JSON.stringify(this.nodes);
          this.edges = JSON.parse(this.quanbuedge);
          console.log('关系',this.edges)
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
          this.nodesBackup=JSON.stringify(this.nodes);
          this.nodes.forEach(item => {
            if(item.name.length>4){
              item.name=item.name.substring(0,4)+'..'
            }else if(item.name.length===2){
              item.name=item.name[0]+'  '+item.name[0]
            }else if(item.name.length===1){
              item.name=' '+item.name+' '
            }
            item.label = item.name;
            var ind = this.stbq.findIndex(items => {return items == item.bq[0]});
            item.color = this.stColor[ind];
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
      handleTp() {//知识图谱/AB路径切换  点击图谱
        this.curType = 0;
        this.startVal = '';
        this.endVal = '';
        this.startId = null;
        this.endId = null;
        this.isAB = false;
      },
      handleLj() {//知识图谱/AB路径切换  点击AB路径
        this.curType = 1;
        this.searchVal = '';
        this.isAB = false;
      },
      navto() {// 添加数据
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
      },
      childNode() {//加载子节点
        this.isInfoShow = false;
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.loadChildNode({
          id: this.curNodeId
        }).then(res => {
          loading.close();
          if(res.data.flag == 'yes') {
            var i = 0;
            this.nodesBackup=JSON.stringify(res.data.entity)
            res.data.entity.forEach(item =>{
              if(item.name.length>4){
              item.name=item.name.substring(0,4)+'..'
              }else if(item.name.length===2){
                item.name=item.name[0]+'  '+item.name[0]
              }else if(item.name.length===1){
                item.name=' '+item.name+' '
              }
              item.label = item.name
              var isHas = this.nodes.find(items => {return items.id == item.id})
              console.log(isHas)
              if(!isHas) {
                this.nodes.push(item);
              }else {
                i++;
              }
            })
            res.data.link.forEach(item => {
              if(item.fx == '单向') {item.arrows = "to"}
              if(item.fx == '双向') {item.arrows = "to, from"}
              if(item.fx == '无向') {item.arrows = ""}
              item.label = item.re_name;
              this.edges.push(item)
            })
            if(i != res.data.entity.length) {
              this.initVis();
            }
          }
        }).catch(err => {
          loading.close();
          this.$message.error('子节点加载失败：' + err)
        })
      },
      hiddenNode() {//隐藏节点
        this.isInfoShow = false;
        this.nodes.forEach(item => {
          if(item.id == this.curNodeId) {
            item.hidden = true;
          }
        })
        this.initVis();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .editBox {
    width: 100%;
    height: 100%;
    .sjzz {
      right: 20px;
      top: 10px;
    }
    .tjsj {
      right: 20px;
      top: 50px;
    }
    #mynetwork {
      width: 100%;
      height: calc(100% - 70px);
    }
    .networkInfo {
      width: 60%;
      height: 70px;
      border-radius: 5px;
      margin-left: 300px;
      box-shadow: 0 5px 0 0 #ff4500;
      border-color:	#9400D3;
    }

    .leftBox {
      top: 0;
      left: 0;
      width: 300px;
      height: 270px;
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
        /deep/ .el-input__inner {border: none;}

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

    .abResult {
      left: 0;
      top: 270px;
      width: 300px;
      height: calc(100% - 270px);
      /deep/ .el-collapse-item__header {font-size: 16px; font-weight: bold;}
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
      width: 75px;
      padding: 8px;
      background: rgba(0,0,0,0.8);
      border-radius: 3px;
    }
  }
</style>
