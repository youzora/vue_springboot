<template>
	<section class="app-container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" @submit.native.prevent>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
        <el-form-item>
					<el-input v-model="filters.stuNo" placeholder="学号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120">
			</el-table-column>
      <el-table-column prop="stuNo" label="学号" min-width="100">
			</el-table-column>
      <el-table-column prop="grade" label="年级" min-width="100">
			</el-table-column>
      <el-table-column prop="squad" label="班级" min-width="100">
			</el-table-column>
      <el-table-column prop="courseName" label="课程名称" min-width="100">
			</el-table-column>
      <el-table-column prop="teacher" label="教师" min-width="100">
			</el-table-column>
      <el-table-column prop="usualScore" label="平时分" min-width="30">
			</el-table-column>
      <el-table-column prop="finalScore" label="期末分" min-width="30">
			</el-table-column>
      <el-table-column prop="totalScore" label="总成绩" min-width="30">
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination :current-page="page"
            :page-sizes="[10]"
            layout="prev, pager, next,sizes,jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名"  prop="name">
					<el-input v-model="editForm.name" :disabled="true" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="学号">
					<el-input type="number" v-model="editForm.stuNo" :disabled="true" :min="0" :max="200"></el-input>
				</el-form-item>
        <el-form-item label="课程名称">
        <el-select
          v-model="editForm.courseName"
          placeholder="选择课程"
          clearable
          filterable
          style="width: 170px" @change="$forceUpdate()"
          :disabled="true"
        >
          <el-option
            v-for="item in proOptions"
            :key="item.id"
            :label="item.name"
            :value="item.courseCode"
          >
          </el-option>
       </el-select>
      </el-form-item>
      <el-form-item label="平时分">
					<el-input type="number" v-model="editForm.usualScore"  :min="0" :max="100"></el-input>
			</el-form-item>
      <el-form-item label="期末分">
					<el-input type="number" v-model="editForm.finalScore"  :min="0" :max="100"></el-input>
			</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="dialogFormVisible=false">取消</el-button>
			  <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
			</div>
		</el-dialog> -->
    <!--新增界面-->
		<!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="学号">
					<el-input type="number" v-model="editForm.stuNo" :min="0" :max="200"></el-input>
				</el-form-item>
        <el-form-item label="课程名称">
        <el-select
          v-model="editForm.courseId"
          placeholder="选择课程"
          clearable
          filterable
          style="width: 170px" @change="$forceUpdate()"
        >
          <el-option
            v-for="item in proOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
       </el-select>
      </el-form-item>
      <el-form-item label="平时分">
					<el-input type="number" v-model="editForm.usualScore"  :min="0" :max="100"></el-input>
			</el-form-item>
      <el-form-item label="期末分">
					<el-input type="number" v-model="editForm.finalScore"  :min="0" :max="100"></el-input>
			</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="dialogAddFormVisible=false">取消</el-button>
			  <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
			</div>
		</el-dialog> -->
	</section>
</template>

<script>
import util from '@/utils/table.js'
import {
  getUserListPage
} from '@/api/score'

export default {
  data() {
    return {
      selectlevel:0,
      proOptions: [],
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      dialogFormVisible: false,
      dialogAddFormVisible: false,
      filters: {
        name: '',
        stuNo:''
      },
      users: [],
      total: 0,
      size: 10,
      page: 1,
      sels: [], // 列表选中列
      editFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        id: '0',
        name: '',
        courseId:'0',
        stuNo:0,
        usualScore:'',
        finalScore:''
      },
      addFormVisible: false, // 新增界面是否显示
      addFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 性别显示转换
    formatSex: function(row, column) {
      return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知'
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange (size) {
      this.pagesize = size;
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    },
    // 获取用户列表
    getUsers() {
      const para = {
        page: this.page,
        size: this.size,
        name: this.filters.name,
        address: this.filters.address,
        stuNo: this.filters.stuNo
      }
      getUserListPage(para).then(res => {
        this.total = res.data.total
        this.users = res.data.records
      })
    },
    // 删除
    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { id: row.id }
          deleteScore(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
          })
        })
        .catch(() => {})
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 显示新增界面
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogAddFormVisible = true
      this.editForm = {
        id: '0',
        name: '',
        courseCode: '',
        stuNo:'',
        usualScore:'',
        finalScore:''
      }
    },
    // 编辑
    updateData() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.editForm)
              // para.birth =
              //   !para.birth || para.birth === ''
              //     ? ''
              //     : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')
              editScore(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.dialogFormVisible = false
                this.getUsers()
              })
            })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
    // 新增
    createData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              this.editForm.id = (parseInt(Math.random() * 100)).toString() // mock a id
              const para = Object.assign({}, this.editForm)
              console.log(para)
              entry(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.dialogAddFormVisible = false
                this.getUsers()
              })
            })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
    // 全选单选多选
    selsChange(sels) {
      this.sels = sels
    },
    // 批量删除
    batchRemove() {
      var ids = this.sels.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { ids: ids }
          batchRemoveScore(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
          })
        })
        .catch(() => {})
    },
    getproKey() {
      this.loading = true;
      getProcessSelectList().then((response) => {
          this.proOptions = response.data;
          //console.log(this.proOptions);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  mounted() {
    // this.getUsers(),
    // this.getproKey()
  }
}
</script>

<style scoped>

</style>