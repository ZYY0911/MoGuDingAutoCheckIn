let contextTexts = require("../components/contextText")

/*
 * @Author: KKDLK
 * @Date: 2020-11-16 02:15
 * @LastEditTime: 2020-11-16 02:15:23
 * @Description: 开始执行日报
 */
   


// 日报方法
async function daily (axios, planId) {
  let thisTime = new Date();
  if (thisTime.getHours()==0) { 
    let contentTxt = '当前状态：在岗\n健康状况：健康\n今日收获：'+contextTexts(2); // 获取内容 日报2遍长度就够了
    let dayTitle = thisTime.getFullYear()+"年"+(thisTime.getMonth()+1)+"月"+thisTime.getDay()+"日，日报";
    let dataForm = {
      attachmentList: [],
      attachments: "",
      content: contentTxt, //日报内容
      planId: planId,
      reportType: "day",
      title: dayTitle //日报标题  上班或休假 每周有2天休假的时间
    }
    try {
      // 发送日报签到请求
      let { data: res } = await axios.request({
        method: "post",
        url: "/practice/paper/v1/save",
        data: dataForm,
      });
      if (res.code == 200) {
        console.info(`--------SUCCESS---------日报成功`)
        return contentTxt;
      } else{
          // 异常
        return false;
      }
    } catch (error) {
      console.log(`-----------ERROR--------每日日报失败，再次尝试`);
      daily (axios, planId,loginInfo)
    }
  } else {
    console.warn(`--------Wraing---------不在8点，不写日报`)
    // 超过早上八点 不写日报
    return "OUTTIME";
  }
}


// 周几当前
function getWeekDate() {
  var now = new Date();
  var day = now.getDay();
  var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
  var week = weeks[day];
  return week;
}     
//判断当前时间 双休休假
function titleWeekend(){
   let thisDate = new Date(); // 当前时间

   let thisWeekDate = getWeekDate();
   if (thisWeekDate=='星期日'||thisWeekDate=='星期六'){
       return "休假";
   }
   return "上班";
}





module.exports = daily;