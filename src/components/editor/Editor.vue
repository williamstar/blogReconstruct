<template>
  <div class='editor-module'>
    <el-row>
      <el-col :span="4">left-part</el-col>
      <el-col :span="16">
        <el-form ref="form" label-width="40px">
          <el-row>
            <el-col :span="20">
              <!--标题和时间-->
              <el-row type="flex" justify="space-between">
                <el-col :span="12">
                  <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9" :offset="3">
                  <el-form-item label="分类">
                    <el-select v-model="form.category" clearable >
                      <el-option v-for="option in options" :value="option" :key="option" :label="option"> </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!--分类和标签和自动保存-->
              <el-row>
                <el-col :span="9">
                  <el-form-item label="标签">
                    <el-tag v-for="tag in tags" :key="tag" :closable="true" @close="removeTag(tag)" class="tag" type="primary" color="#fff">
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
            </el-col>

            <el-col :span="4" class="clearfix">
              <!--封面-->
              <div class="cover-wrapper">
                <el-button v-if="!haveCover" class="btn-cover" @click="selectCover">
                  <i class="el-icon-plus icon-plus"></i>
                </el-button>
                <img v-else class="upload-cover" alt="封面" @click="selectCover">
                <transparent-file-elm :selector="'upload-cover'" :need-hash="true" @had:cover="setCover" ref="uploadCover"></transparent-file-elm>
              </div>
            </el-col>
          </el-row>
          <!--博客框-->
          <div class="editor-wrapper">
            <input type="hidden" id="text" value="demo">
            <div id="my-editor">
            </div>
          </div>
          <div class="submit-button-wrapper">
            <el-button type="primary" size="large">
              提交
            </el-button>
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
import transparentFileElm from '@/components/smallcomponents/TransparentFileElm';

export default {
  data() {
    return {
      options: ['python开发', 'web前端', '科技趣事'],
      tags: [],
      inputVisible: false,
      inputValue: '',
      autoSave: true,
      haveCover: false,
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
    setCover(dataUrl) {
      this.haveCover = true;
      this.$nextTick(() => {
        document.querySelector('.upload-cover').src = dataUrl;
      });
    },
    selectCover() {
      this.$refs.uploadCover.open();
    },
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
        if (this.tags.length <= 4) {
          this.tags.push(inputValue);
        } else {
          this.$message({
            message: '不能超过5个标签',
            type: 'warning',
          });
        }
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
  },
  components: {
    transparentFileElm,
  },
};
</script>
<style lang='scss' scoped>
.editor-module {
  padding-top: 30px;
  .el-form {
    padding-bottom: 60px;
    label {
      color: #fff;
    }
    .tag {
      margin-right: 5px;
    }
    .cover-wrapper {
      float: right;
      .btn-cover {
        width: 125px;
        height: 125px;
        border-radius: 5px;
        .avatar-upload {
          font-size: 26px;
          color: #48d0d3;
        }
      }
      .upload-cover {
        width: 125px;
        height: 125px;
        object-fit: cover;
        border-radius: 5px;
        cursor: pointer;
      }
    }
    .input-new-tag {
      width: 77.67px;
    }
    .editor-wrapper {
      margin-top: 10px;
      height: 800px;
    }
    .submit-button-wrapper {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
