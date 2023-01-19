// 產品資料格式
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from './pagination.js';
// const { createApp } = Vue;
// Vue.config.productionTip = false;
let productModal = "";
let delProductModal = "";

      //1.建立元件
      //2.生成Vue應用程式
      //3.渲染到畫面
      // <!-- 產品頁面
      // 頁面模板
      // 取得產品資料串接 GET API
      // 新增產品資料串接 POST API
      // 刪除產品資料串接 DELETE API
      // 編輯產品資料串接 PUT API -->
 const app=createApp({ 
        data() {
        return{
          apiUrl : 'https://vue3-course-api.hexschool.io/v2',
          apiPath : 'david2fat-week3',
          products: [],
          isNew: false,
          tempProduct :{
          imagesUrl: [],
          },//單一顯示
          page:{} //外層page
        };
       },
    mounted() {//生命週期先執行
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
          keyboard: false//option
        });
    
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
          keyboard: false//option
        }); 
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        this.checkAdmin();//執行這段程式碼進行確認
       

      },
    methods: {
      //#1確認身分
      
      checkAdmin() {
        const url=`${this.apiUrl}/api/user/check`;
         axios.post(url)
          .then(() => {
            this.getProducts();
          })
          .catch((err) => {
            alert(err.response.data.message);
            window.location = 'login.html';S
          })
      },
      getProducts(page=1) { //預設參數1 //取得所有產品資料  //去掉all才有pagination
        const url=`${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;
          axios.get(url)
          .then((response) => {
            // console.log(response);
            this.products = response.data.products;
            console.log(response.data);
            this.page=response.data.pagination;//存取page資訊

            })
          .catch((err) => {
            alert(err.response.data.message);
          });
      },
      addProducts() { //增加
        let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        let http = 'post';//平常狀態為新增
  
        if (!this.isNew) {
          url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
          http = 'put' //當不是isnew為更新
        }
  
        axios[http](url, { data: this.tempProduct })
         .then((response) => {
          alert(response.data.message);
          productModal.hide();
          this.getProducts();
        }).catch((err) => {
          alert(err.response.data.message);
        })
      
      },
      openPage(isNew, item){    //打開產品編輯頁面
        if (isNew === 'new') {//如果是新增狀態
          this.tempProduct = {
            imagesUrl: [],
          };
          this.isNew = true;
          productModal.show();
        } else if (isNew === 'edit') {//如果是編輯狀態
          this.tempProduct = { ...item };
          this.isNew = false;
          productModal.show();
        } else if (isNew === 'delete') {//如果是刪除狀態
          this.tempProduct = { ...item };
          delProductModal.show()
        }
      }, 
      delProduct() {//刪除函式
        const url=`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        axios.delete(url)
        .then((response) => {
          alert(response.data.message);
          delProductModal.hide();
          this.getProducts();
        }).catch((err) => {
          alert(err.response.data.message);
        })
      },
      createImages() {
        this.tempProduct.imagesUrl = [];
        this.tempProduct.imagesUrl.push('');
      },
      },
    components: {//區域元件
      pagination,
    },
  }); 
      // };
//modal 元件     
// app.components('product-modal',{
//   props:['temProduct'],
//   template:'product-modal-template',
// });
app.mount('#app');     
  // createApp(app).mount('#app');

    
   
