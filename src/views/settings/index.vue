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
          <el-form
          ref="form"
          :model="user"
          label-width="80px"
          :rules="formrules">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
              <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
              <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onUpdateUser" :loading="updateProfileLoading">保存资料</el-button>
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
        @opened="onDialogOpened"
        @closed="onDialogClosed">
        <div class="preview-image-wrap">
          <img
          class="preview-image"
          :src="previewImage"
          ref="preview-image">
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
          type="primary"
          :loading="updatePhotoLoading"
          @click="onUpdatePhoto">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user.js'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus.js' // 用于同时更新顶部和个人设置的头像与名称
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
      dialogVisible: false,
      previewImage: '', // 头像预览
      cropper: null, // 裁切器
      updatePhotoLoading: false, // 修改头像按钮 loading 处理
      updateProfileLoading: false, // 修改资料按钮 loading 处理
      formrules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 1, max: 7, message: '名称长度必须在 1-7 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    onUpdateUser () {
      // 表单验证
      // 验证通过，提交表单，并开启 loading 等待数据响应
      this.updateProfileLoading = true
      // 解构
      const { name, intro, email } = this.user
      updateUserProfile({
        name,
        intro,
        email
      }).then(res => {
        this.$message({
          type: 'success',
          message: '资料保存成功'
        })
        this.updateProfileLoading = false
        // 资料修改，发布事件
        globalBus.$emit('update-uesr', this.user)
      })
    },
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onFileChange () {
      // 获取提交后的头像，进行预览以及裁剪操作
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      this.dialogVisible = true
      // 解决重复点击相同文件不触发 change 事件的问题
      this.$refs.file.value = ''
    },
    // 该方法下，dialog 彻底被打开，即包含 打开 动画开始 动画结束
    onDialogOpened () {
      // 图片裁切必须基于 img 进行初始化，且img必须是可见状态才能正常完成初始化
      // 获取图片 DOM 节点
      const image = this.$refs['preview-image']
      // 解决裁切不更新-方法1： 调用裁切器的 replace 方法
      // if (this.cropper) {
      //   this.cropper.replace(this.previewImage) // 替换成新的需要裁切的图片
      //   return
      // }
      // 初始图片裁切
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'none',
        cropBoxResizable: false,
        background: false,
        movable: true
        // 移动裁切器时，会触发调用 crop 方法
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    // 初始化好后，如果预览裁切的图片发生变化，裁切器默认不更新；如果需要预览图片发生变化更新裁切器：
    // 方法1：裁切器的 replace 方法
    // 方法2：销毁裁切器，重新初始化
    onDialogClosed () {
      // 解决裁切不更新-方法2： 调用裁切器的 destroy 方法，在弹出框彻底关闭的时候销毁裁切器
      this.cropper.destroy()
    },
    onUpdatePhoto () {
      this.updatePhotoLoading = true // 开启 loading
      // 获取裁切后的头像
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求更新用户头像
        updateUserPhoto(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图的头像展示
          // 直接把裁切结果的文件对象转为 blob 数据，进行本地预览，相比于从接口返回数据获取较快
          this.user.photo = window.URL.createObjectURL(file)
          // this.user.photo = res.data.data.photo
          this.updatePhotoLoading = false
          this.$message({
            type: 'success',
            message: '头像修改成功'
          })
          globalBus.$emit('update-uesr', this.user) // 头像更新后发布事件
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
