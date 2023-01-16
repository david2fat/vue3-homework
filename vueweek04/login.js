
const { createApp } = Vue;
const url = 'https://vue3-course-api.hexschool.io/v2'; // 請加入站點
const path = 'david2fat-week3';
const app={
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      // #1 發送 API 至遠端並登入（並儲存 Token）
      axios.post(`${url}/admin/signin`, this.user)
      .then((res) => {
        console.log(res);
        const { token, expired } = res.data;
        // 寫入 cookie token   // expires 設置有效時間
        document.cookie = `hexToken=${token};expires=${new Date(expired)}; `;
        window.location = 'productsup-week4.html';// 轉換頁面
        }).catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
}
createApp(app).mount('#app');
    