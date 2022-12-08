//管理者
function init(){
    getOrderList();
}
init();

//取得訂單列表
// https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders
let adminOrderData = [];
function getOrderList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`,{ headers:{
        "authorization":tokenID,
    }})
    .then((res)=>{
        adminOrderData = res.data.orders;
        renderAdminOrderList(adminOrderData);
        renderChart();
        // console.log(adminOrderData);
    })
    .catch((err)=>{
        console.log(err.message);
    })
}
const orderPageTableList = document.querySelector(".orderPage-table-list");
function renderAdminOrderList(data){
    let html = "";
    if(data.length == 0){
        html = "目前尚未有訂單";
        renderHtml(orderPageTableList,html);
    }else{
        data.forEach((e,i)=>{
            //訂單品項
            let orderProduct = ""
            e.products.forEach((item,i)=>{
                orderProduct += `<p>${item.title}，${item.quantity}個</p>`
            })
            //訂單狀態
            let paid = e.paid ? "已付款" : "未付款";
    
            html += `<tr data-id="${e.id}">
                <td>${e.id}</td>
                <td>
                <p>${e.user.name}</p>
                <p>${e.user.tel}</p>
                </td>
                <td>${e.user.address}</td>
                <td>${e.user.email}</td>
                <td>
                ${orderProduct}
                </td>
                <td>${e.createdAt}</td>
                <td class="orderStatus">
                <a href="#" class="orderStatusBtn" data-id="${e.id}">${paid}</a>
                </td>
                <td>
                <input type="button" class="delSingleOrder-Btn" value="刪除"  data-id="${e.id}">
                </td>
            </tr>`
        })
        // console.log(html);
        renderHtml(orderPageTableList,html);
    }
}


// 修改訂單狀態
function changeOrderStatus(item){
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`,item,{ headers:{
        "authorization":tokenID,
    }})
    .then((res)=>{
        console.log(res.data.orders);
        getOrderList();
        alert("已修改付款狀態");
    })
    .catch((err)=>{
        console.log(err.message);
    })
}
orderPageTableList.addEventListener("click",(e)=>{
    e.preventDefault();
    if(e.target.getAttribute("class") == "orderStatusBtn"){
        // 訂單 ID
        let orderID = e.target.getAttribute("data-id");
        //付款狀態
        let status = e.target.textContent;
        status == "已付款" ? status = false : status = true;
        let item = {
            "data": {
              "id": orderID,
              "paid": status
            }
          }
        //   console.log(item);
        changeOrderStatus(item);
    }
})



// 刪除全部訂單
// https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders
function deleteAllOrderList(){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`,{ headers:{
        "authorization":tokenID,
    }})
    .then((res)=>{
        // console.log(res.data);
        getOrderList();
        alert("已刪除所有訂單資料");
    })
    .catch((err)=>{
        console.log(err.message);
        alert("沒有任何訂單資料");
    })
}
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    // console.log(3);
    deleteAllOrderList();
})


// 刪除特定訂單
function deleteOneOrderList(id){
    axios.delete( `https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders/${id}`,{ headers:{
        "authorization":tokenID,
    }})
    .then((res)=>{
        getOrderList();
        alert("已刪除訂單資料");
    })
    .catch((err)=>{
        console.log(err.message);
    })
}
orderPageTableList.addEventListener("click",(e)=>{
    e.preventDefault();
    if(e.target.getAttribute("class") == "delSingleOrder-Btn"){
        let id = e.target.getAttribute("data-id");
        // console.log(id);
        deleteOneOrderList(id);
    }
})





// chart
//轉換成c3.js需要的格式
  // newData = [["高雄", 2], ["台北",1], ["台中", 1]]
//   let newData = [];
//   Object.keys(obj).forEach((item)=>{
//     let text = [item,obj[item]];
//     newData.push(text);
//   })
//   console.log(newData);
  
//   // 將 newData 丟入 c3 產生器  
//    const chart = c3.generate({
//     bindto: "#chart",
//     data: {
//       columns: newData,
//       type : 'donut',
//     },
//     donut: {
//       title: "套票地區比重"
//     }
//   });
function renderChart(){
    //資料轉換chart所需格式
    let categoryData = {};
    adminOrderData.forEach((e,i)=>{
        e.products.forEach((item,i)=>{
            categoryData[item.category] ? categoryData[item.category] += 1: categoryData[item.category] = 1;
        })
    })
    // console.log(categoryData);//{床架: 5, 窗簾: 1, 收納: 2}
    let chartData = [];
    productSelectCategory.forEach((e,i)=>{
        let arr = [];
        arr.push(e);
        arr.push(categoryData[e]);
        // console.log(e,categoryData[e]);
        chartData.push(arr);
    })
    console.log(chartData);
    let colorsData = {}
    let colors = ["#dacbff","#5434a7","#9d7fea"]
    productSelectCategory.forEach((e,i)=>{
        colorsData[e] = colors[i];
    })
    // console.log(colorsData);


    //render chart
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            columns: chartData, // 資料存放
            type:"pie", // 圖表種類
            colors: colorsData
        }
    });
}




