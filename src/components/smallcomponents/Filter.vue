<template>
  <div class='filter-module'>
    <div class="filter-item" v-if="isAdmin">
      <div class="filter-label">
        博客状态
      </div>
      <el-select v-model="isDraft" @change="getBlog">
        <el-option v-for="(status, index) in blogStatuss" :value="index" :label="status" :key="index"></el-option>
      </el-select>
    </div>
    <div class="filter-item">
      <div class="filter-label">分类</div>
      <div class="filter-component">
        <el-select v-model="categoryIndex" @change="getBlog">
          <el-option v-for="category in filterCategories" :value="category.id" :label="category.val" :key="category.id"></el-option>
        </el-select>
      </div>
    </div>
    <div class="filter-item">
      <div class="filter-label">排序</div>
      <div class="filter-component">
        <el-select v-model="sortedIndex" @change="getBlog">
          <el-option v-for="(status, index) in sortedStatuss" :value="index" :label="status.text" :key="status.val"></el-option>
        </el-select>

      </div>
    </div>
    <div class="filter-item">
      <el-input v-model="queryStr" placeholder="搜索内容标签/内容/标题" icon="search" :on-icon-click="handleSearch" @keyup.enter.native="handleSearch"></el-input>
    </div>
    <div class="switch-render el-icon-menu" :class="{'active': renderWay }" @click="switchFastRender"> </div>
  </div>
</template>
<script type='text/javascript'>
import { mapState, mapGetters, mapActions } from 'vuex';

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
    ...mapState(['renderWay']),
  },
  methods: {
    ...mapActions(['switchFastRender']),
    handleSearch() {
      this.getBlog();
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
  display: flex;
  margin: 0 80px;
  .filter-item {
    &:not(:first-child) {
      margin-left: 40px;
    }
    display: flex;
    align-items: center;
    .filter-label {
      color: #fff;
    }
  }
  .switch-render {
    margin-left: auto;
    font-size: 24px;
    cursor: pointer;
    color: #124385;
    transition: all .3s ease;
    &.active {
      color: #093367;
      transform: rotate(45deg);
    }
  }
}
</style>
