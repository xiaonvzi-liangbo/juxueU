// pages/components/navigation/navigation.js
var app = getApp(); //获取应用实例
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imags: { //后退
      type: String,
      value: '/pages/images/ht.png',
    },
    dome: { //标题
      type: String,
      value: '',
    },
    bottom: { //标题颜色
      type: String,
      value: '10rpx',
    },
    show: {
      type: Boolean,
      value: true
    },
    vishow: {
      type: Boolean,
      value: true
    },
    back: {
      type: Boolean,
      value: true
    },
    opacity: {
      type: String,
      value: '1',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navHeight: app.globalData.navHeight,
    navTop: app.globalData.navTop,
    line: app.globalData.line,
    top: app.globalData.top
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back(e) {
      if (e.currentTarget.dataset.url) {
        wx.navigateBack({
          delta: 1
        })
      }
    }
  }
})