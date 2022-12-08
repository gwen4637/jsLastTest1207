const apiPath = "20221205gwen4637lasttest";
const tokenID = "XQ2bAPS0yAcvm5Z6oToGmm1GiIP2";
let productSelectCategory = ["床架","收納","窗簾"];

//**renderHtml function
function renderHtml(dom,html){
    dom.innerHTML = html;
}


//年份日期
function getTime(times){
    let date = new Date(times*1000);
    console.log(date);
    let year = date.getFullYear();//得到年分
    let month = date.getMonth() + 1;//月份是從0-11，記得+1
    let dates = date.getDate();//得到日期
    
    let nowTime = ` ${year}/${month}/${dates}`;
    // console.log(nowTime);
    return nowTime;
  }

