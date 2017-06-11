import Vue from 'vue';
import config from '../config/index';

const OK = 'success';
const get = url => Vue.http.get(`${config.apiUrl}${url}`).then(res => res.body);
const del = url => Vue.http.delete(`${config.apiUrl}${url}`).then(res => res.body);
const post = (url, data) => Vue.http.post(`${config.apiUrl}${url}`, data).then(res => res.body);
const put = (url, data) => Vue.http.put(`${config.apiUrl}${url}`, data).then(res => res.body);

const preloadService = () => {
  return get('/config/user-config');
};

const checkUserService = () => {
  return get('/checkuser').then(({ status, msg }) => {
    if (status !== OK) {
      throw new Error(msg);
    }
  });
};

const getBlogsService = (url) => {
  return get(url).then(({ status, data }) => {
    if (status !== OK) {
      throw new Error('some error');
    }
    return {
      blogs: data.blogs,
      total: data.total,
    };
  });
};

const getBlogService = (url) => {
  return get(url).then(({ status, data, msg }) => {
    if (status === OK) {
      return data;
    }
    throw new Error(msg);
  });
};

const modifyPasswdService = (url, data) => {
  return post(url, data).then(({ status, msg }) => {
    if (status !== OK) {
      throw new Error(msg);
    }
  });
};
const deleteCategoryService = (url) => {
  return del(url).then(({ status, msg }) => {
    if (status !== OK) {
      throw new Error(msg);
    }
  });
};

const loginService = (data) => {
  return post('/login', data).then(({ status, msg }) => {
    if (status !== OK) {
      throw new Error(msg);
    }
  });
};
const logoutService = () => {
  return get('/logout')
    .then(({ status, msg }) => {
      if (status !== 'success') {
        throw new Error(msg);
      }
    });
};

const uploadCoverImgService = fd => {
  return post('/config/upload-cover', fd).then(({ status, msg }) => {
    if (status !== OK) {
      throw new Error(msg);
    }
  });
};
const deleteBlogService = url => {
  return del(url).then(({ status, msg }) => {
    if (status !== OK) {
      throw new Error(msg);
    }
  });
};
const getEditBlogService = url => {
  return get(url).then(({ status, msg, data }) => {
    if (status === OK) {
      return data;
    }
    throw new Error(msg);
  });
};

const addCategoryService = category => {
  return post('/category/new', category).then(({ status, data, msg }) => {
    if (status !== OK) {
      throw new Error(msg);
    }
    return data;
  });
};

const postBlogService = (fd) => {
  return post('/blog/new', fd).then(({ status, msg, data }) => {
    if (status !== OK) {
      throw new Error(msg);
    }
    return data; // 返回blog的id
  });
};

const editBlogService = (url, fd) => {
  return put(url, fd).then(({ status, msg }) => {
    if (status !== OK) {
      throw new Error(msg);
    }
  });
};

const tagSuggestService = qs => {
  return post('/tag-suggestion', qs).then(({ data }) => {
    return data;
  });
};

const uploadBlogCover = (hash, fd) => {
  return post(`/upload?guid=${hash}`, fd).then(({ status, msg }) => {
    if (status !== OK) {
      throw new Error(msg);
    }
  });
};

const switchFastRenderService = (state) => {
  return put('/config/switch-fast-render', state).then(({ status, msg }) => {
    if (status !== OK) {
      throw new Error(msg);
    }
  });
};

export {
  preloadService,
  checkUserService,
  getBlogsService,
  getBlogService,
  modifyPasswdService,
  deleteCategoryService,
  loginService,
  logoutService,
  uploadCoverImgService,
  deleteBlogService,
  getEditBlogService,
  addCategoryService,
  postBlogService,
  editBlogService,
  tagSuggestService,
  uploadBlogCover,
  switchFastRenderService,
};
