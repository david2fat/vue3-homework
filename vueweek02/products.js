// 產品資料格式
const { createApp } = Vue;
const url = 'https://vue3-course-api.hexschool.io/v2';
const path = 'david2fat-vue';
      //1.建立元件
      //2.生成Vue應用程式
      //3.渲染到畫面
    const app={
        data() {
        return{
          tempProduct :{},//單一顯示
          products: [], //全部產品列表
        }
       },
    methods: {
      //#1確認身分
      checkAdmin() {
         axios.post(`${url}/api/user/check`)
          .then(() => {
            this.renderProducts();
          })
          .catch((err) => {
            alert(err.response.data.message);
            window.location = 'index.html';
          })
      },
      //#2渲染畫面
          renderProducts() { //渲染畫面
          axios.get(`${url}/api/${path}/admin/products`)
          .then((res) => {
            console.log(res);
            this.products = res.data.products;
            
          })
          .catch((err) => {
            alert(err.response.data.message);
          });
        },
        
        
      },
      mounted() {//畫面一開始先執行這段
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        this.checkAdmin();//執行這段程式碼進行確認
       

      }
      };
      createApp(app).mount('#app');

    
   
