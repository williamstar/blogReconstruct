<template>
  <div class='blog-module'>
    <h2 class="title">
      {{blog.title}}
    </h2>
    <div class="detail">
      <span class="category">{{blog.category}}</span>
      <span class="tags-wrapper">
        <el-tag v-for="(tag, index) in blog.tags" class="tag" :style="{'background': selectTagColor(index)}" :key="index">{{tag}}</el-tag>
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
import { Loading } from 'element-ui';
import { currentTime } from '@/common/js/time';
import { getBlogService } from '@/api/index';

export default {
  data() {
    return {
      color: [
        '#684e79',
        '#ff708e',
        '#47a899',
        '#8abee5',
      ],
      blog: {
      },
      editor: {},
      preColor: 0,
      colorOffset: 0,
    };
  },
  created() {
    this.colorOffset = Math.floor(this.color.length * Math.random());
  },
  methods: {
    selectTagColor(index) {
      return this.color[(index + this.colorOffset) % this.color.length];
    },
  },
  activated() {
    let loading = Loading.service({ target: document.querySelector('.blog-module') });
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
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        loading.close();
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
    margin-bottom: 20px;
    text-align: center;
    font-size: 32px;
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
