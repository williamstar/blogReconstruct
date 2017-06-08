<template>
  <div class='blog-module'>
    <h2 class="title">
      {{blog.title}}
    </h2>
    <div class="detail">
      <span class="category">{{blog.category}}</span>
      <span class="tags-wrapper">
        <el-tag v-for="(tag, index) in blog.tags" class="tag" :key="tag">{{tag}}</el-tag>
      </span>
      <span class="datetime">{{blog.createDate | currentTime}}</span>
    </div>
    <div class="blog-wrapper">
      <div id="blog-text"></div>
    </div>
  </div>
</template>
<script type='text/javascript'>
/* eslint-disable */
import $ from 'jquery';
import editormd from 'editormd';
/* eslint-enable */
import { currentTime } from '@/common/js/time';
import { getBlogService } from '@/api/index';

export default {
  data() {
    return {
      blog: {
      },
      editor: {},
    };
  },
  activated() {
    getBlogService(`/blog/${this.$route.params.blogId}`)
      .then((blog) => {
        this.blog = blog;
        document.title = this.blog.title;
        // 清除掉原先的html
        document.querySelector('#blog-text').innerHTML = '';
        this.editor = editormd.markdownToHTML('blog-text', {
          markdown: this.blog.text,
          htmlDecode: true,
          markdownSourceCode: false,
        });
      }).catch((err) => {
        console.log(err);
      });
  },
  filters: {
    currentTime,
  },
};
</script>
<style lang='scss' scoped>
@import '../../../static/css/editormd.css';

.blog-module {
  width: 1200px;
  @media screen and (max-width: 1200px) {
    width: auto;
  }
  margin: 0px auto;
  padding: 20px 0;
  .title {
    text-align: center;
    margin-bottom: 20px;
    color: #fff;
  }
  .detail {
    margin: 30px 10px 10px;
    display: flex;
    align-items: center;
    color: #fff;
    .el-tag {
      margin-right: 8px;
      color: #fff;
    }
    .tags-wrapper {
      margin-left: 30px;
    }
    .datetime {
      margin-left: auto;
    }
  }
  .blog-wrapper {
    padding: 20px;
    #blog-text {
      margin-left: -20px;
    }
  }
}
</style>
