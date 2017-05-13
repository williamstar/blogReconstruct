<template>
  <div class='editor-module'>
    <el-row>
      <el-col :span="4">left-part</el-col>
      <el-col :span="16">
        <el-form ref="form" label-width="40px">
          <!--标题和时间-->
          <el-row type="flex" justify="space-between">
            <el-col :span="10">
              <el-form-item label="标题">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9" :offset="5">
              <el-form-item label="时间">
                <el-input disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!--分类和标签和自动保存-->
          <el-row>
            <el-col :span="5">
              <el-form-item label="分类">
                <el-select v-model="form.category">
                  <el-option v-for="option in options" :value="option" :key="option" :label="option"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="标签">
                <el-tag v-for="tag in tags" :key="tag" :closable="true" @close="removeTag(tag)" type="primary" color="#fff">
                  {{tag}}
                </el-tag>
                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="自动保存" label-width="80px">
                <el-switch v-model="autoSave"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <!--博客框-->
          <div class="editor-wrapper">
            <input type="hidden" id="text" value="demo">
            <div id="my-editor">
            </div>
          </div>
        </el-form>
      </el-col>
      <el-col :span="4">right-part</el-col>
    </el-row>
  </div>
</template>
<script type='text/javascript'>
/* eslint-disable */
import $ from 'jquery';
import editormd from 'editormd';
/* eslint-enable */

export default {
  data() {
    return {
      options: ['python开发', 'web前端', '科技趣事'],
      tags: [],
      inputVisible: false,
      inputValue: '',
      autoSave: true,
      form: {
        title: '',
        category: '',
      },
    };
  },
  mounted() {
    try {
      this.editor = editormd('my-editor', {
        width: '100%',
        height: 800,
        value: document.querySelector('#text').value,
        saveHTMLToTextarea: true,
        path: '/static/lib/',
        imageUpload: true,
        imageUploadURL: '/upload',
        imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'webp'],
        // theme: 'dark',
        // previewTheme: 'dark',
        // editorTheme: 'pastel-on-dark',
      });
    } catch (e) {
      console.log(e);
    }

    document.addEventListener('resize', () => {
      this.editor.width = '100%';
    });
  },
  methods: {
    removeTag(tag) {
      let index = this.tags.indexOf(tag);
      this.tags.splice(index, 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
  },
};
</script>
<style lang='scss' scoped>
.editor-module {
  padding-top: 30px;
  label {
    color: #fff;
  }
  .input-new-tag {
    width: 77.67px;
  }
  .editor-wrapper {
    height: 800px;
  }
}
</style>
