<template>
  <!--
        自定义的滚动插件，使用requestAnimationFrame获取流畅性能，根据滚动的高度采取不同的移动速度。
      -->
  <div class='toTop-module'>
    <div class="arrow" :class="iconClass" @click="scrollTop"></div>
    <div v-if="dual" class="arrow el-icon-caret-bottom" @click="scrollTop"></div>
  </div>
</template>
<script type='text/javascript'>
export default {
  props: {
    /*
      存在三种模式，上，下，上下混合模式，
    */
    model: {
      type: String,
      default() {
        return 'up';
      },
    },
  },
  mounted() {
    if (this.model === 'bottom') {
      this.iconClass = 'el-icon-caret-bottom';
    } else if (this.model === 'dual') {
      this.iconClass = 'el-icon-caret-top';
      this.dual = true;
    }
  },
  data() {
    return {
      iconClass: 'el-icon-caret-top',
      dual: false,
    };
  },
  methods: {
    scrollTop(e) {
      let direction = e.currentTarget.className.indexOf('top') !== -1 ? 'top' : 'down';
      let cntY = window.scrollY;
      let timer = -1;
      let eachScrollDist = 0;
      if (direction === 'top') {
        eachScrollDist = cntY > 3000 ? 120 : 60;
      } else {
        eachScrollDist = document.body.scrollHeight - window.innerHeight - cntY > 3000 ? 120 : 60;
      }

      document.body.classList.add('disable-hover');
      const scroll = () => {
        if (direction === 'top') {
          cntY -= eachScrollDist;
        } else {
          cntY += eachScrollDist;
        }
        window.scrollTo(0, cntY);
        if (cntY <= 0 || cntY >= (document.body.scrollHeight - window.innerHeight)) {
          window.cancelAnimationFrame(timer);
          document.body.classList.remove('disable-hover');
        } else {
          timer = window.requestAnimationFrame(scroll);
        }
      };

      timer = window.requestAnimationFrame(scroll);
    },
  },
};
</script>
<style lang='scss'>
.toTop-module {
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 20px;
  bottom: 20px;
  .arrow {
    color: #fff;
    cursor: pointer;
  }
}

.disable-hover {
  pointer-events: none;
}
</style>
