<template>
    <div>
      <div class="topBox bg-white padding-lr-lg padding-tb-xs">
        <!-- 顶部 input + select -->
        <div class="flex text-16 padding-tb-sm">
          <div class="flex flex-sub align-center" v-show="mxzt === '首次创建'">
            <p>模型名称：</p>
            <el-input v-model="mxmc" :readonly="isEdit" placeholder="请输入模型名称"></el-input>
          </div>
          <div class="flex flex-sub align-center">
            <p :class="(mxzt === '首次创建' ? 'margin-left' : '')">模型版本：</p>
            <el-input v-model="mxbb" oninput="value=value.replace(/[^0-9.]/g,'')" :maxlength="4" :readonly="isEdit" placeholder="请输入模型版本"></el-input>
          </div>
          <div class="flex flex-sub align-center">
            <p class="margin-left">模型状态：</p>
            <el-select v-model="mxzt" disabled placeholder="请选择模型状态">
              <el-option
                v-for="item in mxztArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="flex text-16 padding-tb-sm">
          <div class="flex flex-sub align-center">
            <p>业务类型：</p>
            <el-input v-model="ywlx" :disabled="isEdit" placeholder="请填写业务类型">
            </el-input>
          </div>
          <div class="flex flex-sub align-center">
            <p class="margin-left-sm">所属自然资源要素：</p>
            <el-input v-model="zyys" :disabled="isEdit" allow-create filterable placeholder="请填写自然资源要素">
            </el-input>
          </div>
        </div>
        <div class="flex text-16 padding-tb-sm">
          <div class="flex flex-sub align-center margin-right">
            <p>模型描述：</p>
            <el-input v-model="mxms" :readonly="isEdit" placeholder="请输入模型的基本描述信息" maxlength="100" show-word-limit></el-input>
          </div>
          <el-button type="primary" v-if="isEdit" @click="handleEdit">编辑</el-button>
        </div>
      </div>
      <!-- 顶部 .end   ////////////////////////////////////////////////////////// -->

      <div class="flex padding-top-sm">
        <!--左侧  实体模型画布 -->
        <div class="visBox bg-white p-relative flex-sub solid">
          <div class="p-absolute bg-white" v-if="isEdit" style="width: 100%; height: 40px; top: 1px; left: 0; z-index: 99;"></div>
          <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
          <el-button v-show="isSelectedEdge" @click="handleEditEdge" type="text" size="mini">编辑关系</el-button>
          <div id="mynetwork" style="width: 100%; height: 656px;background: #333333"></div>
        </div>
        <!-- 图谱画布.end   ////////////////////////////////////////////////// -->
        <!-- 右侧展现的实体/关系 -->
        <div class="rightBox bg-white padding-sm margin-left-sm">
          <el-scrollbar
            style="height: 100%;">
            <!-- 实体 -->
            <template v-if="!isSelectedEdge && selectedStatus === 'st'">
              <p class="titBox text-18">实体</p>
              <div class="padding-top-sm"></div>
              <!-- 标签 -->
              <div class="flex align-center padding-tb-xs">
                <p class="text-16"><i class="text-red">*</i> 名称：</p>
                <el-input :value="newNode[curNodeInd].name" :readonly="true" style="width: 260px;"></el-input>
              </div>
              <div class="flex align-center padding-tb-xs" v-for="(item, index) in newNode[curNodeInd].bqArr" :key="index">
                <p class="text-16"><i class="text-red">*</i> 标签：</p>
                <el-input :value="item.bq" :readonly="true" style="width: 260px;"></el-input>
              </div>
              <div class="padding-top-sm"></div>
              <!-- 实体  属性映射 -->
              <p class="titBox text-18">属性映射</p>
              <div class="padding-top-sm"></div>
              <div class="sxysBox flex padding-tb-xs flex-wrap" style="box-sizing:border-box;"  v-for="(item, index) in newNode[curNodeInd].sx" :key="index+'-b'">
                <template v-if="item[0] !== 'entity_id'">
                  <div><el-input :value="item[0]" :readonly="true" style="margin-left: 20px;"></el-input></div>
                  <div><el-input :value="item[1]" :readonly="true" style="margin-left: 50px"></el-input></div>
                </template>
              </div>
            </template>

            <!-- 实体.end    ////////////////////////////////////////////////////////////-->

            <!-- 关系 -->
            <template  v-else-if="isSelectedEdge && selectedStatus === 'gx'">
              <p class="titBox text-18">关系</p>
              <div class="padding-top-sm"></div>
              <div class="flex align-center padding-tb-xs">
                <p class="text-16"><i class="text-red">*</i> 方向：</p>
                <el-input :value="newEdge[curEdge].fx" :readonly="true" style="width: 260px;"></el-input>
              </div>
              <div class="flex align-center padding-tb-xs">
                <p class="text-16"><i class="text-red">*</i> 类型：</p>
                <el-input :value="newEdge[curEdge].lx" :readonly="true" style="width: 260px;"></el-input>
              </div>
              <div class="padding-top-sm"></div>
              <!-- 关系   属性映射 -->
              <p class="titBox text-18">属性映射</p>
              <div class="padding-top-sm"></div>
              <div class="sxysBox flex padding-tb-xs flex-wrap" v-for="(item, index) in newEdge[curEdge].sx" :key="index+'-c'">
                <div><el-input :value="item[0]" :readonly="true" style="margin-left: 40px"></el-input></div>
                <div class="margin-lr-xs"><el-input :value="item[1]" :readonly="true" style="margin-left: 30px"></el-input></div>
              </div>
              <div class="padding-top-sm"></div>
              <!-- 关系映射 -->
              <p class="titBox text-18">关系映射</p>
              <div class="padding-top-sm"></div>
              <div class="flex align-center">
                 <p class="text-16" style="position: relative;left: 20px"> 实体1：</p>
                 <el-input v-model="newEdge[curEdge].entity1[0]" placeholder="请输入实体名称" style="width:300px;position: relative;left: 30px"></el-input>
              </div>
              <div class="padding-top-sm"></div>
              <div><el-input v-model="newEdge[curEdge].entity1[1]"  placeholder="请输入关系表字段名称" style="width:300px;position: relative;left: 87px"></el-input></div>

              <div class="padding-top-sm"></div>
              <div class="flex align-center">
                 <p class="text-16" style="position: relative;left: 20px"> 实体2：</p>
                 <el-input v-model="newEdge[curEdge].entity2[0]" placeholder="请输入实体名称" style="width:300px;position: relative;left: 30px"></el-input>
              </div>
              <div class="padding-top-sm"></div>
              <div><el-input v-model="newEdge[curEdge].entity2[1]"  placeholder="请输入关系表字段名称" style="width:300px;position: relative;left: 87px"></el-input></div>
            </template>
            <!-- 关系.end     ///////////////////////////////////////////////////////////////// -->
            <template v-else>
              <el-empty description="暂无选中数据~"></el-empty>
            </template>
          </el-scrollbar>
        </div>
      </div>

      <!-- 添加实体  弹窗 信息 -->
      <el-dialog
        :title="stTit"
        :visible.sync="stDialog"
        :show-close="false"
        :close-on-click-modal="false"
        width="30%">
        <div class="dialogBox" style="height: 400px;">
          <el-scrollbar
            style="height: 100%;">
            <!-- 实体 -->
              <div class="flex align-center padding-tb-xs">
                <p class="text-16"><i class="text-red">*</i> 名称：</p>
                <el-input v-model="stName" placeholder="请填写实体名称" style="width: 315px;"></el-input>
              </div>
              <!-- 标签 -->
              <div class="flex align-center padding-tb-xs" v-for="(ite, index) in bqArr" :key="index+'-a'">
                <p class="text-16"><i class="text-red">*</i> 标签：</p>
                <el-input v-model="ite.bq" allow-create filterable placeholder="请填写实体标签" style="margin-right: 20px;width:200px">
                </el-input>
                <el-button v-if="index == 0" type="primary" plain @click="addLabel">+添加</el-button>
                <el-button v-else type="text" size="small" style="width: 80px;" @click="delLabel(index)">删除</el-button>
              </div>
              <div class="padding-top-sm"></div>
              <!-- 标签.end   ////////////////////////////////////////////////////////////////////// -->

              <!-- 实体  属性映射 -->
              <p class="titBox text-18">属性映射</p>
              <div class="padding-top-sm"></div>
              <div class="sxysBox flex padding-tb-sm flex-wrap" v-for="(ite, index) in stSxys" :key="index+'-b'">
                <template v-if="ite[0] != 'entity_id'">
                  <div class="flex align-center"><i class="text-red" style="margin-right: 10px;margin-left: 20px;">* </i> <el-input v-model="ite[0]" placeholder="请输入" :readonly="index < 2 ? true : false"> </el-input></div>
                  <div class="flex align-center" style="margin-left: 20px;"><el-input v-model="ite[1]" placeholder="请填写"></el-input></div>
                  <el-button v-if="index > 1" type="text" size="small" style="margin-left: 10px;" @click="delStsxys(index)">删除</el-button>
                </template>
              </div>
              <div class="tc padding-tb-xs"><el-button type="primary" plain @click="addStsxys">+添加</el-button></div>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button id="cancelBtn" @click="stDialog = false">取 消</el-button>
          <el-button type="primary" id="addStbtn">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加实体.end ////////////////////////////////////-->

      <!-- 关系添加  弹窗 -->
      <el-dialog
        :title="gxTit"
        :visible.sync="gxDialog"
        :show-close="false"
        width="30%">
        <div class="dialogBox" style="height: 400px;">
          <el-scrollbar
            style="height: 100%;">
             <div class="flex align-center padding-tb-xs">
               <p class="text-16"><i class="text-red">*</i> 方向：</p>
               <el-select v-model="fx" placeholder="请选择关系方向">
                 <el-option
                   v-for="item in fxArr"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
                 </el-option>
               </el-select>
             </div>
             <div class="flex align-center padding-tb-xs">
               <p class="text-16"><i class="text-red">*</i> 类型：</p>
               <el-select v-model="lx" placeholder="请选择关系类型">
                 <el-option
                   v-for="item in lxArr"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
                 </el-option>
               </el-select>
             </div>
             <div class="padding-top-sm"></div>

             <!-- 关系   属性 -->
             <p class="titBox text-18">属性映射</p>
             <div class="padding-top-sm"></div>
             <div class="sxysBox flex padding-tb-xs flex-wrap" v-for="(ite2, index) in gxSxys" :key="index+'-c'">
               <div class="flex align-center"><i class="text-red" style="margin-right: 10px;margin-left: 40px;">* </i> <el-input v-model="ite2[0]" placeholder="请输入" :readonly="index < 1 ? true : false"></el-input></div>
               <div><el-input v-model="ite2[1]" style="margin-left: 30px;" placeholder="请填写" @input="gxnameInput($event, index)" :title="index === 0 ? '当需要通过空间分析创建时填未知' : ''"></el-input></div>
               <el-button v-if="index !== 0" type="text" size="small" style="margin-left: 40px;" @click="delGxsxys(index)">删除</el-button>
             </div>
            <div class="tc padding-tb-xs"><el-button type="primary" plain @click="addGxsxys">添加</el-button></div>
            <div class="padding-top-sm"></div>

            <!-- 关系映射 -->
            <p class="titBox text-18">关系映射</p>
            <div class="padding-top-sm"></div>
            <div class="flex align-center">
               <p class="text-16" style="position: relative;left: 20px"> 实体1：</p>
               <el-input v-model="entity1[0]" placeholder="请输入实体名称" style="width:300px;position: relative;left: 30px"></el-input>
            </div>
            <div class="padding-top-sm"></div>
            <div><el-input v-model="entity1[1]"  placeholder="请输入关系表字段名称" style="width:300px;position: relative;left: 87px"></el-input></div>

            <div class="padding-top-sm"></div>
            <div class="flex align-center">
               <p class="text-16" style="position: relative;left: 20px"> 实体2：</p>
               <el-input v-model="entity2[0]" placeholder="请输入实体名称" style="width:300px;position: relative;left: 30px"></el-input>
            </div>
            <div class="padding-top-sm"></div>
            <div><el-input v-model="entity2[1]"  placeholder="请输入关系表字段名称" style="width:300px;position: relative;left: 87px"></el-input></div>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button id="cancelEdge" @click="gxDialog = false">取 消</el-button>
          <el-button type="primary" id="sureEdge">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 关系添加.end  -->
    </div>
