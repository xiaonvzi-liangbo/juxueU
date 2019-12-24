import requestUrl from '../../utils/request.js'
const time = require('../../utils/time.js')
const quantity = require('../../utils/quantity.js')
Component({
  pageLifetimes: {
    show() { 
      this.getMy()
      this.accredit()
    }
  },
  data: {
    navcontent:[{
      id:"0",
      text:"签到",
      img:"../images/signIn.png",
      url:"/pages/my/signIn/signIn"
    }, {
        id: "1",
        text: "兑换",
        img: "../images/conversion.png",
        url: "/pages/my/conversion/conversion"
      }, {
        id: "2",
        text: "消息",
        img: "../images/integral.png",
        url: "/pages/my/private/private"
      }, {
        id: "3",
        text: "足迹",
        img: "../images/footprint.png",
        url: "/pages/my/footprint/footprint"
      }],
    navigations: [{
        id: '0',
        icon: 'cuIcon-qr_code',
        color: "#2b6cef",
        title: '小程序码'
      },
      {
        id: '1',
        icon: 'cuIcon-vip',
        color: "#000",
        title: '认证中心',
        linkUrl: '/pages/my/authentication/authentication'
      },
      {
        id: '2',
        icon: 'cuIcon-text',
        color: "#000",
        title: '我的帖子',
        linkUrl: '/pages/my/myInvitation/myInvitation'
      },
      {
        id: '3',
        icon: 'cuIcon-favor',
        color: "#000",
        title: '我的收藏',
        linkUrl: '/pages/my/collect/collect'
      },
      {
        id: '4',
        icon: 'cuIcon-copy',
        color: "#000",
        title: '意见反馈',
        linkUrl: '/pages/my/feedback/feedback'
      },
      {
        id: '5',
        icon: 'cuIcon-service',
        color: "#000",
        title: '联系客服',
        linkUrl: ''
      },
      {
        id: '6',
        icon: 'cuIcon-discover',
        color: "#000",
        title: '用户须知',
        linkUrl: '/pages/my/convention/agreement/agreement'
      },
    ],
    twoDimension: '',
    visible: false,
    mine: [],
    collageName: '',
    showCom: true,
    loginshow: true,
    limits: true,
    collage: true,
    touxiang: '/pages/images/touxiang.jpg',
    log: '',
    niname: '',
    switchingtxt: [],
    associationId: [],
    picker: false,
    poindex: '0',
    isread: false,
  },
  methods: {
    //点击授权
    getUserInfo(e) {
      let that = this
      if (e.detail.errMsg === "getUserInfo:ok") {
        let sessionKey = wx.getStorageSync('sessionKey')
        let openid = wx.getStorageSync('openid')
        // 添加用户
        wx.request({
            url: requestUrl.requestUrl + '/jXUserApp/authorization',
            method: 'post',
            data: {
              openId: openid,
              nickName: e.detail.userInfo.nickName,
              logo: e.detail.userInfo.avatarUrl,
              country: e.detail.userInfo.country,
              province: e.detail.userInfo.province,
              city: e.detail.userInfo.city
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            success(res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '授权成功',
                  icon: 'none',
                  duration: 2000,
                })
                wx.setStorageSync('userid', res.data.data.id)
                wx.setStorageSync('quanxian', res.data.openId);
                that.getMy()
                that.setData({
                  loginshow: true,
                  limits: true,
                })
              } else {
                wx.showToast({
                  title: '授权失败!',
                  icon: 'none',
                  duration: 2000,
                })
                that.setData({
                  loginshow: false,
                  limits: false,
                })
              }
            }
          }),
          wx.request({
            url: requestUrl.requestUrl + '/jj/weChat/jm',
            method: 'POST',
            data: {
              encryptedData: e.detail.encryptedData,
              errMsg: sessionKey,
              iv: e.detail.iv
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            success(res) {
              that.setData({
                userinfo: e.detail.userInfo,
                but: false,
                button: true
              })
              wx.setStorageSync('uid', res.data.unionId)
            }
          })
      }
    },
    //用户授权
    accredit() {
      let that = this;
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            that.setData({
              loginshow: true,
              limits: true,
            })
          } else {
            that.setData({
              limits: false,
              loginshow: false,
            })
          }
        }
      })
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
            wx.setStorageSync('nickName', res.data.data.nickName)
            wx.setStorageSync('collageName',   res.data.data.collageName + '-' + res.data.data.collageCampus)
            wx.setStorageSync('associationId', res.data.data.associationId)
            if (res.data.data.collageName == null) {
              that.setData({
                collageName: "尚未认证"
              })
            } else {
              that.setData({
                collageName: res.data.data.collageName
              })
            }
            if (res.data.data.associationId == '') {
              wx.setStorageSync('renzheng', false)
            } else {
              wx.setStorageSync('renzheng', true)
            }
          }
        }
      })
    },
    //获取认证信息
    switching() {
      let that = this;
      let userid = wx.getStorageSync('userid');
      wx.request({
        url: requestUrl.requestUrl + '/jXAssociationApp/findByUserId',
        method: 'get',
        data: {
          userId: userid
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          that.setData({
            picker: true,
          })
          for (let i = 0; i < res.data.rows.length; i++) {
            let swit = 'switchingtxt[' + i + ']'
            let associationId = 'associationId[' + i + ']'
            if (res.data.rows[i].associationType == '0') {
              if (res.data.rows[i].collageName == null) {
                that.setData({
                  [swit]: "尚未认证"
                })
              } else {
                that.setData({
                  [swit]: res.data.rows[i].collageName + '-' + res.data.rows[i].campus,
                  [associationId]: res.data.rows[i].id
                })
              }

            } else if (res.data.rows[i].associationType == '2') {
              if (res.data.rows[i].collageName == null) {
                that.setData({
                  [swit]: "尚未认证"
                })
              } else {
                that.setData({
                  [swit]: res.data.rows[i].collageName,
                  [associationId]: res.data.rows[i].id
                })
              }

            } else {
              that.setData({
                [swit]: res.data.rows[i].associationName,
                [associationId]: res.data.rows[i].id
              })
            }
          };


        }
      })
    },
    //选择认证xiugai
    bindPickerChange: function(e) {
      let that = this
      let userid = wx.getStorageSync('userid');
      this.setData({
        poindex: e.detail.value,
        picker: false,

      })
      wx.request({
        url: requestUrl.requestUrl + '/jXUserApp/update',
        method: 'post',
        data: {
          id: userid,
          associationId: that.data.associationId[e.detail.value]
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success() {
          that.getMy()
        }
      })
    },
    //前往页面点击事件
    leaveFor(e) {
      let renzheng = wx.getStorageSync('renzheng');
      let that = this
      if (that.data.limits == false) {
        wx.showToast({
          title: '尚未登录，请立即登录！',
          icon: 'none',
          duration: 2000
        })
      } else {
        if (that.data.navigations.id == 2) {
          if (renzheng) {
            wx.navigateTo({
              url: e.currentTarget.dataset.url
            })
          } else {
            wx.showToast({
              title: '请先去 "我的-认证中心" 进行认证',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.navigateTo({
            url: e.currentTarget.dataset.url,
          })
        }

      }
    },
    //修改资料点击事件 
    compile(e) {
      wx.navigateTo({
        url: '/pages/my/amend/amend?img=' + e.currentTarget.dataset.img,
      })
    },

    //分享图片事件处理
    shower: function() {
      let that = this
      let phone = wx.getStorageSync('phone')
      if (that.data.limits == false) {
        wx.showToast({
          title: '尚未登录，请立即登录！',
          icon: 'none',
          duration: 2000
        })
      } else {
        this.setData({
          visible: true
        })

      }
    },
    close: function() {
      this.setData({
        visible: false
      })
    },
  },
  attached() {
    this.switching()
    this.accredit()
    this.getMy()

  }
})