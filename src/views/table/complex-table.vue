<template>
	<section class="app-container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" @submit.native.prevent>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
        <el-form-item>
					<el-input v-model="filters.address" placeholder="地址"></el-input>
				</el-form-item>
        <el-form-item>
					<el-input v-model="filters.stuNo" placeholder="学号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
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
			<el-table-column prop="sex" label="性别" width="120" :formatter="formatSex">
			</el-table-column>
			<el-table-column prop="age" label="年龄" width="120">
			</el-table-column>
			<el-table-column prop="address" label="地址" min-width="160">
			</el-table-column>
      <el-table-column prop="stuNo" label="学号" min-width="100">
			</el-table-column>
      <el-table-column prop="grade" label="年级" min-width="100">
			</el-table-column>
      <el-table-column prop="squad" label="班级" min-width="100">
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" @click="handleBand(scope.$index, scope.row)">绑定课程</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination :current-page="page"
            :page-sizes="[10]"
            layout="prev, pager, next,sizes,jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label=1>男</el-radio>
						<el-radio class="radio" :label=0>女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<!-- <el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item> -->
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.address"></el-input>
				</el-form-item>
        <el-form-item label="学号">
					<el-input type="number" v-model="editForm.stuNo" :min="0" :max="2000"></el-input>
				</el-form-item>
        <el-form-item label="年级">
					<el-input type="textarea" v-model="editForm.grade"></el-input>
				</el-form-item>
        <el-form-item label="班级">
					<el-input type="textarea" v-model="editForm.squad"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="dialogFormVisible=false">取消</el-button>
			  <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
			</div>
		</el-dialog>

    <!--绑定界面-->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogBandFormVisible" :close-on-click-modal="false">
			<el-form :model="bandForm" label-width="80px" ref="bandForm">
				<el-form-item label="课程代码" prop="courseCode">
					<el-input v-model="bandForm.courseCode" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="dialogBandFormVisible=false">取消</el-button>
        <el-button type="primary" @click="bandData">绑定</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import util from '@/utils/table.js'
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  bandUser,
  addUser
} from '@/api/userTable'

export default {
  data() {
    return {
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建',
        banding: '绑定'
      },
      dialogFormVisible: false,
      dialogBandFormVisible: false,
      filters: {
        name: '',
        address: '',
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
        sex: 1,
        age: 0,
        address: '',
        stuNo:0,
        grade:'',
        squad:''
      },
      // 课程界面数据
      bandForm:{
        id: '0',
        courseCode:''
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
          removeUser(para).then(res => {
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
    // 显示绑定界面
    handleBand(index, row) {
      this.dialogStatus = 'band'
      this.dialogBandFormVisible = true
      this.bandForm = Object.assign({}, row)
    },
    // 显示新增界面
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.editForm = {
        id: '0',
        name: '',
        sex: 1,
        age: 0,
        birth: '',
        addr: ''
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
              editUser(para).then(res => {
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
    // 绑定课程
    bandData() {
      this.$refs.bandForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.bandForm)
              // para.birth =
              //   !para.birth || para.birth === ''
              //     ? ''
              //     : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')
              bandUser(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['bandForm'].resetFields()
                this.dialogBandFormVisible = false
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

              para.birth =
                !para.birth || para.birth === ''
                  ? ''
                  : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')
              addUser(para).then(res => {
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
          batchRemoveUser(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
          })
        })
        .catch(() => {})
    }
  },
  mounted() {
    this.getUsers()
  }
}
</script>

<style scoped>

</style>