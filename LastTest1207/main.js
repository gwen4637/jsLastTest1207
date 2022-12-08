//初始化
//產品列表、購物車列表
function init(){
    getProductData();
    getCartData();
}
init();


// 取得產品列表data
let productData = [];
function getProductData(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`)
    .then((res)=>{
        // console.log(res.data.products);
        productData = res.data.products;
        renderProductList(productData);
        renderProductSelect();
    })
    .catch((err)=>{
        console.log(err.message);
    })
}

//render 產品列表
const productWrap = document.querySelector(".productWrap");
function renderProductList(data){
    let html = '';
    data.forEach((e,i) => {
        html += `<li class="productCard" id="${e.id}">
        <h4 class="productType">新品</h4>
        <img src="${e.images}" alt="">
        <a href="#" class="addCardBtn" data-id="${e.id}">加入購物車</a>
        <h3>${e.title}</h3>
        <del class="originPrice">NT$${e.origin_price}</del>
        <p class="nowPrice">NT$${e.price}</p>
    </li>`
    });
    renderHtml(productWrap,html)
}

//下拉選單選取
const productSelect = document.querySelector(".productSelect");

function renderProductSelect(){
    let html = `<option value="全部" selected>全部</option>`;
    productSelectCategory.forEach((e,i)=>{
        html += `<option value="${e}">${e}</option>`
    })
    // console.log(html);
    renderHtml(productSelect,html)
}
productSelect.addEventListener("click",(e)=>{
    let productSelectValue = productSelect.value;
    // console.log(productSelectValue);
    if(productSelectValue == '全部'){
        renderProductList(productData);
    }else{
        let newproductData = [];
        productData.forEach((item,i)=>{
            if( productSelectValue == item.category){
                newproductData.push(item)
            }
        })
        // console.log(newproductData);
        renderProductList(newproductData);
    }
})





// 取得購物車列表data
let cartData = [];
let cartFinalTotal = 0;//購物車總金額

function getCartData(){
    axios(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`)
    .then((res)=>{
        // console.log(res.data.carts);
        cartData = res.data.carts;
        cartFinalTotal = res.data.finalTotal;
        renderCartList(cartData);
    })
    .catch((err)=>{
        console.log(err.message);
    })
}
//render 購物車列表
const shoppingCartTable = document.querySelector(".shoppingCart-table");
const shoppingCartTableList = document.querySelector(".shoppingCart-table-list");
const cartAllCost = document.querySelector(".cartAllCost");
function renderCartList(data){
    let html = "";
    if(data.length != 0 ){
        data.forEach((e,i)=>{
            html += `<tr data-product-id="${e.id}">
            <td>
                <div class="cardItem-title">
                    <img src="${e.product.images}" alt="">
                    <p>${e.product.title}</p>
                </div>
            </td>
            <td>${e.product.price}</td>
            <td>${e.quantity}</td>
            <td>${e.product.price*e.quantity}</td>
            <td class="discardBtn">
                <a href="#" class="material-icons" data-id="${e.id}">
                    clear
                </a>
            </td>
        </tr>`
        })
        renderHtml(shoppingCartTableList,html);
        renderHtml(cartAllCost,`NT ${cartFinalTotal}`);//購物車總金額
    }else{
        html = `<tr><td>購物車沒有任何資料</td></tr>`;
        renderHtml(shoppingCartTableList,html)
    }
}


//加入購物車
function addCartList(item){
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`,item)
      .then((res)=>{
        getCartData();
        alert("已加入購物車");
      })
      .catch((err)=>{
        console.log(err.message);
      })
}
productWrap.addEventListener("click",(e)=>{
    e.preventDefault();
    if(e.target.getAttribute("class") == "addCardBtn"){
        let productId = e.target.getAttribute("data-id");
        // console.log(productId);
        let productNum = 1
        cartData.forEach((item,i)=>{
            if(item.product.id == productId){
                productNum = item.quantity+=1;
            }
        })
        let item = {
            "data": {
                "productId": productId,
                "quantity": productNum
              }
        }
        addCartList(item);
    }
})


//刪除全部購物車
function deleteAllCartList(){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`)
      .then((res)=>{
        getCartData();
        alert("已刪除購物車所有商品");
      })
      .catch((err)=>{
        console.log(err.message);
        alert("購物車沒有任何資料");
      })
}
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    // console.log(e.target);
    deleteAllCartList();
})



//刪除單筆購物車
function deleteOneCartList(id){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts/${id}`)
    .then((res)=>{
        getCartData();
        alert("已刪除商品");
    })
    .catch((err)=>{
        console.log(err.message);
    })
}
shoppingCartTableList.addEventListener("click",(e)=>{
    e.preventDefault();
    if(e.target.getAttribute("class") == "material-icons"){
        let cartId = e.target.getAttribute("data-id");
        deleteOneCartList(cartId);
    }
})





//送出購買訂單
// https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/orders
let customerOrderData = [];
function postOrderList(item){
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/orders`,item)
    .then((res)=>{
        customerOrderData = res.data.products;
        getCartData();
        alert("已送出訂單");
    })
    .catch((err)=>{
        console.log(err.message);
    })
}
const customerName = document.querySelector("#customerName");
const customerPhone = document.querySelector("#customerPhone");
const customerEmail = document.querySelector("#customerEmail");
const customerAddress = document.querySelector("#customerAddress");
const tradeWay = document.querySelector("#tradeWay");
const orderInfoBtn = document.querySelector(".orderInfo-btn");
const orderInfoForm = document.querySelector(".orderInfo-form");
orderInfoBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    //判斷購物車內是否有商品
    if(cartData.length == 0){
    alert("購物車沒有商品喔");
    }else{
        if(customerName.value == "" || 
        customerPhone.value =="" ||
        customerEmail.value == "" ||
        customerAddress.value == ""
        ){
            requeryMessage(customerName);
            requeryMessage(customerPhone);
            requeryMessage(customerEmail);
            requeryMessage(customerAddress);
        }else{
            let item = {
                "data": {
                  "user": {
                    "name": customerName.value,
                    "tel": customerPhone.value,
                    "email": customerEmail.value,
                    "address": customerAddress.value,
                    "payment": tradeWay.value
                  }
                }
              }
            //   console.log(item);
            postOrderList(item);
            orderInfoForm.reset();
        }
    }
})
function requeryMessage(dom){
    if(dom.value == ""){
        dom.nextElementSibling.style.display = "block";
    }else{
        dom.nextElementSibling.style.display = "none";

    }
}





