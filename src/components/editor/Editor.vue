<template>
  <div class='editor-module'>
    <el-row>
      <el-col :span="4">left-part</el-col>
      <el-col :span="16">
        <el-form label-width="40px">
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
                    <el-select v-model="form.categoryId" filterable allow-create clearable @change="addNewCategory">
                      <el-option v-for="category in categories" :value="category.id" :key="category.id" :label="category.val"> </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!--标签和自动保存-->
              <el-row>
                <el-col :span="9">
                  <el-form-item label="标签">
                    <el-tag v-for="tag in form.tags" :key="tag" :closable="true" @close="removeTag(tag)" class="tag" type="primary" color="#fff">
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
            <!--封面-->
            <el-col :span="4" class="clearfix">
              <div class="cover-wrapper">
                <el-button v-if="!haveCover && !form.cover_id" class="btn-cover" @click="selectCover">
                  <i class="el-icon-plus icon-plus"></i>
                </el-button>
                <img v-else :src="`/api/image/${form.cover_id}`" class="upload-cover" alt="封面" @click="selectCover">
                <transparent-file-elm :selector="'upload-cover'" :need-hash="true" @had:cover="setCover" ref="uploadCover"></transparent-file-elm>
              </div>
            </el-col>
          </el-row>
          <!--博客框-->
          <div class="editor-wrapper">
            <input type="hidden" id="text" :value="form.text">
            <div id="my-editor">
            </div>
          </div>
          <div class="submit-button-wrapper">
            <el-button type="primary" size="large" @click="submit">
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
import { currentTime } from '@/common/js/time';
/* eslint-disable */
import $ from 'jquery';
import editormd from 'editormd';
/* eslint-enable */
import transparentFileElm from '@/components/smallcomponents/TransparentFileElm';

const OK = 'success';

export default {
  data() {
    return {
      categories: '',
      inputVisible: false,
      inputValue: '',
      autoSave: true,
      haveCover: false,
      loading: false,
      cbMessage: '',
      cbType: '',
      form: {
        title: '',
        categoryId: '',
        tags: [],
        cover_id: '', // 蛇纹命令兼容mongodb早期设置
        text: 'learn well, finish your dream',
      },
      editor: {},
    };
  },
  activated() {
    this.editor = editormd('my-editor', {
      width: '100%',
      height: 800,
      value: this.form.text,
      saveHTMLToTextarea: true,
      path: '/static/lib/',
      imageUpload: true,
      imageUploadURL: '/api/upload',
      imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'webp'],
      // theme: 'dark',
      // previewTheme: 'dark',
      // editorTheme: 'pastel-on-dark',
    });
    if (this.$route.params.blogId) {
      this
        .$http
        .get(`/api/blog/${this.$route.params.blogId}/edit`)
        .then((res) => {
          res = res.body;
          if (res.status === OK) {
            this.form = res.data.blog;
            this.categories = res.data.categories;
            // 设置编辑器的内容
            this.editor.settings.value = this.form.text;
          }
        });
    } else {
      this
        .$http
        .get('/api/blog/new')
        .then((res) => {
          res = res.body;
          if (res.status === OK) {
            this.categories = res.data || [];
            // this.categories.push({
            //   id: '',
            //   val: '添加新条目',
            // });
          }
        });
    }

    document.addEventListener('resize', () => {
      this.editor.width = '100%';
    });
  },
  methods: {
    addNewCategory(nval) {
      // 创建的时候用的val,但是真正变动的时候却是id
      if (nval === '') {
        return;
      }
      if (!this.categories.some(category => category.val === nval || category.id === nval)) {
        // 创建新的category
        this
          .$http
          .post('/api/category/new', { category: nval })
          .then((res) => {
            res = res.body;
            if (res.status === OK) {
              this.form.categoryId = res.data;
              this.categories.push({
                id: res.data,
                val: nval,
              });
            } else {
              this.$message.error('创建失败');
            }
          });
      }
    },
    submit() {
      this.$set(this.form, 'text', this.editor.getMarkdown());
      let imageList = this.extract_images_guid(this.form.text);
      let time = currentTime();
      let data = Object.assign(this.form);
      data.time = time;
      data.images = imageList;
      if (this.form._id) {
        // 存在id则是修改
        this
          .$http
          .put(`/api/blog/${this.form._id}/edit`, data)
          .then((res) => {
            res = res.body;
            if (res.status === OK) {
              this.cbHandler('修改博客成功', 'success');
            } else {
              this.cbHandler('修改博客失败', 'danger');
            }
          });
      } else {
        this
          .$http
          .post('/api/blog/new', data)
          .then((res) => {
            res = res.body;
            if (res.status === OK) {
              this.$set(this.form, '_id', this.form);
              this.cbHandler('创建博客成功', 'success');
            } else {
              this.cbHandler('创建博客失败', 'danger');
            }
          });
      }
    },
    cbHandler(message, type) {
      this.cbMessage = message;
      this.cbType = type;
      this.$message({
        message: this.cbMessage,
        type: this.cbType,
      });
    },
    extract_images_guid(str) {
      const reg = new RegExp(/!\[\]\(\/images\/(\d+)\)/g);
      let imagesList = [];
      /* eslint-disable no-constant-condition */
      while (true) {
        let guid = reg.exec(str);
        if (guid) {
          guid = reg.exec(str)[1];
          if (imagesList.indexOf(guid) === -1) imagesList.push(guid);
        } else {
          break;
        }
      }
      return imagesList;
    },
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
        if (this.form.tags.length <= 4) {
          this.form.tags.push(inputValue);
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
<style lang='scss'>
.editor-module {
  padding-top: 30px;
  .el-form-item__label {
    color: #fff;
  }
  .el-form {
    padding-bottom: 60px;
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