</template>
<script>
  export default {
    data() {
      return {
        curId: null, //编辑时当前模型id
        isEdit: false, //是否可编辑
        stTit: '添加实体',
        stDialog: false,//添加实体 信息弹窗
        gxTit: '添加关系',
        gxDialog:false,//添加关系 信息弹窗
        isSelectedEdge: false,//编辑关系 按钮显示隐藏  如果画布上点击了关系线条显示
        //stOrgx: true,//画布右侧展示实体/关系 信息
        mxmc: '',//模型名称
        mxbb: '',//模型版本
        entity1:['',''], // 实体1：[实体名称、数据表名称、关系表名称]
        entity2:['',''], // 实体2：[实体名称、数据表名称、关系表名称]

        mxzt: '首次创建',//模型状态
        mxztArr: [//模型状态   选项
          {value: '修改', label: '修改'},
          {value: '首次创建', label: '首次创建'},
          {value: '查看', label: '查看'},
        ],
        ywlx: '',//业务类型
        ywlxArr: [//业务类型   选项
          {value: '土地报批', label: '土地报批'},
          {value: '用地预审', label: '用地预审'},
          {value: '土地供应', label: '土地供应'},
          {value: '地籍登记', label: '地籍登记'},
        ],
        zyys: '',//所属自然资源要素
        mxms: '',//模型描述
        stName: '',//实体名称
        bqArr: [{bq: ''}],//标签 (v-model不能直接绑定到v-for迭代别名所以需要加一层{bq: ''})
        stSxys: [//属性映射（实体）   + 新增项
          ['name',''],
          ['唯一标识码', '']
        ],
        gxSxys: [//属性映射（关系）  +  新增项
          ['name','']
        ],
        fx: '',//方向
        fxArr: [//方向   选项
          {value: '无向', label: '无向'},
          {value: '单向', label: '单向'},
          {value: '双向', label: '双向'},
        ],
        lx: '',//类型
        lxArr: [//类型   选项
          {value: '业务', label: '业务'},
          {value: '空间', label: '空间'},
          {value: '时间', label: '时间'},
          {value: '权属', label: '权属'},
          {value: '属性', label: '属性'},
        ],
        newNode: [],//把新加的节点信息添加到一个数组中
        newEdge: [],//节点关系数组
        curEdgeid: '',// 当前画布点击的关系线的id
        curEdge: '',//当前画布点击的关系线  在newEdge中的索引
        curNodeInd: '',// 当前画布点击的实体在newNode中的索引
        nodes: [],
        edges: new vis.DataSet([]),
        selectedStatus: '',//用来判断右侧信息展示实体还是关系
      }
    },
    created() {
      var status = this.$route.query.status;
      if(status === 'first') this.mxzt = '首次创建';
      if(this.$route.query.id) this.curId = this.$route.query.id;
      if(status === 'detail') {
        this.mxzt = '查看';
        this.isEdit = true;
        this.loadData();
      }
    },
    mounted() {
      // vis画布
      this.initVis();
    },
    methods: {
      initVis() {
        var _this = this;
        var container = document.getElementById('mynetwork');
        var data = { nodes: _this.nodes, edges: _this.edges };
        var locales = {
            en: {
              edit: '编辑',
              del: '删除选中',
              back: '后退',
              addNode: '添加实体',
              addEdge: '添加关系',
              editNode: '编辑实体',
              editEdge: '编辑关系',
              addDescription: '单击一个空白区域以放置一个新实体。',
              edgeDescription: '单击一个实体并拖拽到另一个实体以连接它们。',
              editEdgeDescription: '单击控制点并将它们拖到实体以连接到它。',
              createEdgeError: '无法将边连接到集群。',
              deleteClusterError: '无法删除集群。',
              editClusterError: '无法编辑群集',
            }
        };
        var options = {
          nodes: {
            shape: 'circle', //节点形状
            margin: 10,
            color:{
              background:'#EEEE00',
              hover: {//节点鼠标滑过时状态颜色
                  background: '#EE7942'
              }
            },
            font: {
              color: '#FF3030', //
              size: 40,
            },
            borderWidth: 0, //节点边框宽度
            size: 15, //节点大小
            chosen: {
              node: function(e) {
                e.color = '#7FFF00';
              }
            }// chosen: false
          },
          // 设置关系连线
          edges: {
            shadow: true,
            length: 300,
            smooth: {
             enabled: false
            },
            color: {
              color:'#7B68EE',
              highlight:'#00BFFF',
              opacity:3.0
            },
            font: {
              size: 30,
              color: '#FF3030', //线条上的文字颜色
              strokeWidth: 0, //文字描边
              align: 'top'
            },
          },
          interaction: {//交互
            hover: true,//hoverNode事件才能生效
              },
          physics:{
            enabled: true,
            barnesHut: {
                gravitationalConstant: -4000,
                centralGravity: 0.2,
                springLength: 150,
                springConstant: 0.04,
                damping: 0.09,
                avoidOverlap: 0
            }
          },
          locales: locales,//语言设置
        	// configure: true,
        	clickToUse: false,//是否点击激活
        	manipulation:{//节点操作
        		enabled: true ,
        		initiallyActive: true,//直接编辑
        		addNode: function(data, callback) {//添加实体
              _this.stDialog = true;//打开弹窗
              _this.stTit = '添加实体';
              document.getElementById("addStbtn").onclick = function() {//弹窗点击确定
                // 判断   添加实体
                if(!_this.verifyFun('add')) return;

                data.id = _this.newNode.length;  //设置节点id  为节点数组长度
                data.label = _this.stName;  //节点lable为输入的实体名称
                callback(data);
                _this.newNode.push({id: data.id, name: data.label, bqArr: _this.bqArr, sx: _this.stSxys});//把节点信息放到 newNode
                console.log('添加的节点arr', _this.newNode);
                _this.stDialog = false;//关闭弹窗

                //创建成功后重置弹窗里面的内容及值
                _this.stName = '';
                _this.bqArr = [{bq: ''}];
                _this.stSxys = [
                  ['name',''],
                  ['唯一标识码','']
                ];
              }
              document.getElementById("cancelBtn").onclick = function() {
                // 点击取消后重置弹框内容
                _this.stName = '';
                _this.bqArr = [{bq: ''}];
                _this.stSxys = [
                  ['name',''],
                  ['唯一标识码','']
                ];
              }
            },
            editNode: function(data, callback) {
              console.log('要编辑节点：',data);
              console.log('当前画布中的节点arr', _this.newNode);
              _this.stDialog = true;
              _this.stTit = '编辑实体';
              var editId = data.id; //获取到当前要编辑节点的id
              var curIndex = _this.newNode.findIndex((item) => {return item.id === editId});//通过当前节点id获取到在 画布节点数组中索引
              // 渲染  弹窗中的内容；
              _this.stName = _this.newNode[curIndex].name;
              _this.bqArr = _this.newNode[curIndex].bqArr;
              _this.stSxys = _this.newNode[curIndex].sx;

              document.getElementById("addStbtn").onclick = function() {//弹窗点击确定
                if(!_this.verifyFun(editId)) return;
                data.id = editId;  //节点id不变
                data.label = _this.stName;  //节点lable为属性映射中name值
                // 修改 画布节点数组中  当前项信息
                _this.newNode[curIndex].name = data.label;
                _this.newNode[curIndex].bqArr = _this.bqArr;
                _this.newNode[curIndex].sx = _this.stSxys;

                _this.stDialog = false;//关闭弹窗
                callback(data);

                //编辑成功后重置弹窗里面的内容及值
                _this.stName = '';
                _this.bqArr = [{bq: ''}];
                _this.stSxys = [
                  // {bsm: 'name', type: '', text: ''},
                  // {bsm: '唯一标识码', type: '', text: ''},
                  ['name', '', ''],
                  ['唯一标识码', '', '']
                ];
              }
              document.getElementById("cancelBtn").onclick = function() {
                callback(data);
              }
            },
        		addEdge: function (data, callback) {          //
              if (data.from == data.to) {//如果添加的关系连接的都是自身
                return _this.$message.error('关系需要建立在两个实体之间');
              } else {
                  console.log('当前编辑关系',data);
                  _this.gxDialog = true;
                  _this.gxTit = '添加关系';
                  document.getElementById("sureEdge").onclick = function() {//确认编辑关系

                    if(!_this.fx) {return _this.$message.error('请选择方向')}
                    if(!_this.lx) {return _this.$message.error('请选择类型')}
                    // 关系类型为空间时  所选的两个节点都需要有空间标签
                    var fromInd = _this.newNode.findIndex((item) => {return item.id == data.from}), // 获取到from节点在node数组中的索引
                        toId = _this.newNode.findIndex((item) => {return item.id == data.to}); // 获取到to节点在node数组中的索引
                    for(var i = 0; i < _this.gxSxys.length; i++) {
                      console.log('属性映射',_this.gxSxys[i])
                      for(var k = 0; k < _this.gxSxys[i].length; k++) {
                        if(_this.gxSxys[i][k] == '') {
                          return _this.$message.error('属性映射请填写完整')
                        }
                      }
                    }
                    // 判断属性映射 值是否有重复的
                    for (var i = 0; i < _this.gxSxys.length - 1; i++) {
                      for (var j = i + 1; j < _this.gxSxys.length; j++) {
                        if (_this.gxSxys[i][0] === _this.gxSxys[j][0]) {
                          _this.$message.error('属性名重复');
                          return false;
                        }
                      }
                    }
                    for(var i = 0; i < _this.newEdge.length; i++) {
                      if(data.from == _this.newEdge[i].from && data.to == _this.newEdge[i].to) {
                        if(_this.fx == _this.newEdge[i].fx && _this.lx == _this.newEdge[i].lx && JSON.stringify(_this.gxSxys) == JSON.stringify(_this.newEdge[i].sx)) {
                          return _this.$message.error('存在相同关系')
                        }
                      }
                    }
                    // 根据方向选择  设置关系线箭头 arrows:"to, from"
                    if(_this.fx == '无向') {data.arrows = '';}
                    if(_this.fx == '单向') {data.arrows = 'to';}
                    if(_this.fx == '双向') {data.arrows = 'to,from';}

                    data.label = _this.gxSxys[0][1]; //设置关系线 上面展示的文字内容
                    //data.ids = _this.newEdge.length;//多加一个id标记  （添加关系线时自带的有id不能修改 否则会增加两条线）

                    callback(data);
                    _this.newEdge.push({id: data.id, from: data.from, to: data.to, fx: _this.fx, lx: _this.lx, sx: _this.gxSxys,entity1:_this.entity1,entity2:_this.entity2,re_name: _this.gxSxys[0][1]});//将关系线信息添加到数组中 存起来
                    console.log('新增关系arr', _this.newEdge)
                    //关闭弹窗并清空内容
                    _this.gxDialog = false;
                    _this.fx = '';
                    _this.lx = '';
                    _this.gxSxys = [['name','']];
                    _this.entity1=[];
                    _this.entity2=[];
                  }
                  //document.getElementById("cancelEdge").onclick = function() {}//点击取消后什么都不执行
              }
            },
        		deleteNode: function(data, callback) {//删除节点时需要删除newNode中对应的节点 及newEdge中节点相连的关系
              // if(_this.newNode.length == 0) return _this.$message.error('当前没有可删除的节点')   //不起作用
              var curId = data.nodes[0];//当前要删除节点的id
              var ind = _this.newNode.findIndex(item => {return item.id == curId});
              _this.newNode.splice(ind, 1);

              if(_this.newEdge.length > 0) {
                _this.newEdge.forEach((item, index) => {
                  if(item.from == curId || item.to == curId) {
                    _this.newEdge.splice(index, 1);
                  }
                })
              }
              callback(data);
              // if(_this.newNode.length == 0) {
                _this.selectedStatus = '';//删除当前选中的实体后右侧暂无选中数据
              // }
            },
        		deleteEdge: function(data, callback) {//删除关系时需要删除newEdge中对应的关系
              console.log(data)
              var id = data.edges[0];
              var ind = _this.newEdge.findIndex(item => {return item.id == id});
              _this.newEdge.splice(ind, 1);
              callback(data);
              _this.selectedStatus = '';//删除当前选中的关系后右侧暂无选中数据
            },
            editEdge: false,
        	}
        }
        var network = new vis.Network(container, data, options);

        // 通过点击事件获取到当前要编辑的关系线的id
        network.on("click", (e) => {
          // console.log(e);
          if(e.nodes.length == 0 && e.edges.length > 0) {//点击关系线时  返回的nodes数组为空  edges数组中为当前点击关系线的id（e.edges[0]）
            _this.curEdgeid = e.edges[0];
            console.log('关系测试1',_this.curEdgeid)
            _this.curEdge = _this.newEdge.findIndex(item => {return item.id == _this.curEdgeid})  //通过id获取到当前关系 在newEdge中的索引   用来渲染
            console.log('关系测试2',_this.curEdge)
            _this.isSelectedEdge = true;  //当前点击的是关系线  就展示编辑关系按钮
            _this.selectedStatus = 'gx';//用来判断右侧  信息是展示实体 还是关系
          }else if(e.nodes.length > 0 && e.edges.length >= 0){//点击了实体
            // _this.curNodeid = e.nodes[0];//获取当前点击的实体id
            console.log(_this.newNode)
            _this.curNodeInd = _this.newNode.findIndex(item => {return item.id == e.nodes[0]})  //通过id获取到当前关系 在newNode中的索引   用来渲染右侧实体信息
            // console.log('索引',_this.curNodeInd)
            _this.isSelectedEdge = false;
            _this.selectedStatus = 'st';//与isSelectedEdge 一起 用来判断右侧  信息是展示实体 还是关系
          }else {
            _this.selectedStatus = ''; //当点击空白处时  右侧不能展示空白  所以让selectedStatus=st先
            _this.isSelectedEdge = false;
          }
        });
      },
      // 编辑模型信息加载
      loadData() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$api.modelDetail({  //详情页
          id: this.curId
        }).then(res => {
          console.log('模型详情', res)
          loading.close();
          this.mxmc = res.data.Modelname;
          this.mxbb = res.data.Modelversion;
          this.ywlx = res.data.Businesstype;
          this.zyys = res.data.Resourcemeta;
          this.mxms = res.data.Modeldecribe;
          var newArr = res.data.entity_label.map(item => {//转换bqArr格式
            item.label = item.label.map(ite => {return {bq: ite}});
            return item
          });
          console.log(newArr)
          newArr.forEach(item => {
            if(item.name.length>3){
              var fe=item.name.substring(0,3)+'..'
            }else{
               var fe=item.name
            }
            this.nodes.push({id: item.id, label: fe});
            this.newNode.push({id: item.id, name: item.name, bqArr: item.label, sx: item.property})
          });

          var cEdge = [];
          res.data.entity_relation.forEach(item => {
            if(item.fx == '无向') cEdge.push({id: item.id, arrows: '', from: item.from, to: item.to, label: item.re_name, re_name: item.re_name});
            if(item.fx == '单向') cEdge.push({id: item.id, arrows: 'to', from: item.from, to: item.to, label: item.re_name, re_name: item.re_name});
            if(item.fx == '双向') cEdge.push({id: item.id, arrows: 'to, from', from: item.from, to: item.to, label: item.re_name, re_name: item.re_name});
            this.newEdge.push({id: item.id, from: item.from, to: item.to, fx: item.fx, lx: item.lx, sx: item.sx,entity1:item.entity1,entity2:item.entity2,label: item.re_name, re_name: item.re_name})
          });
          this.edges.update(cEdge);
          this.initVis()
          // _this.newNode
        })
      },
      // 保存图谱数据给后台
      handleSave() {
        console.log(!isNaN(this.mxmc))
        var _this = this;
        if(!_this.mxmc) return _this.$message.error('请填写模型名称');
        if(!isNaN(_this.mxmc)) return _this.$message.error('请填写模型不能纯数字');
        if(!_this.mxbb) return _this.$message.error('请填写模型版本');
        if(!_this.ywlx) return _this.$message.error('请选择业务类型');
        if(!_this.zyys) return _this.$message.error('请选择所属自然资源要素');
        if(!_this.mxms) return _this.$message.error('请填写模型描述');
        if(_this.newNode.length == 0) return _this.$message.error('请至少添加一个实体模型');
        //console.log(_this.newNode)
        //console.log(_this.newEdge)
        var arrstring = JSON.stringify(_this.newNode);//不改变原数组
        var entity_label = [];
        // 前端页面与后台接口同时进行   设计的数据结构不同    需要转换
        entity_label = JSON.parse(arrstring).map(item => {
          item.bqArr = item.bqArr.map(ite => {return ite.bq});  //转化为字典形式
          return item;
        });
        if(this.mxzt == '首次创建') this.firstSvae(entity_label);
        if(this.mxzt == '修改') this.editSvae(entity_label);
      },
      // 首次添加
      firstSvae(entity_label) {
        var _this = this;
        const loading = _this.$loading({
          lock: true,
          text: '保存中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        _this.$api.saveModel({//    /model_manager/create/ 提交信息
          modelinfo: {
            Modelname: _this.mxmc,
            Modelversion: _this.mxbb,
            Modelstatus: _this.mxzt,
            Businesstype: _this.ywlx,
            Resourcemeta: _this.zyys,
            Modeldecribe: _this.mxms,
          },
          model_entity: entity_label,
          entity_relation: _this.newEdge,
        }).then(res => {
          if(res.msg == '模型名称已存在！请重新输入') return this.$message.error('模型名称已存在！请重新输入');
          this.curId=res.data.noid
          this.isEdit = true;
          this.mxzt = '查看'
          loading.close();
          if(res.status == 200) {
            const loadingSuc = _this.$loading({
              lock: true,
              text: '创建成功',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });

            setTimeout(() => {
              loadingSuc.close();
            },2000)
          }
        }).catch(err => {
          loading.close();
          this.$message.error('创建失败：' + err)
        })
      },
      // 编辑后保存
      editSvae(entity_label) {
        var _this = this;
        entity_label.forEach(item => {
          item.entity_id = item.id
        })
        console.log(entity_label)
        const loading = _this.$loading({
          lock: true,
          text: '保存中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        _this.$api.editModel({//    /model_manager/edit/
          id: _this.curId,
          modelinfo: {
            Modelname: _this.mxmc,
            Modelversion: _this.mxbb,
            Modelstatus: _this.mxzt,
            Businesstype: _this.ywlx,
            Resourcemeta: _this.zyys,
            Modeldecribe: _this.mxms,
          },
          model_entity: entity_label,
          entity_relation: _this.newEdge,
        }).then(res => {
          loading.close();
          if(res.status == 200) {
            const loadingSuc = _this.$loading({
              lock: true,
              text: '编辑成功',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            setTimeout(() => {
              loadingSuc.close();
            },2000)
          }

        }).catch(err => {
          loading.close();
          this.$message.error('编辑失败：' + err)
        })
      },
      // 添加/编辑 实体时的判断
      verifyFun(param) {
        var _this = this;

        if(!_this.stName) {
          _this.$message.error('请输入实体名称');
          return false;
        }
        // 实体名称不能重复
        if(_this.newNode.length > 0) {
          for(var i = 0; i < _this.newNode.length; i++) {
            if(_this.stName == _this.newNode[i].name && param && param != _this.newNode[i].id) { //this判断
              _this.$message.error('实体名称重复，请重新输入');
              return false;
            }
          }
        }
        let isBqEmpty = _this.bqArr.every(obj => Object.keys(obj).every(i=>obj[i]));//判断实体标签有没有没选择的    false有
        if(!isBqEmpty) {//如果有
          _this.$message.error('请选择实体标签');
          return false;
        }

        // 判断标签是否有重复
        for (var i = 0; i < _this.bqArr.length - 1; i++) {
          for (var j = i + 1; j < _this.bqArr.length; j++) {
            if (_this.bqArr[i].bq === _this.bqArr[j].bq) {
              _this.$message.error('标签重复');
              return false;
            }
          }
        }

        // 判断属性映射bsm（第一个值）值是否有重复的
        for (var i = 0; i < _this.stSxys.length - 1; i++) {
          for (var j = i + 1; j < _this.stSxys.length; j++) {
            if (_this.stSxys[i][0] === _this.stSxys[j][0]) {
              _this.$message.error('属性名重复');
              return false;
            }
          }
        }
        return true;
      },
      // 在画布上点击了编辑关系
      handleEditEdge() {
        var _this = this;
        _this.gxDialog = true;
        _this.gxTit = '编辑关系';

        // 渲染关系弹框里面的值
        _this.fx = _this.newEdge[_this.curEdge].fx;
        _this.lx = _this.newEdge[_this.curEdge].lx;
        _this.gxSxys = _this.newEdge[_this.curEdge].sx;
        _this.entity1 = _this.newEdge[_this.curEdge].entity1;
        _this.entity2 = _this.newEdge[_this.curEdge].entity2;


        console.log(_this.newEdge)
        document.getElementById("sureEdge").onclick = function() {
          var fromId = _this.newEdge[_this.curEdge].from,
              toId = _this.newEdge[_this.curEdge].from;
          // 关系类型为空间时  所选的两个节点都需要有空间标签
          var fromInd = _this.newNode.findIndex((item) => {return item.id == fromId}), // 获取到from节点在node数组中的索引
              toId = _this.newNode.findIndex((item) => {return item.id == toId}); // 获取到to节点在node数组中的索引

          for(var i = 0; i < _this.gxSxys.length; i++) {
            for(var k = 0; k < _this.gxSxys[i]; k++) {
              if(_this.gxSxys[i][k] == '') {
                return _this.$message.error('属性映射请填写完整')
              }
            }
          }
          // 判断属性映射 值是否有重复的
          for (var i = 0; i < _this.gxSxys.length - 1; i++) {
            for (var j = i + 1; j < _this.gxSxys.length; j++) {
              if (_this.gxSxys[i][0] === _this.gxSxys[j][0]) {
                _this.$message.error('属性名重复');
                return false;
              }
            }
          }
          for(var i = 0; i < _this.newEdge.length; i++) {
            if(fromId == _this.newEdge[i].from && toId == _this.newEdge[i].to) {
              if(_this.fx == _this.newEdge[i].fx && _this.lx == _this.newEdge[i].lx && JSON.stringify(_this.gxSxys) == JSON.stringify(_this.newEdge[i].sx) && i != _this.curEdge) {
                return _this.$message.error('已存在相同关系')
              }
            }
          }
          // 更新关系数组里面数据
          _this.newEdge[_this.curEdge].fx = _this.fx;
          _this.newEdge[_this.curEdge].lx = _this.lx;
          _this.newEdge[_this.curEdge].re_name = _this.gxSxys[0][1];
          _this.newEdge[_this.curEdge].sx = _this.gxSxys;
          _this.newEdge[_this.curEdge].entity1 = _this.entity1;
          _this.newEdge[_this.curEdge].entity2 = _this.entity2;


          let arrows = '';
          if(_this.fx == '无向') {arrows = '';}
          if(_this.fx == '单向') {arrows = 'to';}
          if(_this.fx == '双向') {arrows = 'to,from';}

          // 更新画布中的关系
          _this.edges.update({id: _this.curEdgeid, label: _this.gxSxys[0][1], arrows: arrows});

          // 关闭弹窗并清空内容
          _this.gxDialog = false;
          _this.fx = '';
          _this.lx = '';
          _this.gxSxys = [['name','']];
          _this.entity1=[];
          _this.entity2=[];
        }
      },
      // 查看详情  点击编辑
      handleEdit() {
        this.isEdit = false;
        this.mxzt = '修改'
      },
      // 实体标签 添加
      addLabel() {
        this.bqArr.push({bq: ''})
      },
      // 实体标签 删除
      delLabel(index) {
        this.bqArr.splice(index, 1)
      },
      // 实体  属性映射 添加
      addStsxys() {
        this.stSxys.push(['', '', ''])
      },
      // 实体  属性映射 删除
      delStsxys(index) {
        this.stSxys.splice(index, 1)
      },
      gxnameInput(e, index) {//关系name输入时不能数字开头
        if(index == 0 && !isNaN(e)) {
          this.gxSxys[0][1] = '';
        }
      },
      // 关系  属性映射 添加
      addGxsxys() {
        this.gxSxys.push(['',''])
      },
      // 关系  属性映射 删除
      delGxsxys(index) {
        this.gxSxys.splice(index, 1)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .topBox {
    border-radius: 4px;
    p {white-space: nowrap;}
    .el-select {width: 100%;}
  }

  .visBox {
    position: relative;
    /deep/ .el-button {position: absolute; z-index: 9; right: 10px; top: 5px;}
    /deep/ .el-button--text {right: 80px;}
  }

  .rightBox,.dialogBox {
    width: 432px;
    height: 656px;
    .titBox {
      border-left: 4px solid #409EFF;
      padding-left: 15px;
      line-height: 20px;
    }
    .sxysBox {
      /deep/ .el-input__inner {width: 115px;}
    }
  }

  /deep/ .el-dialog {width: 452px!important;}
</style>
<style>
  /* 用来隐藏横向滚动条  这个样式不能写在局部的style scoped里面 */
  .rightBox .el-scrollbar__wrap, .dialogBox .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .rightBox .is-horizontal, .dialogBox .is-horizontal {
      display: none;
  }

  /* 画布  操作样式修改 */
  div.vis-network div.vis-edit-mode button.vis-button, div.vis-network div.vis-manipulation button.vis-button {margin-left: 5px!important;}
  div.vis-network div.vis-manipulation div.vis-separator-line {margin: 0 6px 0 6px!important;}
  div.vis-network button.vis-close {display: none!important;}
  div.vis-network div.vis-manipulation {padding-top: 6px!important; background: #EFF6FF!important; height: 32px!important;}
</style>
