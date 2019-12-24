import requestUrl from '../../utils/request.js'
var app = getApp(); //获取应用实例
// pages/home/home.js
Page({

  /** * 页面的初始数据*/
  data: {
    current: 'mine',
    title: "",
    show: false,
    isread: false,
    attentionID: "",
    attentionName: "",
    topicsName: "",
    topicsID: "",
    associationId:'',
    back:false,
    navHeight: app.globalData.navHeight,
  },
  //底部导航栏
  handleChange(e) {
    let key = e.currentTarget.dataset.key 
    this.setData({
      current: e.currentTarget.dataset.key
    });
    if (key == 'index') {
      this.setData({
        title: "聚学U-大学生",
        show: true
      })
    } else if (key == 'hotspot') {
      this.setData({
        title: "社团",
        show: true
      })
    } else if (key == 'announce') {
      this.setData({
        title: "发布",
        show: true,
      })
    } else if (key == 'uActivities') {
      this.setData({
        title: "U活动",
        show: true,
      }) 
    } else if (key == 'mine') {
      this.setData({
        show: false
      })

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {  
  },

  //点击跳转页面
  navpage(e) {
    let that = this
    if (that.data.limits == false) {
      wx.showToast({
        title: '尚未登录，请立即登录！',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.linkurl,
      })

    }
  },
 

  //组件事件调用
  invoke(e) {
    let that = this
    if (that.data.current == 'announce') {
      let aiticle = this.selectComponent('#aiticle'); // 页面获取自定义组件实例
      aiticle.invoke(); // 通过实例调用组件事件
    }  
  },
  getMy() {
    this.selectComponent("#mine").getMy();
  },
  accredit() {
    this.selectComponent("#mine").accredit();
  },
  hotspot() {
    this.selectComponent("#hotspot").getMyst()
    this.selectComponent("#hotspot").getHot()
    this.selectComponent("#uActivities").tolower()
  },
  hotspots() {
    this.selectComponent("#hotspot").getMyst()
    this.selectComponent("#hotspot").getHot()
  },
})