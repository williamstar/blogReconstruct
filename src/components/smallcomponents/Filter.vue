<template>
  <div class='filter-module'>
    <el-form :inline="true" label-width="50px" class="filter">
      <el-form-item v-if="isAdmin" label="博客状态">
        <el-select v-model="isDraft" @change="getBlog">
          <el-option v-for="(status, index) in blogStatuss" :value="index" :label="status" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="categoryIndex" @change="getBlog">
          <el-option v-for="category in filterCategories" :value="category.id" :label="category.val" :key="category.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-select v-model="sortedIndex" @change="getBlog">
          <el-option v-for="(status, index) in sortedStatuss" :value="index" :label="status.text" :key="status.val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryStr" placeholder="全局搜索" icon="search" :on-icon-click="handleSearch"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type='text/javascript'>
import { mapGetters } from 'vuex';

export default {
  props: {
    isAdmin: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      blogStatuss: ['完成', '草稿'],
      sortedStatuss: [
        {
          val: 'desc',
          key: 'createDate',
          text: '最近',
        },
        {
          val: 'asc',
          key: 'createDate',
          text: '最久',
        },
        {
          val: 'desc',
          key: 'exploredTime',
          text: '最多浏览量',
        },
        {
          val: 'desc',
          key: 'commentNum',
          text: '最多评论量',
        },
      ],
      categoryIndex: -1,
      sortedIndex: 0,
      queryStr: '',
      isDraft: 0,
    };
  },
  computed: {
    ...mapGetters([
      'filterCategories',
    ]),
  },
  created() {
    this.getBlog();
  },
  methods: {
    handleSearch() {

    },
    getBlog() {
      this.$emit('get-blog', {
        isDraft: this.isDraft,
        categoryId: this.categoryIndex,
        sortedKey: this.sortedStatuss[this.sortedIndex].key,
        sortedVal: this.sortedStatuss[this.sortedIndex].val,
        queryStr: this.queryStr,
      });
    },
  },
};
</script>
<style lang='scss'>
.filter-module {
  margin-left: 30px;
  label {
    color: #fff;
  }
}
</style>
