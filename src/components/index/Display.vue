<template>
  <div class='display-module'>
    <div class="filter-blog-wrapper">
      <filter-blog @get-blog="getBlog"></filter-blog>
    </div>
    <blog-iterator :blogs="blogs"></blog-iterator>
    <div v-if="total !== 0" class="pagination">
      <el-pagination layout="prev, pager, next" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script type='text/javascript'>
import blogIterator from '@/components/smallcomponents/BlogIterator';
import filterBlog from '@/components/smallcomponents/Filter';

const OK = 'success';
export default{
  data() {
    return {
      total: 0,
      limit: 10,
      currentPage: 1,
      filter: {
        isDraft: 0,
        sortedKey: 'createDate',
        sortedVal: 'desc',
        categoryId: -1,
        queryStr: '',
      },
      blogs: [],
    };
  },
  computed: {
    pageSize() {
      return Math.ceil(this.total / this.limit);
    },
  },
  methods: {
    getBlog(filter) {
      if (filter) {
        this.filter = filter;
      }
      let defaultUrl = '/blogs';
      defaultUrl = `/blogs?page=${this.currentPage}&isDraft=${this.filter.isDraft}&categoryId=${this.filter.categoryId}&sortedKey=${this.filter.sortedKey}&sortedVal=${this.filter.sortedVal}&queryStr=${this.filter.queryStr}`;
      this
        .$http
        .get(defaultUrl)
        .then((res) => {
          res = res.body;
          if (res.status === OK) {
            this.blogs = res.data.blogs;
            this.total = res.data.total;
          }
        });
    },
    handleCurrentChange() {
      this.getBlog();
    },
  },
  components: {
    blogIterator,
    filterBlog,
  },
};
</script>
<style lang='scss' scoped>
.filter-blog-wrapper {
  margin-top: 20px;
}

.pagination {
  margin-top: 25px;
  display: flex;
  justify-content: center;
}
</style>
