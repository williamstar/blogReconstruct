export default {
  beforeEnter(to, from, next) {
    this.checkUser(next);
  },
  methods: {
    checkUser(next) {
      this
        .$http
        .get('/checkuser')
        .then((res) => {
          res = res.body;
          if (res.status === 'success') {
            debugger;
            next();
          } else {
            next(false);
          }
        });
    },
  },
};
