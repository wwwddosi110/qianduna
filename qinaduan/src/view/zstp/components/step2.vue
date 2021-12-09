<template>
  <div class="step2" v-if='isShow'>
    <!--左右框-->
    <div class="stepCon flex justify-between align-center">
      <!--左侧画布-->
      <div class="transfer leftBox solid">
        <p class="text-18">所选模型</p>
        <div class="visBox bg-white p-relative flex-sub solid" style="margin-bottom:-10px">
          <div id="mynetwork" style="width: 600px; height: 557px;background: #333333"></div>
        </div>
      </div>
      <!--右侧选择项-->
      <div class="transfer rightBox solid">
				<p class="text-18">数据映射</p>
				<el-scrollbar style="height: calc(100% - 38px);">

					<div class="flex align-center padding-tb">
						<p class="text-16 padding-lr-xs"><i class="text-red" style="margin-right: 5px">*</i>数据源</p>
						<!-- collapse-tags -->
						<el-cascader
							v-model="sjyVal"
							ref="cascader"
							@focus="handleCas"
							collapse-tags
							:show-all-levels="false"
							:clearable="true"
							style="width: 60%;"
							:props="{
								multiple: true,
								checkStrictly: true,
								expandTrigger: true
							}"
							:options="dataoption"/>
						<el-button class="datalook" type="primary" @click="yingse" style="margin-right: 5px;">确定</el-button>
					</div>
					<span class="titBox text-18" v-if="yinse === 'shuxing'">属性映射</span>
					<span class="titBox text-18" v-else>关系映射</span>
					<div class="sxysBox padding-sm" >
						<el-table
							:data="tableData"
							height="400"
							style="width: 100%">
							<el-table-column
								prop="attr"
								label="属性"
								align="center">
							</el-table-column>
							<el-table-column
								label="表名"
								align="center">
								<template slot-scope="scope">
									<div v-if="scope.row.table == ''">
										<el-select v-model="scope.row.tableVal" @change="tableSelect(scope.row)" placeholder="请选择">
										  <el-option
												v-for="item in scope.row.tableOption"
												:key="item"
												:label="item"
												:value="item">
											</el-option>
										</el-select>
									</div>
									<div v-else>{{scope.row.table}}</div>
								</template>
							</el-table-column>
							<el-table-column
								align="center"
								label="对应字段">
								<template slot-scope="scope">
									<div v-if="scope.row.field == ''">
										<el-select v-model="scope.row.fieldVal" @change="fieldSelect(scope.row)" placeholder="请选择">
										  <el-option
												v-for="item in scope.row.fieldOption"
												:key="item"
												:label="item"
												:value="item">
											</el-option>
										</el-select>
									</div>
									<div v-else>{{scope.row.field}}</div>
								</template>
							</el-table-column>
						</el-table>

						 <!--后端返回信息渲染-->
					</div>
				</el-scrollbar>
      </div>
    </div>
    <!--上一步 下一步-->
    <div class="btnBox tc padding-tb">
      <el-button type="info" @click="prevStep" :disabled="$store.state.isBack">上一步</el-button>
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      isShow:true,  //刷新
      stID:'',  //返回给后端的实体id
			sjyVal: '',
      treedata:[],  //存储树形数据
      xuanting:false,  //悬停弹窗
      xuantinginfo:'', //悬停显示信息
      nodes: [],   //节点数据
      yinse: 'shuxing',   //当鼠标点击时判断是关系映射还是实体映射
      edges:new vis.DataSet([]),    //关系数据
			newEdge: [],//存储首次加载关系点击下一步使用
      leftVal: 0,
      topVal: 0,
      tpInfo: null,//缓存的信息
      curId: null, //缓存中的模型id
      tableslect:[],  //存储选中的数据表
      dataoption:[],   //数据选项
			nodeId: null,//当前选中node节点id
			edgeId: null,//当前选中关系id
			tableData: [
				// {attr: '1', table: 'ccsa', field: '3', tableOption: ['yi', 'er'], tableVal: '', options: [], fieldOption: [], fieldVal: ''},
				// {attr: '2', table: '', field: '', tableOption: ['yi', 'er'], tableVal: '', options: [['1','2'], ['a', 'b']], fieldOption: [], fieldVal: ''},
				// {attr: '3', table: '', field: '', tableOption: ['yi2', 'er2'], tableVal: '', options: [['12','22'], ['a2', 'b2']], fieldOption: [], fieldVal: ''}
			],
			selectVal: '',//映射数据为空时下拉选项值
			allData: {model_entys:[],model_rel:[]},//点击下一步入库提交的数据
			curDatabase: '',//当前已选数据表对应的数据库地址
			curType: '',//当前已选数据表对应的数据库类型
			curName: '',//当前已选数据表对应的数据库名
			ysState: '',//存储当前映射的是实体还是关系
    }
  },
  created() {
    //console.log('缓存',this.$store.state.curStep)
    this.loadData();
    this.dataload();  //加载数据源
  },
  mounted() {
      // vis画布
      this.initVis();
  },
  methods:{
    initVis() {   //渲染数据
      var _this = this;
      var container = document.getElementById('mynetwork');
      var data = { nodes: _this.nodes, edges: _this.edges };
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
            size: 20,
          },
          borderWidth: 0, //节点边框宽度
          size: 10, //节点大小
          // chosen: false
        },
        // 设置关系连线
        edges: {
          shadow: true,
          length: 250,
          smooth: {
           enabled: false
          },
          color: {
            color:'#7B68EE',
            highlight:'#00BFFF',
            opacity:3.0
          },
          font: {
            size: 20,
            color: '#FF3030', //线条上的文字颜色
            strokeWidth: 0, //文字描边
            align: 'top'
          },
        },
        interaction: { //交互
          hover: true, //hoverNode事件才能生效
            },
        physics: {
            enabled: true,
            barnesHut: {
                gravitationalConstant: -4000,
                centralGravity: 0.3,
                springLength: 120,
                springConstant: 0.04,
                damping: 0.09,
                avoidOverlap: 0
            }
        }
      };
      var network = new vis.Network(container, data, options);
      // network.on('hoverNode', function(e) {
      //   _this.xuanting=true;
      //   _this.leftVal= e.pointer.DOM.x;
      //   _this.topVal= e.pointer.DOM.y;
      //   _this.xuantinginfo= e.node;//当前滑过节点id
      // });

			network.on('selectNode', function(e) {
				_this.nodeId = e.nodes[0];
				if(e.edges.length == 0) _this.edgeId = null;
			});

			network.on('selectEdge', function(e) {
				_this.edgeId = e.edges[0];
				if(e.nodes.length == 0) _this.nodeId = null;
			});

			network.on('click', function(e) {
				if(e.nodes.length == 0) _this.nodeId = null;
				if(e.edges.length == 0) _this.edgeId = null;
			});
    },
    loadData() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      console.log('夜空中最亮的星')
      this.tpInfo = JSON.parse(this.storage.getSession('tpInfo'));
      this.curId = this.tpInfo && this.tpInfo.model_id
      this.$api.modelDetail({  //所选模型的详情
        id: this.curId
      }).then(res => {
        loading.close();
        var newArr = res.data.entity_label.map(item => {//转换bqArr格式
          item.label = item.label.map(ite => {return {bq: ite}});
          return item
        });
        newArr.forEach(item => {
          this.nodes.push({id: item.id, label: item.name});
          //this.newNode.push({id: item.id, name: item.name, bqArr: item.label, sx: item.property})
        });
        this.newEdge = res.data.entity_relation;//存储关系
        var cEdge = [];   //关系
        res.data.entity_relation.forEach(item => {
          if(item.fx == '无向') cEdge.push({id: item.id, arrows: '', from: item.from, to: item.to, label: item.re_name, re_name: item.re_name});
          if(item.fx == '单向') cEdge.push({id: item.id, arrows: 'to', from: item.from, to: item.to, label: item.re_name, re_name: item.re_name});
          if(item.fx == '双向') cEdge.push({id: item.id, arrows: 'to, from', from: item.from, to: item.to, label: item.re_name, re_name: item.re_name});
        });
        this.edges.update(cEdge);
        this.initVis();
      })
    },
		handleCas() {//级联选择器点击时隐藏第一项复选框
			var div = document.getElementsByClassName('el-cascader-menu')[0];
			var li = div.childNodes[0].childNodes[0].childNodes;
			for(var i = 0; i<li.length; i++) {
				li[i].childNodes[0].style.display = 'none'
			}
		},
    prevStep() {
      this.$store.state.curStep=1;
      //this.$store.commit("minusStep");
    },
    dataload(){
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      //let tpio=JSON.parse(this.storage.getSession('create_state'));
      console.log('软饭王风味')
      this.$api.dbinit({}).then(res=>{
        //将返回结果填充到数据表
        res.data.db.forEach(item=>{
          let sanji=Object.keys(item.base_fileds); //获取表名
          let biaolist=[]; //表名的树节点
          for(var i in sanji){
            biaolist.push({value:sanji[i], label:sanji[i]})
          }
          this.dataoption.push({value:item.ip, label: item.ip,children:[{value:item.db_name+'('+item.db_type+')',label:item.db_name+'('+item.db_type+')',children:biaolist}]})
        });
        loading.close();
        console.log('信息')
      })
    },
    yingse(){  //调用映射接口
			console.log(this.tableData)
			for(var i = 0; i < this.tableData.length; i++) {
				if((this.tableData[i].table == '' && this.tableData[i].tableVal == '') || (this.tableData[i].field == '' && this.tableData[i].fieldVal == '')) {
					return this.$message.error('实体映射数据填写完整！')
				}
			}
			if(!this.nodeId && !this.edgeId) {
				return this.$message.error('请先选择实体或者关系！')
			}
			if(!this.sjyVal) {
				return this.$message.error('请选择数据源！')
			}
			var t = [], t2 = [];
			this.sjyVal.forEach(item => {
				t2.push(item[0])
				t.push(item[2])
			})
			const elementsAreEqual = array => array.every(el => el === array[0])

			if(this.curDatabase == '') {
				if(!elementsAreEqual(t2)) {
					return this.$message.error('只能选择一个数据库下面的表')
				}
			}else {
				for(var i = 0; i < t2.length; i++) {
					if(t2[i] != this.curDatabase) {
						return this.$message.error(`目前只能选择数据库：${this.curDatabase}下面的表`)
					}
				}
			}
			if(this.allData.model_entys) {
				var ind1 = this.allData.model_entys.findIndex(item => item.id == this.nodeId);
			}
			if(this.allData.model_rel) {
				var ind2 = this.allData.model_rel.findIndex(item => item.id == this.edgeId);
			}

			if(ind1 > -1 || ind2 > -1) {
				// 存在之前的映射过的实体/关系
				this.$confirm('所选实体/关系重复，是否覆盖之前映射数据', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '选择覆盖'
					});
				}).catch(() => {
					return this.$message.error('取消映射')
				});
			}
			var ind = this.sjyVal[0][1].indexOf('('),
					len = this.sjyVal[0][1].length;
			var params = {
				basedata: {
					db_type: this.sjyVal[0][1].substring(ind+1, len-1),
					db_name: this.sjyVal[0][1].substring(0, ind),
					db_address: this.sjyVal[0][0],
					model_entys: {
						id: '',
						table: [],
					},
					model_rel: {
						id: '',
						table: '' ,
					}
				}
			};
			if(this.nodeId && this.edgeId) {//实体跟关系id都有说明选择映射实体
				console.log('node', this.nodeId);
				params.basedata.model_entys.id = this.nodeId;
				params.basedata.model_entys.table = t;
				delete params.basedata.model_rel;//删除关系信息
        this.$api.ysst(params).then(res => {
				this.tableData = [];
        this.yinse='shuxing';
				// 映射成功后赋值当前已选择的数据库地址、名称、类型
				this.curDatabase = params.basedata.db_address;
				this.curType = params.basedata.db_type;
				this.curName = params.basedata.db_name;
				var dat = [];
				if(params.basedata.hasOwnProperty('model_entys')) {//映射实体
					this.ysState = 'st';
					dat = res.data.styingse;
				}
        //console.log('荒唐世界',res.data)
				dat.forEach(item => {
					this.tableData.push({
						attr: item[0],
						table: item[1],
						field: item[2],
						tableOption: Object.keys(res.data.entity_lose),
						tableVal: '',
						fieldOption: [],
						options: Object.values(res.data.entity_lose),
						fieldVal: '',})
				})
				// 选择实体/关系重复 并覆盖 删除之前的
				if(ind1 > -1) {//实体重复
					this.allData.model_entys.splice(ind1, 1);
				}
				// 存储
				if(params.basedata.hasOwnProperty('model_entys')) {//映射了实体
					var ind = this.nodes.findIndex(ite => ite.id == params.basedata.model_entys.id);
					this.allData.model_entys.push({id: params.basedata.model_entys.id, name: this.nodes[ind].label, label: [this.nodes[ind].label], property: res.data.styingse})
				}
			}).catch(err => {
				this.$message.error('映射三元组错误：', err)
			})
			}
			if(!this.nodeId && this.edgeId) {//只有关系id说明选择映射关系
				if(this.sjyVal.length > 1) return this.$message.error('关系映射只能选择一个数据表！')
				params.basedata.model_rel.id = this.edgeId;
				params.basedata.model_rel.table = this.sjyVal[0][2];
				delete params.basedata.model_entys;//删除实体信息
        this.$api.ysgx(params).then(res => {
        console.log('关系映射',res.data)
				this.tableData = [];
        this.yinse='guanxi';
				// 映射成功后赋值当前已选择的数据库地址、名称、类型
				this.curDatabase = params.basedata.db_address;
				this.curType = params.basedata.db_type;
				this.curName = params.basedata.db_name;
				var dat = [];
				if(params.basedata.hasOwnProperty('model_rel')) {//映射关系
					this.ysState = 'gx';
					dat = [res.data.entity1,res.data.entity2]
				}
				dat.forEach(item => {
					this.tableData.push({
						attr: item[0][0],
						table: item[0][1],
						field: item[0][2],
						tableOption: Object.keys(res.data.entity_lose),
						tableVal: '',
						fieldOption: [],
						options: Object.values(res.data.entity_lose),
						fieldVal: '',})
				})
				if(ind2 > -1) {//关系重复
					this.allData.model_rel.splice(ind2, 1);
				}
				// 存储
				if(params.basedata.hasOwnProperty('model_rel')) {//映射了关系
					var ind = this.newEdge.findIndex(ite => ite.id == params.basedata.model_rel.id);
					this.allData.model_rel.push({id: params.basedata.model_rel.id, form: this.newEdge[ind].form, re_name: this.newEdge[ind].re_name, fx: this.newEdge[ind].fx, lx: this.newEdge[ind].lx, sx: this.newEdge[ind].sx[0], entity1: dat[0], entity2: dat[1]})
				}
			}).catch(err => {
				this.$message.error('映射三元组错误：', err)
			})
			}
    },
		tableSelect(e) {//映射为空时table下拉框选择事件
			var a = e.attr;
			var ind1 = this.tableData.findIndex(item => item.attr == a),  //找到资源对应索引
					ind2 = e.tableOption.indexOf(e.tableVal);
			this.tableData[ind1].fieldVal = '';
			this.tableData[ind1].fieldOption = this.tableData[ind1].options[ind2];
		},
		fieldSelect(e) {//映射为空时 字段选择完 存储到alldata里面
			for(var i = 0; i < this.tableData.length; i++) {
				if((this.tableData[i].table == '' && this.tableData[i].tableVal == '') || (this.tableData[i].field == '' && this.tableData[i].fieldVal == '')) {
					console.log('有信息未填写完成不进行存储')
					return;
				}
			}
			var dat = [];
			this.tableData.forEach((item, index) => {
				dat[index] = [];
				dat[index].push(item.attr);
				dat[index].push(item.table || item.tableVal);
				dat[index].push(item.field || item.fieldVal);
			})

			if(this.ysState == 'st') {
				this.allData.model_entys.forEach(item => {
					if(item.id == this.nodeId) {
						item.property = dat;
					}
				})
			}
			if(this.ysState == 'gx') {
				this.allData.model_rel.forEach(item => {
					if(item.id == this.nodeId) {
						item.entity1 = dat[0];
						item.entity1 = dat[1];
					}
				})
			}
		},
		nextStep() {
			if(this.curDatabase == '') {//可通过判断当前数据库地址是有值来判断有没有映射数据
				return this.$message.error('请选择数据映射')
			}

			// 除了数据库地址不为空  还需判断当前table数据是否有空的
			for(var i = 0; i < this.tableData.length; i++) {
				if((this.tableData[i].table == '' && this.tableData[i].tableVal == '') || (this.tableData[i].field == '' && this.tableData[i].fieldVal == '')) {
					return this.$message.error('实体映射数据填写完整！')
				}
			}
      var ind = this.sjyVal[0][1].indexOf('('),
					len = this.sjyVal[0][1].length;
      let tpio=JSON.parse(this.storage.getSession('tpInfo'));
			var params = {
				kg_name: tpio.kg_name,
				model_name: tpio.kgmodel,
				kg_decribe: tpio.kg_decribe,
				basedata: {
					db_type: this.sjyVal[0][1].substring(ind+1, len-1),
					db_name: this.sjyVal[0][1].substring(0, ind),
					db_address: this.sjyVal[0][0],
				},
				model_entys: this.allData.model_entys,
				model_rel: this.allData.model_rel
			}
			const loading = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
			this.$api.rkRequest(params).then(res => {
        this.$store.state.curStep++;
        this.storage.setSession('cjInfo', JSON.stringify(res.data));
				loading.close();
			}).catch(err => {
				loading.close();
        this.$message.error('入库失败！', err)
			})
		}
  }
}
</script>

<style lang="scss" scoped>
.step2 {
  padding: 13px 20px;
  .stepCon {
    > span {
      display: inline;
      width: 70px;
      line-height: 40px;
      background: #eeeeee;
      border-radius: 4px;
    }
    .datalook{
      width: 80px;
      background: #226fee;
      height: 40px;
      margin-left: 10px;
      border-radius: 6px;
    }
    .transfer {
      background: #f9f9f9;
      height: 600px;
      > p {
        line-height: 38px;
        background: #9BCD9B;
        padding-left: 15px;
        color: #000;
      }
      .btnDiv {
        width: 130px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        border: 1px dashed #226fee;
      }
      // .sxysBox{
      //   margin-left:30px;
      //   width:500px;
      //   height: 200px;
      // }
      .tit {
        margin-top: -10px;
        border-radius: 6px;
        background: #9BCD9B;
        height:30px;
        width:100px;
        text-align: center;
        padding-top: 2px
      }
      .titBox {
        border-left: 4px solid #409EFF;
        padding-left: 15px;
        line-height: 20px;
        margin-left: 15px;
    }
    }
		.rightBox {width: calc(100% - 620px);}

  }

}

</style>
