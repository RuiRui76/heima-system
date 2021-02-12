<template>
  <div class="upload-cover" @click="CoverSelect">
      <div class="cover-wrap">
          <img class="cover-image" ref="cover-image" :src="coverImage">
      </div>
      <el-dialog
        title="选择封面"
        :visible.sync="dialogVisible"
        append-to-body>
          <el-tabs v-model="activeName" type="card" >
            <el-tab-pane label="素材库" name="first">素材管理界面</el-tab-pane>
            <el-tab-pane label="手动上传" name="second">
                <input
                type="file"
                ref="file"
                @change="onFileChange">
                <img
                width="200px"
                ref="preview-image">
            </el-tab-pane>
          </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image.js'
export default {
  name: 'UploadCover',
  components: {},
  props: ['cover-image'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    CoverSelect () {
      this.dialogVisible = true
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 进行图片预览
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob
      // 防止用户选择同一图片不触发 change 事件
      // this.$refs.file.value = ''
      // 但是会导致下方点击确定上传图片时，因为被清空数值而导致的出错
    },
    onCoverConfirm () {
      // 是否是在上传图片界面，且是否存在图片
      const file = this.$refs.file.files[0]
      if (this.activeName === 'second') {
        if (!file) {
          this.$message({
            message: '请选择图片！'
          })
          return
        }
        // 执行图片上传操作
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          // 关闭弹出层
          this.dialogVisible = false
          // 展示上传图片
          this.$refs['cover-image'].src = res.data.data.url
          // 设置组件通信
          this.$emit('update-cover', res.data.data.url)
        })
      }
    }
  }
}
</script>
<style scoped lang="less">
.cover-wrap {
    width: 200px;
    height: 120px;
    border: 1px solid #000;
    .cover-image {
        height: 120px;
        max-width: 100%;
    }
}
</style>
