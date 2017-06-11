<template>
  <div class='blog-iterator-module'>
    <router-link :to="`/blog/${blog.id}`" v-for="(blog, index) in blogs" :key="blog._id">
      <div v-if="renderWay" class="img-render render">
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
      </div>
      <div v-else class="fast-render render">
        <div class="blog-header">
          <h4 class="title">{{blog.title}}</h4>
          <div class="create-date">{{blog.createDate | formateTime}}</div>
        </div>
        <div class="brief-content">{{blog.text + ' ......'}}</div>
      </div>
    </router-link>
  </div>
</template>
<script type='text/javascript'>
import { currentTime as formateTime } from '@/common/js/time';
import { Message, MessageBox } from 'element-ui';
import { deleteBlogService } from '@/api/index';
import { mapState } from 'vuex';

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
  computed: {
    ...mapState([
      'renderWay',
    ]),
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
  .render {
    cursor: pointer;
    &.img-render {
      position: relative;
      margin-top: 20px;
      width: 300px;
      min-height: 400px;
      margin: 20px 20px;
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
    &.fast-render {
      margin-top: 20px;
      padding: 10px;
      width: 1200px;
      border-radius: 5px;
      background: #fff;
      .blog-header {
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(127, 83, 83, .28);
        .create-date {
          margin-left: auto;
        }
      }
      .brief-content {
        padding: 8px 0 0 0;
      }
    }
  }
}
</style>
