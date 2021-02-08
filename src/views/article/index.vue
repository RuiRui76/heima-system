<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
   <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- /面包屑导航 -->
      </div>
    <!-- 表单 -->
    <el-form ref="form" :model="form" label-width="40px" size="mini">
    <el-form-item label="状态">
        <el-radio-group v-model="status">
        <el-radio :label="null">全部</el-radio>
        <el-radio :label="0">草稿</el-radio>
        <el-radio :label="1">待审核</el-radio>
        <el-radio :label="2">审核通过</el-radio>
        <el-radio :label="3">审核失败</el-radio>
        <el-radio :label="4">已删除</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="频道">
        <el-select v-model="channelId" placeholder="请选择频道">
        <el-option
        label="全部" :value="null"></el-option>
        <el-option
        :label="channel.name"
        :value="channel.id"
        v-for="(channel,index) in channels"
        :key="index"
        ></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="日期">
        <el-date-picker
        v-model="rangeDate"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        >
        </el-date-picker>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" :disabled="loading" @click="loadgetArticles(1)">查询</el-button>
    </el-form-item>
    </el-form>
    <!-- /表单 -->
</el-card>
<el-card class="box-card">
  <div slot="header" class="clearfix">
  根据筛选条件共查询到{{ totalCount }}条结果：
  </div>
<!-- 文章数据列表 + 底部分页 -->
    <el-table
    :data="articles"
    stripe
    border
    size="mini"
    style="width: 100%"
    class="list-table"
    v-loading="loading"
    >
    <el-table-column
      label="封面">
      <template slot-scope="scope">
        <!-- 图片显示方法2  使用提供的组件 -->
      <el-image
      style="width: 100px; height: 50px"
      :src="scope.row.cover.images[0]"
      fit="cover"
      lazy
      >
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
        <!-- 图片显示方法1 -->
        <!-- <img
          v-if="scope.row.cover.images[0]"
          :src="scope.row.cover.images[0]"
          alt=""
          class="article-cover"
        >
        <img
        v-else src="./no-cover.jpg" alt="" class="article-cover"
        > -->
      </template>
    </el-table-column>
    <el-table-column
      prop="title"
      label="标题">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
      <template slot-scope="scope">
        <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="pubdate"
      label="发布时间">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          circle
          icon="el-icon-edit"
          type="primary"
          @click="$router.push('/publish?id=' + scope.row.id)"></el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          circle
          @click="onDeleteArticle(scope.row.id)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
  background
  layout="prev, pager, next"
  :disabled="loading"
  :total="totalCount"
  :page-size="pageSzie"
  @current-change="onCurrentChange"
  :current-page.sync="page"
  />
  <!-- /文章数据列表 +底部分页 -->
</el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article.js'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [],
      articleStatus: [
        { status: '0', text: '草稿', type: 'info' },
        { status: '1', text: '待审核', type: '' },
        { status: '2', text: '审核通过', type: 'success' },
        { status: '3', text: '审核失败', type: 'warning' },
        { status: '4', text: '已删除', type: 'danger' }
      ],
      totalCount: 0,
      pageSzie: 10,
      status: null,
      channels: [],
      channelId: null,
      rangeDate: null,
      loading: true,
      page: 1
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadgetArticles()
    this.loadChannels()
  },
  mounted () {},
  methods: {
    loadgetArticles (page = 1) {
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSzie,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        this.loading = false
      })
    },
    onCurrentChange (page) {
      this.loadgetArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      this.$confirm('确定删除文章?', '文章删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功，更新文章数据列表
          this.loadgetArticles(this.page)
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
.filter-card{
  margin-bottom: 30px;
}
.list-table{
  margin-bottom: 20px;
  // .article-cover{
  //   width: 60px;
  //   background-size: cover;
  // }
}
</style>
