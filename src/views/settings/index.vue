<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="user" label-width="70px">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
              <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
              <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="3" :span="4">
          <!-- 点击修改头像 方法2 label 绑定 input 的 id -->
          <label for="file">
            <el-avatar
            shape="square"
            :size="150"
            fit="cover"
            :src="user.photo"
            ></el-avatar>
          <p>点击修改头像</p>
          <!-- 点击修改头像 方法1 -->
          <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
          <input
          type="file"
          ref="file"
          id="file"
          hidden
          @change="onFileChange"
          >
          </label>
        </el-col>
      </el-row>
      <el-dialog
        title="修改头像"
        :visible.sync="dialogVisible"
        append-to-body
        width="500px">
        <img src="../layout/user-avatar.jpg" alt="" width="200px">
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user.js'
export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onFileChange () {
      console.log('change！')
      this.dialogVisible = true
      // 解决重复点击相同文件不触发 change 事件的问题
      this.$refs.file.value = ''
    }
  }
}
</script>
<style scoped lang="less"></style>
