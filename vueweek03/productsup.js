// 產品資料格式
const { createApp } = Vue;
const url = 'https://vue3-course-api.hexschool.io/v2';
const path = 'david2fat-week3';
let productModal = '';
let delProductModal = '';
      //1.建立元件
      //2.生成Vue應用程式
      //3.渲染到畫面
const app={
        data() {
        return{
          tempProduct :{
            imagesUrl: [],
            
          },//單一顯示
          products: [],
          isNew: false,
          
        }
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
         axios.post(`${url}/api/user/check`)
          .then(() => {
            this.getProducts();
          })
          .catch((err) => {
            alert(err.response.data.message);
            window.location = 'login.html';
          })
      },
      //#2渲染畫面
      getProducts() { //取得所有產品資料
          axios.get(`${url}/api/${path}/admin/products/all`)
          .then((response) => {
            // console.log(response);
            this.products = response.data.products;
            })
          .catch((err) => {
            alert(err.response.data.message);
          });
      },
      addProducts() { //增加
        let newUrl = `${url}/api/${path}/admin/product`;
        let pathType = 'post';
  
        if (!this.isNew) {
          newUrl = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;
          pathType = 'put'
        }
  
        axios[pathType](newUrl, { data: this.tempProduct })
         .then((response) => {
          alert(response.data.message);
          productModal.hide();
          this.getProducts();
        }).catch((err) => {
          alert(err.response.data.message);
        })
      
      },
      openPage(isNew, item){    //打開產品頁面
        if (isNew === 'new') {
          this.tempProduct = {
            imagesUrl: [],
          };
          this.isNew = true;
          productModal.show();
        } else if (isNew === 'edit') {
          this.tempProduct = { ...item };
          this.isNew = false;
          productModal.show();
        } else if (isNew === 'delete') {
          this.tempProduct = { ...item };
          delProductModal.show()
        }
      }, 
      delProduct() {
        axios.delete(`${url}/api/${path}/admin/product/${this.tempProduct.id}`)
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
      };

      
  createApp(app).mount('#app');

    
   
