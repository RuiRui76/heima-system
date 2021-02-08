<template>
  <div class="comment-container">
    <el-card class="box-card">
  <div slot="header" class="clearfix">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
    <el-table
    class="table-list"
    :data="articles"
    stripe
    style="width: 100%">
        <el-table-column
        prop="title"
        label="标题">
        </el-table-column>
        <el-table-column
        prop="total_comment_count"
        label="总评论数">
        </el-table-column>
        <el-table-column
        prop="fans_comment_count"
        label="粉丝评论数">
        </el-table-column>
        <el-table-column
        label="评论状态">
        <template slot-scope="scope">{{ scope.row.comment_status ? '正常' : '关闭' }}</template>
        </el-table-column>
        <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-switch
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="onStatusChange(scope.row)"
            :disabled="scope.row.statusDisabled"
            >
            </el-switch>
        </template>
        </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      background>
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article.js'
export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      articles: [],
      page: 1, // 激活的页码
      totalCount: 0,
      pageSize: 10 // 每页大小
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () {},
  methods: {
    handleSizeChange () {
      this.loadArticles(1)
    },
    handleCurrentChange (page) {
      this.loadArticles(page)
    },
    loadArticles (page = 1) {
      this.page = page // 从第一页开始加载数据，让组件激活的页码和请求数据的页码保持一致
      getArticles({
        page,
        per_page: this.pageSize,
        response_type: 'comment'
      }).then(res => {
        // 给每个按钮单独添加禁用属性
        const results = res.data.data.results
        results.forEach(articles => {
          articles.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      // 请求发送前开启对应文章按钮的禁用
      article.statusDisabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        article.statusDisabled = false
        this.$message({
          type: 'success',
          message: `${article.comment_status ? '开启' : '关闭'}文章评论`
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
.table-list {
    margin-bottom: 30px;
}
</style>
