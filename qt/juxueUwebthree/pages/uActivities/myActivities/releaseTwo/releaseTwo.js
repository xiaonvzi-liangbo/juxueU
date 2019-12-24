// pages/uActivities/myActivities/releaseTwo/releaseTwo.js
import requestUrl from '../../../../utils/request.js' 


Page({

  data: {
    activity_start_time: '',
    activity_end_time: '',
    enlist_end_time: '',
    disabled: false, //设置是否能点击 false可以 true不能点击
    startDate: '',
    endDate: '2099-03-12',
    gettitle: '',
    checkedNum: '',
    bgimg: '',
    phone: '',
    access_token: ''

  },
  onLoad: function(options) {
    this.time()
    this.setData({
      checkedNum: options.checkedNum,
      gettitle: options.gettitle,
      bgimg: options.bgimg
    })
  },
  // 表单手机号
  blurPhone: function(e) {
    var phone = e.detail.value;
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({
        ajxtrue: false
      })
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号输入错误！',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      this.setData({
        ajxtrue: true,
        phone: phone
      })
    }
  },
  // 获取当前时间
  time() {
    let dd = new Date();
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期
    var d = dd.getDate();
    var h = dd.getHours(); //获取当前小时数(0-23)
    var min = dd.getMinutes(); //获取当前分钟数(0-59)
    var s = dd.getSeconds(); //获取当前秒数(0-59) 
    let mytime = y + "-" + m + "-" + d; //获取当前时间
    this.setData({
      startDate: mytime
    })
  },
  /*** 日历控件绑定函数 * 点击日期返回*/
  startTime: function(e) {
    var nextDate = e.detail.dateString;
    var myDate = new Date(Date.parse(nextDate.replace(/-/g, "/")))
    let date = new Date(myDate)
    this.setData({
      activity_start_time: date
    })
  },
  endTime: function(e) {
    var nextDate = e.detail.dateString;
    var myDate = new Date(Date.parse(nextDate.replace(/-/g, "/")))
    let date = new Date(myDate)
    this.setData({
      activity_end_time: date
    })

  },
  enlistTime: function(e) {
    var nextDate = e.detail.dateString;
    var myDate = new Date(Date.parse(nextDate.replace(/-/g, "/")))
    let date = new Date(myDate)
    this.setData({
      enlist_end_time: date
    })
  },
  //获取accessToken
  accessToken(e) {
    let that = this
    let fun = e.currentTarget.dataset.fun
    wx.request({
      url: requestUrl.requestUrl + '/jj/weChat/getAccessToken',
      method: "get",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success(res) {
        that.setData({
          access_token: res.data.data
        })
        if (fun == "release") {
          that.release(e)
        }
      }
    })
  },
  //点击发布事件
  release(e) {
    let that = this
    let userid = wx.getStorageSync('userid')
    if (e.detail.value.undertake == '' || that.data.activity_start_time == '' || that.data.activity_end_time == '' || e.detail.value.enlistAddress == '' || e.detail.value.people == '' || that.data.enlist_end_time == '' || e.detail.value.info == '' || that.data.phone=='') {
      wx.showToast({
        title: '有必填项未填写或手机号填写不正确',
        icon: 'none',
        duration: 2000,
      })
    } else {
      wx.request({
        url: requestUrl.requestUrl + '/jxActivityMainApp/addBy',
        method: 'post',
        data: {
          theme: that.data.gettitle,
          collageId: that.data.checkedNum,
          undertake: e.detail.value.undertake,
          host: e.detail.value.host,
          activityAddress: e.detail.value.activity_address,
          createrId: userid,
          activityStartTime: that.data.activity_start_time,
          activityEndTime: that.data.activity_end_time,
          enlistAddress: e.detail.value.enlistAddress,
          enlistContact: e.detail.value.people + ',' + that.data.phone,
          enlistEndTime: that.data.enlist_end_time,
          info: e.detail.value.info,
          img: that.data.bgimg,
          accessToken: that.data.access_token 
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
        if(res.data.code==200){
          wx.showToast({
            title: '发布成功',
            icon: 'none',
            duration: 2000,
          })
          wx.navigateBack({
            delta: 2
          })
        }

        }
      })
    }

  }

})