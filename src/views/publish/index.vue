<template>
  <div class="publish-container">
    <el-card class="box-card">
  <div slot="header" class="clearfix">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.query.id ? '修改文章':'发布文章'  }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
    <el-form
    ref="publish-form"
    :model="article"
    label-width="60px"
    :rules="formRules"
    >
    <el-form-item label="标题" prop="title">
        <el-input v-model="article.title"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
        <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
        <el-tiptap
        v-model="article.content"
        :extensions="extensions"
        lang="zh"
        height="400px"
        placeholder="请输入文章内容"
        >
        <!-- 如果组件显示不出，在标签中加入 lang 即可正常显示 -->
        </el-tiptap>
    </el-form-item>
    <el-form-item label="封面">
        <el-radio-group v-model="article.cover.type">
        <el-radio :label="1">单图</el-radio>
        <el-radio :label="3">三图</el-radio>
        <el-radio :label="0">无图</el-radio>
        <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
        <template v-if="article.cover.type > 0">
          <upload-cover
          v-for="(cover, index) in article.cover.type"
          :key="cover"
          :cover-image="article.cover.images[index]"
          @update-cover="onUpdateCover(index, $event)"/>
        </template>
    </el-form-item>
    <el-form-item label="频道" prop="channel_id">
        <el-select v-model="article.channel_id" placeholder="请选择频道">
        <el-option
        :label="channel.name"
        :value="channel.id"
        v-for="(channel,index) in channels"
        :key="index"
        ></el-option>
        </el-select>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="onPublish(false)">{{ $route.query.id ? '修改':'发布' }}</el-button>
        <el-button @click="onPublish(true)">存入草稿</el-button>
    </el-form-item>
    </el-form>
</el-card>
  </div>
</template>

<script>

import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle
} from '@/api/article.js'
import { uploadImage } from '@/api/image.js'
// import element-tiptap 样式
import 'element-tiptap/lib/index.css'
import {
  // 引入 element-tiptap
  ElementTiptap,
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image,
  TodoList,
  TodoItem,
  Fullscreen,
  HorizontalRule,
  Preview,
  CodeBlock,
  TextColor
} from 'element-tiptap'
import UploadCover from './components/upload-cover'

export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  props: {},
  data () {
    return {
    // 编辑器的 extensions
    // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              return res.data.data.url
            })
          } // 图片上传的方法，返回一个Promise<url>
        }),
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new HorizontalRule(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoList(),
        new TodoItem(),
        new Fullscreen(),
        new Preview(),
        new CodeBlock(),
        new TextColor()
      ],
      channels: null,
      article: {
        title: '',
        content: '',
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 封面图片地址
        },
        channel_id: null
      },
      // 表单验证
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '标题长度必须在 5-30 个字符', trigger: 'blur' }
        ],
        content: [
          // 无内容情况
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          // 内容清空后的情况
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        channel_id: [
          { required: true, message: '请选择频道', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannles()
    // 编辑与发布共用一个组件，判断 如果路由路径参数中有 id ，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    loadChannles () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onPublish (draft = false) {
      // 提交到服务端前进行表单验证
      this.$refs['publish-form'].validate(valid => {
        if (!valid) {
          // 表单验证失败，停止提交
        } else {
          // 根据 id 判断是修改还是新发布，进而调用不同的请求方法
          const articleId = this.$route.query.id
          if (articleId) {
            updateArticle(articleId, this.article, draft).then(res => {
              this.$message({
                message: `${draft ? '存入草稿' : '修改'}成功`,
                type: 'success'
              })
              this.$router.push('./article')
            })
          } else {
            addArticle(this.article, draft).then(res => {
              this.$message({
                message: `${draft ? '存入草稿' : '发布'}成功`,
                type: 'success'
              })
              this.$router.push('./article')
            })
          }
        }
      })
    },
    // 修改文章：加载文章内容
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    },
    onUpdateCover (index, url) {
      this.article.cover.images[index] = url
    }
  }
}
</script>
<style scoped lang="less"></style>
