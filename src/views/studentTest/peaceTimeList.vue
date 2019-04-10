<template>
	<div>
		<navT />
		<div class="myT">
		<div style="line-height: 60px;font-size: 18px;color: #75bdfe;">
			<img src="../../assets/img/icon_25.png" class="imgM"/>&nbsp;&nbsp;我的考试
			<span @click="goBack" style="float: right;cursor: pointer;"><img src="../../assets/img/goback.png" class="imgO"/>返回首页</span>
		</div>
		<el-table :data="users"
                  stripe
                  style="width: 100%;margin-bottom: 30px;"
                  :header-cell-style="{background:'#68b6fe'}"
                 >
           <el-table-column width="40">
           </el-table-column> 
           <el-table-column label="测试范围" prop="courseName">
           		
           </el-table-column>
           <el-table-column label="操作" width="200">
             <template slot-scope="scope">               
               <button class="myB" @click="startP(scope.row.courseId)">开始测验</button>
            </template>              
           </el-table-column>
        </el-table>
        <!--分页begin-->
        <!--<el-pagination class="pageI"
                       :current-page="filter.pageIndex"
                       :page-sizes="[5, 10, 20, 50]"
                       :page-size="filter.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total_rows"
                       @size-change="pageSizeChange"
                       @current-change="pageCurrentChange">
        </el-pagination>-->
        <!--分页end-->
        </div>
	</div>
</template>

<script>
import navT from '../common/nav/index'
import { getCourse } from '@/api/manage'
import { getPeaceTimeTest } from '@/api/student'
export default {
	data(){
		return{
			users:[],
			filter:{
              pageSize: 100, // 页大小
              pageIndex: 1, // 当前页
              courseType:1
          }
		}
	},
	components:{
		navT
	},
	 mounted: function() {
      this.getCS();
  },
	 methods: {
	 getCS(){
	 	this.users = [];
  		getCourse(this.filter).then((response) => {
            this.users = response.data.rows;
            this.users.push({
            	courseId:0,
            	courseName:'混合单元测试'
            })
           })
          .catch((response)=> {
          });
  	},
  	startP(id){
    	let arr=[];
    	let name='';
    	if(id==0){
    		for(let i in this.users){
    			arr[i]=this.users[i].courseId;
    			name="混合单元测试"
    		}
    	}else{
    		arr[0]=id;
    		for(let i in this.users){
    			if(this.users[i].courseId==id){
    				name=this.users[i].courseName;
    			}
    			
    		}
    	}
    	getPeaceTimeTest(arr).then((response) => { 
    		  let obj={};
    		  obj.endTime=1551148602707;    		  
    		  obj.testInfo={testId:1,name:name};
    		  obj.questionInfo={};
    		  obj.questionInfo.questionTypes=response.data.datas;
              localStorage.setItem("peaceTest", JSON.stringify(obj));
              let arr1=[];
				for(let i in response.data.datas){
					for(let j in response.data.datas[i].typeQuestions){
						arr1.push({
							questionId:response.data.datas[i].typeQuestions[j].questionId,
							myAnswer:null
						})
					}
				}
			  localStorage.setItem("pTest",JSON.stringify(arr1));
			  localStorage.setItem("oss",JSON.stringify(response.data.oss));
			  localStorage.setItem("endT",50*60*1000+Date.parse(new Date()));
			  this.$router.push({
  			  path:'/peaceTime',
			  name: '平时测验'
  		})
//  		  const {href} = this.$router.resolve({
//			  path:'/peaceTime',
//			  name: '平时测验'
//			  });
//			window.open(href,'_blank')
          })
          .catch((response)=> {
          });
    },
  	//返回首页
  	goBack(){
  		this.$router.push({
  			path:'/studentTest'
  		})
  	}
   },
}
</script>

<style>
	body{
		background: #f7f6f6;
		font-family: "微软雅黑";
	}
	.myT{
		width: 1020px;
		margin: 0 auto;
	}
	.el-table thead tr{
		color: white;
	}
	.el-table{
		box-shadow: 2px 2px 10px #e5f1ff;
		border-radius: 10px;
	}
	.myB{
		color: #68b6fe;
		width: 80px;
		height: 30px;
		border: none;
		cursor: pointer;
		border: 1px solid #68b6fe;
		border-radius: 5px;
		background: none;
		outline:none;
	}
	.myB:hover{
		background: #68b6fe;
		color: #ffffff;
	}
	.imgO{
			position: relative;
			top: 8px;
			left: -5px;
		}
	.imgM{
			position: relative;
			top: 5px;
		}
	.pageI{
		text-align: center;
		margin-bottom: 40px;
	}
</style>