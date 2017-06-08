<template>
  <div class='blog-iterator-module'>
    <router-link :to="`/blog/${blog.id}`" class="card-wrapper" v-for="(blog, index) in blogs" :key="blog._id">
      <el-card :body-style="{padding: '0px'}">
        <img :src="'/image/' + blog.coverImg" class="cover" alt="封面图片">
        <div style="padding: 14px;">
          <span>{{blog.title}}</span>
          <div style="margin-top: 6px;">
            {{blog.createDate | formateTime}}
          </div>
        </div>
        <div v-if="admin" class="btn-group" :data-id="blog._id">
          <el-button type="success" icon="edit" @click.prevent.stop="edit(blog.id)"></el-button>
          <el-button type="danger" icon="delete" @click.prevent.stop="del(blog.id, index)"></el-button>
        </div>
      </el-card>
    </router-link>
  </div>
</template>
<script type='text/javascript'>
import { currentTime as formateTime } from '@/common/js/time';
import { Message, MessageBox } from 'element-ui';
import { deleteBlogService } from '@/api/index';

export default {
  props: {
    blogs: Array,
    admin: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  methods: {
    edit(id) {
      this.$router.push(`/edit/${id}`);
    },
    del(id, index) {
      MessageBox.confirm('是否删除当前博客?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteBlogService(`/blog/${id}/delete`)
          .then(() => {
            this.blogs.splice(index, 1);
            Message.success('删除成功');
          }).catch(err => {
            Message.warning(`删除失败${err}`);
          });
      }).catch(() => {
        Message.info('已取消删除');
      });
    },
  },
  filters: {
    formateTime,
  },
};
</script>
<style lang='scss' scoped>
.blog-iterator-module {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .card-wrapper {
    position: relative;
    margin-top: 20px;
    width: 300px;
    margin: 20px 20px;
    cursor: pointer;
    .cover {
      max-width: 100%;
      object-fit: cover;
    }
    .btn-group {
      opacity: 0;
      position: absolute;
      top: 10px;
      right: 10px;
      transition: opacity .3s;
    }
    &:hover {
      .btn-group {
        opacity: 1;
      }
    }
  }
}
</style>
