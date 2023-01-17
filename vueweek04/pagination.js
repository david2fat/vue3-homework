export default{
    props:['pages','getProducts'],//把page傳進來 內層  調整分頁樣式 發動屬性:當page=當前頁面
    template:`<nav aria-label="Page navigation example"> 
    {{pages}}
    <ul class="pagination">
      <li class="page-item"
      :class="{disabled :!pages.has_pre}" >
      <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li class="page-item"
      :class="{active:page===pages.current_page}"  
       v-for='page in pages.total_pages' :key="page+'page'" >
      <a class="page-link" href="#"
      @click="getProducts(page)">{{ page }}</a>
      </li>
     
      <li class="page-item"
      :class="{disabled :!pages.has_next}" >
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`

}