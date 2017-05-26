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
import marked from 'marked';
/* eslint-enable */
import { currentTime } from '@/common/js/time';

const OK = 'success';
export default {
  data() {
    return {
      blog: {
      },
      editor: {},
    };
  },
  activated() {
    this
      .$http
      .get(`/blog/${this.$route.params.blogId}`)
      .then((res) => {
        res = res.body;
        if (res.status === OK) {
          this.blog = res.data;
          document.title = this.blog.title;
          // 清除掉原先的html
          document.querySelector('#blog-text').innerHTML = '';
          this.editor = editormd.markdownToHTML('blog-text', {
            markdown: this.blog.text,
            htmlDecode: true,
            markdownSourceCode: false,
          });
        }
      });
  },
  filters: {
    currentTime,
  },
};
</script>
<style lang='scss' scoped>
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
