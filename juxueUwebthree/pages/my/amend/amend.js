import requestUrl from '../../../utils/request.js'
Page({

  /*** 页面的初始数据*/
  data: {
    checkedNum: '',
    img: '',
    mine: [],
    collageName: ''
  },
  //获取我的信息
  getMy() {
    let that = this;
    let userid = wx.getStorageSync('userid')
    wx.request({
      url: requestUrl.requestUrl + '/jXUserApp/findByMy',
      method: 'get',
      data: {
        id: userid
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          that.setData({
            mine: res.data.data,
          });
          if (res.data.data.collageName == null) {
            that.setData({
              collageName: "尚未认证"
            })
          } else {
            that.setData({
              collageName: res.data.data.collageName + '-' + res.data.data.collageCampus
            })
          }

        }
      }
    })
  },
  //子组件调用父组件的值
  checkNum(e) {
    this.setData({
      checkedNum: e.detail.checkedNum,
    })
  },
 
  //保存点击事件
  formSubmit(e) {
    let that = this; 
    let userid = wx.getStorageSync('userid');
 
    wx.request({
      url: requestUrl.requestUrl + '/jXUserApp/update',
      method: 'post',
      data: {
        nickName: e.detail.value.name,
        autograph: e.detail.value.js,
        collageId: that.data.checkedNum,
        majorId: e.detail.value.zy,
        id: userid,
        logo: that.data.img,
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          wx.setStorageSync('nickName', e.detail.value.name);  
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
   

  },
  onLoad(options) {
    this.getMy()
    this.setData({
      img: options.img
    })
  }
})