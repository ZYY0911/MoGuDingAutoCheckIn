/*
 * @Author: XiaoKang
 * @Date: 2020-11-06 16:27:11
 * @LastEditTime: 2020-11-06 21:15:34
 * @Description: 蘑菇丁签到入口文件
 */
let axios = require("axios");
let login = require("./components/login");
let getPlanId = require("./components/planId");
let save = require("./components/save");
let remind = require("./components/remind");
let daily = require("./components/daily")
// 传入运行的参数
var args = process.argv.splice(2);
if (args.length < 3) {
  console.log("参数传入不正确！");
  return;
}
// 用户相关配置
let config = {
  // 用户手机号
  phone: args[0],
  // 用户密码
  password: args[1],
  // server酱密钥
  SCKEY: args[2],
  // 用户TOKEN
  token: args[3] || false,
};
let reMindMsg = {
  // 消息标题
  text: "❌ 蘑菇丁签到失败了，请检查 ❌",
  // 消息主体
  desp: "请检查账号密码或Token（如果存在）是否失效。其他问题请联系ZYY0911！",
};
const data = new Date();
// 基地址
axios.defaults.baseURL = "https://api.moguding.net:9000";
(async function () {
  // 登录获取TOKEN
  const token = await login(axios, config);
  // 如果TOKEN获取成功
  if (token) {
    axios.defaults.headers.Authorization = token;
    // 获取需要签到的项目 - 最后一项
    const planId = await getPlanId(axios);
    // 签到结果
    const result = await save(axios, planId);
    if (result) {
      let dayStatus = await daily(axios, planId);
      if (dayStatus) {
        if (dayStatus != "OUTTIME") {
          // 签到成功 日报成功 发消息提示
          reMindMsg.text =
              `🎉 ${data.getFullYear()}年${data.getMonth() + 1}月${data.getDate()}日 
                        【的蘑菇丁每日签到成功！日报：${dayStatus}！！！！！！】 🎉`;
          reMindMsg.desp = `的蘑菇丁每日签到成功，日报：${dayStatus}！！！！！！`;
          //       msg ______    发送消息
          let msg = await remind(axios, config, reMindMsg);
          console.log(msg);
        } else {
          console.log(`日报不执行，不在用户设置的日报时间段内！`)
        }
      } else {
        reMindMsg.text = `🎉 ${data.getFullYear()}年${
          data.getMonth() + 1
        }月${data.getDate()}日${data.getHours()}时 蘑菇丁签到成功啦！ 🎉`;
        reMindMsg.desp = "恭喜你蘑菇丁签到成功了！";
        //       msg ______    发送消息
        let msg = await remind(axios, config, reMindMsg);
        console.log(msg);
      }
      // sleep(2000)
      // try {
      //   const weeksResult = await weeks(axios, planId)
      //   if (weeksResult) {
      //     if (weeksResult != "OUTTIME") {
      //       reMindMsg.text = `🎉 ${data.getFullYear()}年${data.getMonth() + 1}月${data.getDate()}日 蘑菇丁的${weeksResult}】 🎉`;
      //       reMindMsg.desp = `的周报：${weeksResult}`;
      //       //       msg ______    发送消息
      //       await resendMsg(axios, loginInfo, reMindMsg);
      //     }
      //   } else {
      //     reMindMsg.text = `🎉 ${data.getFullYear()}年${data.getMonth() + 1}月${data.getDate()}日 蘑菇丁的周报${weeksResult}】 🎉`;
      //     reMindMsg.desp = `的周报：错误！`;
      //     //       msg ______    发送消息
      //     await resendMsg(axios, loginInfo, reMindMsg);
      //   }
      // } catch (error) {
      //   throw `【周报】异常异常信息:${error}`
      // }
    }
    return true;
  } else {
    return;
  }
})();
