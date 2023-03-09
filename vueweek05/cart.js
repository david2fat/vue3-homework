// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
// 1 點擊按鈕 modal展開 取得遠端資料 呈現資料
// 2 點擊按鈕 取得遠端資料 modal展開  呈現資料 V 老師示範
// 取得選端資料 外部元件 modal元件執行
const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'david2fat-week5v3';


// 全部加入(CDN 版本)定義規則
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});
const productModal={
  //當ＩＤ有變動。取得遠端資料 呈現modal 外層html哪個ＩＤ顯是內層哪個ＩＤ
  props:['id','addToCart','openModal'], 
  data(){
    return{
      modal:{},
      tempProduct:{},
      qty:1,
      
    };
  },
  
  template:'#userProductModal',//template 樣板自面值 x-template vite
  //監聽id 傳入的值
  watch:{
    id(){
      console.log('productModal:',this.id);
      if(this.id){
      axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
      .then((res) => {
        console.log('單一產品:', res.data.product);
        this.tempProduct = res.data.product;
        this.modal.show();
      });
     }
    },
  },
  methods:{
    hide(){
      this.modal.hide();
    }
  },
  mounted(){
    this.modal = new bootstrap.Modal(this.$refs.modal);
    //監聽dom當modal關閉時要做其他事情
    this.$refs.modal.addEventListener('hidden.bs.modal', event => {
      this.openModal('');
    });
    
  },
};
// 

const app = Vue.createApp({
  data() {
    return {
      products: [],
      productId:'',
      cart:{},
      qty:'',
      loadingItem:'',//存id
      form:{
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
         },
        message: '',
      },
      
    };
  },
  methods: {
   getProducts() {
      axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
      .then((res) => {
        console.log('產品列表:', res.data.products);
        this.products = res.data.products;
      });
    },
   openModal(id){
      this.productId=id;
      console.log('外層帶入productI',id);
    },
   addToCart(product_id, qty=1){
      //把參數的值直接帶進來 當沒有傳入該參數時 會使用預設值
      const data={
        product_id,
        qty,
      };
      axios.post(`${apiUrl}/v2/api/${apiPath}/cart`,{data})//參考第一週觀念 同名可以不用寫第二次
      .then((res) => {
        console.log('加入購物車：', res.data);
        this.$refs.productModal.hide();//html 
        this.getCarts();
      });  
    },
   getCarts(){
    //未來可以優化區塊 全畫面的讀取
      axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)//取得購物車資料 
      .then((res) => {
        console.log('購物車：', res.data);
        this.cart=res.data.data;
    });
   },
   updateCartItem(item){//購物車＋產品的ＩＤ
    const data={ 
      product_id: item.product.id,//產品ＩＤ  快捷鍵展開選取熱鍵（可自訂）
      qty: item.qty,
  };
  //  console.log(data ,item.id);
  this.loadingItem=item.id;// 觸發前存起來
    axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`,{data})//取得購物車ＩＤ 
      .then((res) => {
        console.log(' 更新購物車：', res.data);
        this.getCarts();
        this.loadingItem='';//觸發後清空 使用單一值去存 也可以使用陣列
    });
   },
   deleteItem(item){//購物車＋產品的ＩＤ
    this.loadingItem=item.id;
    axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`)//取得購物車ＩＤ 
      .then((res) => {
        console.log('刪除購物車：', res.data);
       this.getCarts();
       this.loadingItem='';
    });
   },
   isPhone(value) {
    const phoneNumber = /^(09)[0-9]{8}$/
    return phoneNumber.test(value) ? true : '需要正確的電話號碼'
   },
   onSubmit() {
    const order = this.form;
    const url = `${apiUrl}/v2/api/${apiPath}/order`;
    axios.post(url,{data:order})//
    .then((response) => {
      console.log('已完成結帳：', response.data.message);
     
      alert(response.data.message);
      this.$refs.form.resetForm();
      this.getCarts();
    })
   },
  },
  mounted() {
    this.getProducts();
    this.getCarts();
    console.log('生命週期開始');
    
  },
  components:{
    productModal,
  },
});

// app.component("productModal",productModal);

//註冊全域的表單驗證元件（VForm, VField, ErrorMessage）
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
// ------------------------
app.use(VueLoading.LoadingPlugin,
  {color: 'red'});

app.mount('#app');