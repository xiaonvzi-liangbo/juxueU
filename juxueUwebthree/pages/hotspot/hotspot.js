const requestUrl = require('../../utils/request.js')
var app = getApp(); //获取应用实例

Component({
  pageLifetimes: {
    show() {
        this.getTabBar()
    }
  },
  data: {
    hot: [],
    cursor:"0",
    mygroup: [],
    visible: false,
    approve: false,
    pagenum: 1,
    result: [],
    clean: false,
    pages: 1,
    searinput: '',
    checkedNum: '',
    rzbid: '',
    limits: true,
    daindex1: 3,
    daindex2: 3,
    daindex3: 3,
    sort: [],
    access_token:'',
    navHeight: app.globalData.navHeight,
  },
  methods: {
    //子组件调用的父组件的方法
    checkNum(e) {
      this.setData({
        checkedNum: e.detail.checkedNum
      })
    },
    //用户授权
    accredit() {
      let that = this;
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          } else {
            that.setData({
              limits: false
            })
          }
        }
      })
    },
    //获取我加入的社团
    getMyst() {
      let that = this;
      let userid = wx.getStorageSync('userid')
      wx.request({
        url: requestUrl.requestUrl + '/jXAssociationApp/findByMyAssociationList',
        method: 'get',
        data: {
          userId: userid
        },
        header: {
          'content-type': 'application/json',
          "content-type": "application/x-www-form-urlencoded"
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              mygroup: res.data.data
            })
          }
        }
      })
    },
    //获取热门社团
    getHot() {
      let that = this;
      let userid = wx.getStorageSync('userid')
      wx.request({
        url: requestUrl.requestUrl + '/jXAssociationApp/findByAuto',
        method: 'get',
        data: {
          pageNum: that.data.pagenum,
          pageSize: '10',
          id: '2',
          userId: userid
        },
        header: {
          'content-type': 'application/json',
          "content-type": "application/x-www-form-urlencoded"
        },
        success(res) {
          if (that.data.pagenum=='1'){
            that.setData({
              hot: res.data.rows
            })
          }else{
            that.setData({
              hot: that.data.hot.concat(res.data.rows)
            })
          }
        }
      })
    },
    //热门社团新数组
    sortByKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key]; //如果要从大到小,把x,y互换就好
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    },
    //热门社团排序
    choosesort1: function (e) {
      let that = this
      if (that.data.daindex1 == 0) {
        that.setData({
          daindex1: 1,
          daindex2: 3,
          daindex3: 3,
          hot: that.sortByKey(that.data.hot, 'associationNumber').reverse()
        })
      } else {
        that.setData({
          daindex1: 0,
          daindex2: 3,
          daindex3: 3,
          hot: that.sortByKey(that.data.hot, 'associationNumber')
        })
      }
    },
    choosesort2: function (e) {
      let that = this
      if (this.data.daindex2 == 0) {
        this.setData({
          daindex2: 1,
          daindex1: 3,
          daindex3: 3,
          hot: that.sortByKey(that.data.hot, 'postsNumner').reverse()
        })
      } else {
        this.setData({
          daindex2: 0,
          daindex1: 3,
          daindex3: 3,
          hot: that.sortByKey(that.data.hot, 'postsNumner')
        })
      }
    },
    choosesort3: function (e) {
      let that = this
      if (this.data.daindex3 == 0) {
        this.setData({
          daindex3: 1,
          daindex1: 3,
          daindex2: 3,
          hot: that.sortByKey(that.data.hot, 'fabulousNumber').reverse()
        })
      } else {
        this.setData({
          daindex3: 0,
          daindex1: 3,
          daindex2: 3,
          hot: that.sortByKey(that.data.hot, 'fabulousNumber')
        })
      }
    },

    //加入社团点击事件
    join(e) {
      let that = this
      if (that.data.limits == false) {
        wx.showToast({
          title: '尚未登录，请立即登录！',
          icon: 'none',
          duration: 2000
        })
      } else {
        this.setData({
          rzbid: e.currentTarget.dataset.rzbid
        })
        this.setData({
            visible: true,
            
          })
      }
    },
    //点击进入我的社团
    entrance(e) {
      wx.navigateTo({
        url: '/pages/hotspot/myCommunity/myCommunity?id=' + e.currentTarget.dataset.id
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
          if (fun == "formSubmit") {
            that.formSubmit(e)
          }
        }
      })
    },
    //获取输入框内容
    expInput: function (e) {
      this.setData({
         
        cursor: e.detail.cursor

      })
    },
    //申请提交点击事件
    formSubmit(e) {
      let that = this;
      let err = '';
      let show = true;
     if (that.data.approve && !e.detail.value.signature) {
        err = "申请理由不能为空!"
      } else {
        show = false;
        let userid = wx.getStorageSync('userid')
        wx.request({
          url: requestUrl.requestUrl + '/jXAssociationApp/addPeople',
          method: 'post',
          data: {
            nickName: e.detail.value.name,
            collageId: that.data.checkedNum,
            major: e.detail.value.major,
            autograph: e.detail.value.signature,
            userId: userid,
            associationId: that.data.rzbid,
            accessToken: that.data.access_token 
          },
          header: {
            'content-type': 'application/json',
            "content-type": "application/x-www-form-urlencoded"
          },
          success(res) {
            if (res.data.code == '200') { 
            
              wx.showToast({
                title: '提交成功！',
                icon: 'none',
                duration: 2000
              });
              that.setData({
                visible: false,
                approve: false,
                pagenum:'1'
              })
              that.getHot()
            }else{
              wx.showToast({
                title: res.data.data,
                icon: 'none',
                duration: 2000
              });
            }
          },
        })
      }
      if (show) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    },
    //热门社团详情点击
    xiang(e) {
      let that = this
      if (that.data.limits == false) {
        wx.showToast({
          title: '尚未登录，请立即登录！',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: '/pages/hotspot/organization/organization?stid=' + e.currentTarget.dataset.id
        })
      }
    },
    //热门社团触底加载
    tolower() {
      let that = this;
      if (that.data.clean) {
        that.pages++;
        that.community()
      } else {
        that.data.pagenum++;
        that.getHot()
      }
    },
    close() {
      this.setData({
        visible: false
      })
    },
    //取消点击事件
    quxiao() {
      this.setData({
        clean: false
      })
    },
    //监听输入框输入事件
    commun(e) {
      this.setData({
        searinput: e.detail.value
      })
    },
    //搜索点击事件
    community() {
      let that = this;
      wx.request({
        url: requestUrl.requestUrl + '/jXAssociationApp/findByAuto',
        data: {
          associationName: that.data.searinput,
          pageNum: that.data.pages,
          pageSize: 10
        },
        header: {
          'content-type': 'application/json',
          "content-type": "application/x-www-form-urlencoded"
        },
        success(res) {
          that.setData({
            result: res.data.rows,
            clean: true
          })
        }
      })
    }
  },
  attached() {
    this.getMyst()
    this.getHot(), 
    this.accredit()
  }
})