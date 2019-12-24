// pages/uActivities/details/details.js
var app = getApp(); //获取应用实例
const requestUrl = require('../../../utils/request.js')
const number = require('../../../utils/quantity.js')
const time = require('../../../utils/time.js')
Page({
  data: {
    imgUrl: '',
    id: '',
    context: [],
    currentTab: '0',
    pageNum: '1',
    pages: '1',
    onelist: [],
    twolist: [],
    showReply: false,
    oneId: '',
    oneinfo: '',
    twoinfo: '',
    collection: false,
    activityStartTime: '',
    activityEndTime: '',
    enlistEndTime: '',
    access_token: '',
    creater: false,
    navHeight: app.globalData.navHeight,
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.getdetails()
    this.getOnelist()
  },
  //点击切换页面
  attention(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.number,
    })
  },
  //活动报名点击事件
  signUp() {
    let that = this
    let userid = wx.getStorageSync('userid')
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/addActivityMainPeople',
      data: {
        userId: userid,
        activityId: that.data.id
      },
      method:"post",
      header: {
        'content-type': 'application/json',
        "content-type": "application/x-www-form-urlencoded"
      },
      success(res) {
      if(res.data.code==200){
        wx.showToast({
          title: '报名成功',
          icon: "none",
          duration: 2000,
        })
      }else{
        wx.showToast({
          title:res.data.data,
          icon: "none",
          duration: 2000,
        })
      }
      }
    })
  },
  //获取活动内容
  getdetails() {
    let that = this
    let userid = wx.getStorageSync('userid')

    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/findByDetails',
      data: {
        createrId: userid,
        id: that.data.id
      },
      header: {
        'content-type': 'application/json',
        "content-type": "application/x-www-form-urlencoded"
      },
      success(res) {
        let date = res.data.data;
        let activityStartTime = date.activityStartTime
        let activityEndTime = date.activityEndTime
        let enlistEndTime = date.enlistEndTime
        that.setData({
          context: res.data.data,
          activityStartTime: activityStartTime.substring(0, 10),
          activityEndTime: activityEndTime.substring(0, 10),
          enlistEndTime: enlistEndTime.substring(0, 10),
        })
        if (res.data.data.isCollection == 0) {
          that.setData({
            collection: false
          })
        } else {
          that.setData({
            collection: true
          })

        }
        if (res.data.data.createrId == userid) {
          that.setData({
            creater: true
          })
        }
      }
    })
  },
  /** * 用户分享自定义 */
  onShareAppMessage: function(ops) {
    let userid = wx.getStorageInfo('userid');
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
  },
  //发帖人详情
  personage(e) {
    wx.navigateTo({
      url: '/pages/universityCircle/myPost/myPost?id=' + e.currentTarget.dataset.id,
    })
  },
  //获取一级评论内容
  getOnelist() {
    let that = this
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/findOneList',
      data: {
        pageNum: that.data.pageNum,
        pageSize: '10',
        activityId: that.data.id
      },
      header: {
        'content-type': 'application/json',
        "content-type": "application/x-www-form-urlencoded"
      },
      success(res) {
        let date = res.data.rows;
        // 数量,时间的处理
        for (let i = 0; i < date.length; i++) {
          date[i].createTime = time.getDateDiff(date[i].createTime);
        }
        if (that.data.pageNum == '1') {
          that.setData({
            onelist: date
          })
        } else {
          that.setData({
            onelist: that.data.onelist.concat(date)
          })
        }
      }
    })
  },
  //消息回复点击事件
  getTwolist(e) {
    this.setData({
      oneId: e.currentTarget.dataset.oneid
    });
    this.write()
  },
  //获取二级评论内容
  write() {
    let that = this;
    let userid = wx.getStorageSync('userid')
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/findTwoList',
      data: {
        oneId: that.data.oneId,
        pageNum: that.data.pages,
        pageSize: '10'
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        let date = res.data.rows;
        // 数量,时间的处理
        for (let i = 0; i < date.length; i++) {
          date[i].createTime = time.getDateDiff(date[i].createTime);
        }
        if (that.data.pages == '1') {
          that.setData({
            twolist: res.data.rows
          })
        } else {
          that.setData({
            twolist: that.data.twolist.concat(res.data.rows)
          })
        }
      }
    })
    that.setData({
      showReply: true
    })
  },
  //消息回复关闭点击事件
  close() {
    this.setData({
      showReply: false
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
        if (fun == "sendTwolist") {
          that.sendTwolist(e)
        } else if (fun == 'sendOnelist') {
          that.sendOnelist()
        }
      }
    })
  },
  //输入框失去焦点
  assignment(e) {
    let that = this
    that.setData({
      oneinfo: e.detail.value
    })
  },
  //发送一级评论
  sendOnelist(e) {
    let that = this
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/addByOne',
      data: {
        activityId: that.data.id,
        info: that.data.oneinfo,
        userId: userid,
        accessToken: that.data.access_token
      },
      method: 'post',
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          that.setData({
            oneinfo: '',
            pageNum: "1"
          })
          that.getOnelist();
        }
      }
    })
  },
  transmit(e) {
    this.setData({
      twoinfo: e.detail.value
    })
  },
  //发送二级评论
  sendTwolist(e) {
    let that = this
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/addByTwo',
      data: {
        oneId: that.data.oneId,
        info: that.data.twoinfo,
        twoUserId: userid,
        accessToken: that.data.access_token
      },
      method: 'post',
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          that.setData({
            twoinfo: '',
            pages: '1'
          })
          that.write();
        }
      }
    })
  },
  //收藏
  collection() {
    let that = this
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jxActivityMainApp/addByCollection',
      data: {
        collectionId: that.data.id,
        userId: userid
      },
      method: 'post',
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          if (res.data.data == '删除成功') {
            wx.showToast({
              title: '删除收藏成功',
              icon: "none",
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '添加收藏成功',
              icon: "none",
              duration: 2000
            })
          }

          that.setData({
            twoinfo: ''
          })
          if (that.data.collection == true) {
            that.setData({
              collection: false
            })
          } else {
            that.setData({
              collection: true
            })
          }

          let pages = getCurrentPages();
          console.log(pages)
          if (pages[pages.length - 2].route == "pages/uActivities/collect/collect") {
            pages[pages.length - 2].getcollect(); //异步同步
          }
        }
      }
    })
  },
  //页面跳转
  navigata(e) {
    let that=this
    wx.navigateTo({
      url: '/pages/uActivities/application/application?activityId='+that.data.id,
    })
  },
  //上拉加载
  tolower() {
    let that = this
    if (that.data.showReply == false) {
      this.data.pageNum++;
      this.getOnelist()
    } else {
      console.log("4646")
      this.data.pages++;
      this.write()
    }
  }
})