// pages/uActivities/uActivities.js
import requestUrl from '../../utils/request.js'
const time = require('../../utils/time.js')
const quantity = require('../../utils/quantity.js')
var app = getApp(); //获取应用实例
Component({
options:{
  addGlobalClass: true
},
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true, //轮播指示点
    interval: 5000, //切换时间
    duration: 1000, //动画时长
    searinput: '',
    clean: false,
    result: [],
    pages: '1',
    navHeight: app.globalData.navHeight,
  },

  methods: {
    //页面跳转
    navigate(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    },
    //监听输入框输入事件
    commun(e) {
      this.setData({
        searinput: e.detail.value,
        pages:'1'
      })
    },
    //搜索点击事件
    community() {
      let that = this;
      wx.request({
        url: requestUrl.requestUrl + '/jxActivityMainApp/findByLikeCollageName',
        data: {
          collageName: that.data.searinput,
          pageNum: that.data.pages,
          pageSize: 10
        },
        header: {
          'content-type': 'application/json',
          "content-type": "application/x-www-form-urlencoded"
        },
        success(res) {
          if (that.data.pages=='1'){
           that.setData({
             result: res.data.rows,
             clean: true
           })
         }else{
           that.setData({
             result: that.data.result.concat(res.data.rows),
             clean: true
           })
         }
        }
      })
    },
    //取消点击事件
    quxiao() {
      this.setData({
        clean: false
      })
    },
    //下拉加载
    strike() {
      let that = this
      if (that.data.clean == true) {
        that.data.pages++
          that.community()
      } else(
        that.selectComponent("#hotact").tower()
      )
    },
    //首页轮播图
    images() {
      let that = this
      wx.request({
        url: requestUrl.requestUrl + '/jXPictureManageApp/findByAutoFrom',
        data: {
          pageSize: 1,
          pageNum: 1,
          pmId: 19,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json',
          "content-type": "application/x-www-form-urlencoded"
        },
        success(res) {
          that.setData({
            imgUrls: res.data.rows
          })
        }
      })
    }
  },
  attached() {
    this.images()
  }

})