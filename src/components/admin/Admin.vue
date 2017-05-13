<template>
  <div class='admin-module'>
    <div class="platform">
      <div class="button-groups">
        <router-link to="/edit">
          <el-button icon="plus" type="primary">添加新博客</el-button>
        </router-link>
      </div>
    </div>
    <div class="blog-body">
      <div class="card-wrapper" v-for="(blog, index) in blogs" :key="">
        <el-card :body-style="{padding: '0px'}">
          <img :src="'/api/image/' + blog.cover_id" class="cover" alt="封面图片">
          <div style="padding: 14px;">
            <span>{{blog.title}}</span>
            <div style="margin-top: 6px;">
              {{blog.datetime}}
            </div>
          </div>
          <div v-if="$route.fullPath.indexOf('admin') !== -1" class="btn-group" :data-id="blog._id">
            <el-button type="success" icon="edit" @click="edit(blog._id)"></el-button>
            <el-button type="danger" icon="delete" @click="del(blog._id, index)"></el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script type='text/javascript'>
/* eslint-disable*/
const OK = 'success';

export default{
  data() {
    return {
      blogs: []
    };
  },
  methods: {
    edit(e) {
      debugger;
      let id = e.currentTarget.parentNode.dataset.id;
      this.$router.push(`/edit/${id}`);
    },
    del(id, index) {
      this.$confirm('是否删除当前博客?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this
          .$http
          .delete(`/api/blog/${id}/delete`)
          .then((res) => {
            res = res.body;
            if (res.status === OK) {
              this.blogs.splice(index, 1);
              this.$message({
                type: 'success',
                message: '删除成功',
              });
            } else {
              this.$message({
                type: 'warning',
                message: '删除失败',
              });
            }
          });
      }).catch((err) => {
        debugger;
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      })
    }
  },
  beforeEnter() {

  },
  created() {
    document.title = "后台管理";
    this
      .$http
      .get('/api/admin')
      .then((res) => {
        res = res.body;
        if (res.status === OK) {
          this.blogs = res.data;
        }
      });
  }
};
</script>
<style lang='scss' scoped>
.admin-module {
  padding: 10px;
  .blog-body {
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
}
</style>
