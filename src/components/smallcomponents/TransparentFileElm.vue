<template>
  <div>
    <input type="file" @change="replaceImg($event)" class="transparent-file-elm" :class="'hidden-'+ selector">
  </div>
</template>

<script type="text/javascript">
import SparkMD5 from '../../../static/js/spark-md5.min';

export default {
  props: {
    selector: String,
    needHash: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      node: null,
    };
  },
  methods: {
    open() {
      if (!this.node) {
        this.node = document.querySelector(`.transparent-file-elm.hidden-${this.selector}`);
      }
      this.node.click();
    },
    replaceImg(event) {
      let file = event.target.files[0];
      let fr = new FileReader();
      let self = this;
      fr.onload = () => {
        if (self.needHash) {
          // 计算hash值
          let spark = new SparkMD5();
          spark.append(fr.result);
          self.$emit('had:cover', fr.result, spark.end());
        } else {
          self.$emit('had:cover', fr.result);
        }
      };
      fr.readAsDataURL(file);
    },
  },
};
</script>

<style lang="scss" scoped>
.transparent-file-elm {
  display: none;
}
</style>
