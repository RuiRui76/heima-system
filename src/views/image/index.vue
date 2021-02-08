<template>
  <div class="image-container">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
                <el-breadcrumb-item>素材管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="action-head">
            <el-radio-group
            v-model="collect"
            size="mini"
            @change="loadImages(1)"
            >
                <el-radio-button :label="false">全部</el-radio-button>
                <el-radio-button :label="true">收藏</el-radio-button>
            </el-radio-group>
            <el-button size="mini" type="success" @click="dialogUploadVisible = true">上传素材</el-button>
        </div>
        <!-- 图片列表 -->
        <el-row :gutter="10">
            <el-col
            :xs="24"
            :sm="12"
            :md="6"
            :lg="4"
            :xl="4"
            v-for="(img, index) in images"
            :key="index"
            class="image-item"
            >
                <el-image
                    style="height: 125px"
                    :src="img.url"
                    fit="cover"
                ></el-image>
                <div class="image-action">
                  <!-- <i
                  :class="{
                    'el-icon-star-off': !img.is_collected,
                    'el-icon-star-on': img.is_collected
                  }"
                  @click="onCollect(img)"
                  ></i> -->
                  <el-button
                  :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
                  circle
                  type="info"
                  size="small"
                  @click="onCollect(img)"
                  :loading="img.loading"
                  ></el-button>
                  <el-button
                  icon="el-icon-delete"
                  circle
                  type="danger"
                  size="small"
                  @click="onDelete(img)"
                  :loading="img.loading"
                  ></el-button>
                </div>
            </el-col>
        </el-row>
        <!-- /图片列表 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          :page-size="pageSize"
          :current-page.sync="page"
          @current-change="onPageChange"
          >
        </el-pagination>
    </el-card>
    <!-- 上传素材对话框 -->
    <el-dialog
    title="上传素材"
    :visible.sync="dialogUploadVisible"
    :append-to-body="true"
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        multiple
        :headers="uploadHeaders"
        name="image"
        :on-success="onUploadSuccess"
        :show-file-list="false"
        style="text-align: center;"
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image.js'
export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      images: [],
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0, // 页码
      pageSize: 10, // 每页显示10条数据
      page: 1 // 处理高亮页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages(1)
  },
  mounted () {},
  methods: {
    loadImages (page = 1) {
      this.page = page // 处理高亮页码，重置页码为默认值 1，防止点击后页码与素材不对应情况
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        // 返回数据中无 loading 参数，手动添加loading绑定到每个图片上，单独控制各自按钮的 loading 状态
        const results = res.data.data.results
        results.forEach(img => {
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材图片列表
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onPageChange (page) {
      this.loadImages(page)
    },
    onCollect (img) {
      img.loading = true // 用户点击收藏后开启 loading 状态
      collectImage(img.id, !img.is_collected).then(res => {
        img.is_collected = !img.is_collected
        img.loading = false
        this.$message({
          type: 'success',
          message: `${img.is_collected ? '成功' : '取消'}收藏`
        })
      })
    },
    onDelete (img) {
      deleteImage(img.id).then(res => {
        img.loading = true
        // 删除之后重新加载当前页
        this.loadImages(this.page)
        img.loading = false
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
.action-head {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
}
.image-item {
  position: relative;
}
.image-action {
  height: 40px;
  background-color: rgba(204,204,204,0.5);
  position: absolute;
  bottom: 4px;
  left: 5px;
  right: 5px;
  font-size: 25px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
