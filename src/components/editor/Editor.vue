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
                    <!--必须要再绑定一个v-model才可以实现input的变动改变-->
                    <el-autocomplete class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.esc.native="tagCancel" @keyup.enter.native="tagConfirm" @select="selectTag" :fetch-suggestions="tagSuggestion">
                    </el-autocomplete>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="自动保存" label-width="80px">
                    <el-switch v-model="autoSave" @change="saveStatusHandler"></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <!--封面-->
            <el-col :span="4" class="clearfix">
              <div class="cover-wrapper">
                <el-button v-if="!haveCover && !form.coverImg" class="btn-cover" @click="selectCover">
                  <i class="el-icon-plus icon-plus"></i>
                </el-button>
                <img v-else :src="`/api/image/${form.coverImg}`" class="upload-cover" alt="封面" @click="selectCover">
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
            <el-button v-if="!this.form.id" type="primary" size="large" @click="saveAsDraft">
              保存为草稿
            </el-button>
            <el-button v-if="this.form.id && this.form.isDraft" type="primary" size="large" @click="publish">
              发布
            </el-button>
            <el-button type="danger" @click="resetForm">重置表单</el-button>
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
/* eslint-disable no-unused-vars*/
import _ from 'lodash';

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
      originForm: {},
      timer: 0,
      form: {
        title: '',
        categoryId: '',
        isDraft: 0,
        tags: [],
        coverImg: '', // 蛇纹命令兼容mongodb早期设置
        text: 'learn well, finish your dream',
      },
      editor: {},
    };
  },
  activated() {
    if (this.autoSave) {
      let self = this;
      this.timer = setInterval(() => {
        if (self.form.id) {
          // 如果存在id，则正常保存
          self.submit();
        } else {
          // 如果无id，则保存为草稿
          self.saveAsDraft();
        }
      }, 30000);
    }
    if (this.$route.params.blogId) {
      this.loadMarkdown = true;
      this
        .$http
        .get(`/api/blog/${this.$route.params.blogId}/edit`)
        .then((res) => {
          res = res.body;
          if (res.status === OK) {
            debugger;
            this.form = res.data.blog;
            this.categories = res.data.categories;
            debugger;
            this.originForm = JSON.parse(JSON.stringify(this.form));
            // 设置编辑器的内容, editormd实例需要一定的延迟
            let self = this;
            setTimeout(() => {
              self.editor.setMarkdown(self.form.text);
            }, 1000);
          }
        });
    } else {
      this
        .$http
        .get('/api/blog/new')
        .then((res) => {
          res = res.body;
          if (res.status === OK) {
            debugger;
            this.categories = res.data || [];
          }
        });
    }
  },
  deactivated() {
    clearInterval(this.timer);
  },
  created() {
    let config = localStorage.getItem('config');
    if (!config) {
      // 生成一份配置文件
      config = {
        autoSave: true,
      };
      localStorage.setItem('config', JSON.stringify(config));
    } else {
      config = JSON.parse(config);
    }
    this.autoSave = config.autoSave;
  },
  mounted() {
    this.editor = editormd('my-editor', {
      width: '100%',
      height: 800,
      saveHTMLToTextarea: true,
      path: '/static/lib/',
      imageUpload: true,
      imageUploadURL: '/api/upload',
      imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'webp'],
    });
    // 警告，这边有bug，如果不存blogId的情况
  },
  methods: {
    /* eslint-disable */
    // 提供tag的建议
    tagSuggestion: _.debounce(function (qs, cb) {
      if (qs === '') return;
      this
        .$http
        .post('/api/tag-suggestion', { 'qs': qs })
        .then((res) => {
          res = res.body;
          if (res.status === OK) {
            const data = res.data.map(tag => ({ value: tag })) || [];
            cb(data);
          }
        });
    }, 1000),
    /* eslint-enable */
    // 选择tag
    selectTag(item) {
      let inputValue = this.inputValue;
      this.inputVisible = false;
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
      this.inputValue = '';
    },
    // 添加新的分类
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
    // 从草稿提交成博客
    publish() {
      this.form.isDraft = 0;
      this.submit();
    },
    // 保存为草稿
    saveAsDraft() {
      this.form.isDraft = 1;
      this.submit();
    },
    // 提交表单
    submit() {
      this.$set(this.form, 'text', this.editor.getMarkdown());
      let imageList = this.extractImageGuid(this.form.text);
      let data = {};
      if (imageList.length > 0) data.images = imageList;
      if (this.form.id) {
        // 存在id则是修改
        // 比较和之前的form的值在哪里有区别，加入difference中，并提交
        Object.keys(this.originForm).forEach((key) => {
          if (Array.isArray(this.form[key])) {
            // tags的比较
            if (this.form[key].length !== this.originForm[key].length) {
              data[key] = this.form[key];
            } else {
              for (let i = 0; i < this.form[key].length; i += 1) {
                if (this.form[key][i] !== this.originForm[key][i]) {
                  data[key] = this.form[key];
                  break;
                }
              }
            }
          } else {
            if (this.originForm[key] !== this.form[key]) {
              data[key] = this.form[key];
            }
          }
        }, this);
        if (Object.keys(data).length > 0) {
          this
            .$http
            .put(`/api/blog/${this.form.id}/edit`, data)
            .then((res) => {
              res = res.body;
              if (res.status === OK) {
                this.cbHandler('修改博客成功', 'success');
              } else {
                this.cbHandler('修改博客失败', 'warning');
              }
            });
        }
      } else {
        // 需要用formdate上传数据
        let fd = new FormData();
        let file = document.querySelector('.hidden-upload-cover').files[0];
        fd.append('cover', file);
        fd.append('blog', JSON.stringify(this.form));
        this
          .$http
          .post('/api/blog/new', fd)
          .then((res) => {
            res = res.body;
            if (res.status === OK) {
              this.$set(this.form, 'id', res.data);
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
    // 抽取markdown中的图片信息
    extractImageGuid(str) {
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
    // 设置封面 or 上传封面
    setCover(dataUrl, hash) {
      this.haveCover = true;
      this.form.coverImg = hash;
      this.$nextTick(() => {
        document.querySelector('.upload-cover').src = dataUrl;
        // 如果当前为修改的情况下就上传图片，否则不更新
        if (this.form.id) {
          let file = document.querySelector('.hidden-upload-cover').files[0];
          let fd = new FormData();
          fd.append('editormd-image-file', file);
          this
            .$http
            .post(`/api/upload?guid=${hash}`, fd)
            .then((res) => {
              res = res.body;
              if (res.status === OK) {
                this.submit();
              } else {
                this.$message.error('上传失败');
              }
            });
        }
      });
    },
    // 选择封面
    selectCover() {
      this.$refs.uploadCover.open();
    },
    // 移除标签
    removeTag(tag) {
      let index = this.form.tags.indexOf(tag);
      this.form.tags.splice(index, 1);
    },
    // 显示tag的输入
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$el.querySelector('input').focus();
      });
    },
    // 取消tag的输入
    tagCancel() {
      this.inputValue = '';
      this.inputVisible = false;
    },
    // 确认tag
    tagConfirm() {
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
    saveStatusHandler() {
      if (this.autoSave) {
        this.timer = setInterval(this.submit, 30000);
      } else {
        clearInterval(this.timer);
      }
      let config = {
        autoSave: this.autoSave,
      };
      localStorage.setItem('config', JSON.stringify(config));
    },
    resetForm() {
      this.form.title = '';
      this.form.categoryId = '';
      this.form.tags = [];
      this.form.text = '';
      this.form.coverImg = '';
      this.haveCover = false;
      this.editor.setMarkdown('');
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
