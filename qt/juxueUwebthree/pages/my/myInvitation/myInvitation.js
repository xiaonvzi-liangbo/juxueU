// pages/my/myInvitation/myInvitation.js
var app = getApp(); //获取应用实例
import requestUrl from '../../../utils/request.js'
const time = require('../../../utils/time.js')
const quantity = require('../../../utils/quantity.js')
Page({

  /*** 页面的初始数据 */
  data: {
    pagenum: 1,
    showPost: false,
    userdata: [],
    mytime: '',
    associationName: '',
    
    navHeight: app.globalData.navHeight, 
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function(options) {
    this.userdata();
  },

  //自动刷新
  onShow() {
    this.setData({
      showCom: false
    });
    this.setData({
      showCom: true
    });
  },
  //点击发布帖子事件 
  post() {
    let renzheng = wx.getStorageSync('renzheng');
    if (renzheng) {
      wx.navigateTo({
        url: '/pages/universityCircle/article/article'
      })
    } else {
      wx.showToast({
        title: '请先去 "我的-认证中心" 进行认证',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //获取我的用户-我的贴子
  userdata: function() {
    var that = this;
    let userid = wx.getStorageSync('userid') 
    wx.request({
      url: requestUrl.requestUrl + '/jXUserApp/findByMyPosts',
      data: {
        id: userid,
      },
      header: {
        'content-type': 'application/json',
      },
      method: 'GET',
      success: function(res) {
        let information = res.data.data
        that.setData({
          userdata: information
        });
        if (res.data.data.associationName == null) {
          that.setData({
            associationName: "尚未认证"
          })
        } else {
          that.setData({
            associationName: res.data.data.associationName
          })
        }
      },
    })
  },
  // 删除我的贴子
  deldata: function(e) {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jXCollagePostsApp/deleteUpdatae',
      data: {
        id: e.currentTarget.id
      },
      method: 'post',
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          wx.showToast({
            title: '删除成功！',
            icon: 'none',
            duration: 2000
          });
          that.userdata()
        }
      },
    })
  },
  //帖子列表组件刷新
  refresh(){
    this.selectComponent("#article").getData()
  },
  //下拉刷新
  tolower() { 
    this.selectComponent("#article").tolower()
  }
})