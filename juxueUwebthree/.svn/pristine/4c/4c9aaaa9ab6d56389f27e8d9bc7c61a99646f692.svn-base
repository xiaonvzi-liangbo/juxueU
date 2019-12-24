// pages/prospects/welfare/welfare.js
import requestUrl from '../../../utils/request.js'
Page({
  /** * 页面的初始数据*/
  data: {
    show: true,
    cancel: false,
    showModel: false,
    ajxtrue: false,
    piece: [],
    phone: "",
    user: "",
    chuan: '',
    id: "",
    personsNum: '',
    timer: '', //定时器名字
    countDownNum: '60', //倒计时初始值,
    countshow: true,
  },
  //立即领取点击事件
  draw() {
    this.setData({
      showModel: true
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
  // 表单提交验证//提交领取信息
  formSubmit: function(e) {
    let that = this
    var val = e.detail.value.email;
    var name = e.detail.value.name;
    var college = e.detail.value.college;
    var verification = e.detail.value.verification
    var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

    if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(name))) {
      wx.showToast({
        title: '姓名不能为空！',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (college == "") {
        wx.showToast({
          title: '学院不能为空！',
          icon: 'none',
          duration: 2000
        })
      } else {
        if (this.data.ajxtrue == false) {
          wx.showToast({
            title: '手机号输入错误！',
            icon: 'none',
            duration: 2000
          })
        } else {
          if (verification.length <= 2) {
            wx.showToast({
              title: '验证码输入错误！',
              icon: 'none',
              duration: 2000
            })
          } else {
            if (reg.test(val)) {
              //提交领取信息
              wx.request({
                url: requestUrl.requestUrl + '/jxEmploymentApp/addBy',
                method: 'post',
                data: {
                  employmentEmail: val, //email
                  employmentMajor: college, //专业
                  employmentName: name, //接受邮件名称
                  employmentPhone: e.detail.value.phone, //手机号
                  id: that.data.id, //拼团id
                  verificationCode: e.detail.value.verification, //验证码
                },
                header: {
                  'content-type': 'application/json',
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success(res) {
                  wx.showToast({
                    title: '领取成功，请注意接收',
                    icon: 'none',
                    duration: 2000
                  })
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                }

              })
              this.setData({
                showModel: false
              })
            } else {
              wx.showToast({
                title: '邮箱输入错误！',
                icon: 'none',
                duration: 2000
              })
            }
          }
        }
      }
    }
  },
  //短信验证码发送
  message() {
    let that = this
    if (that.data.ajxtrue == false) {
      wx.showToast({
        title: '手机号输入错误！',
        icon: 'none',
        duration: 2000
      })
    } else {
      that.setData({
        countshow: false,
      })
      that.countDown();
      wx.request({
        url: requestUrl.requestUrl + '/jXSmsApp/add',
        method: 'post',
        data: {
          phone: that.data.phone,
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
        }
      })
    }

  },
  //关闭模态框
  occlude() {
    this.setData({
      showModel: false
    })
  },
  //创建
  create() {
    let that = this
    let userid = wx.getStorageSync('userid')
    let logo = wx.getStorageSync('logo')
    wx.request({
      url: requestUrl.requestUrl + '/jxEmploymentApp/findByAuto',
      method: 'post',
      data: {
        userId: userid,
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          piece: res.data.data,
          personsNum: 4 - res.data.data.length,
          chuan: res.data.data[0].userId
        })
        if (res.data.data.length == 4) {
          that.setData({
            show: false
          })
          for (let i = 0; i < that.data.piece.length; i++) {
            if (that.data.piece[i].employmentUserId == userid) {
              that.setData({
                id: that.data.piece[i].id
              })
            }

          }
        }
      }
    })

  },
  //创建拼团信息//邀请拼团成员
  pieces() {
    let that = this
    let userid = wx.getStorageSync('userid')
    let logo = wx.getStorageSync('logo')
    let employmentUserIds = []
    if (that.data.user == userid) {
      that.create()
    } else {
      //查询
      wx.request({
        url: requestUrl.requestUrl + '/jxEmploymentApp/findByAuto',
        method: 'post',
        data: {
          userId: that.data.user,
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          that.setData({
            piece: res.data.data,
            personsNum: 4 - res.data.data.length,
            chuan: res.data.data[0].userId
          })
          for (let i = 0; i < that.data.piece.length; i++) {
            employmentUserIds[i] = that.data.piece[i].employmentUserId
          }
          //邀请
          var a = employmentUserIds.indexOf(userid)
          if (a <= 0) {
            wx.request({
              url: requestUrl.requestUrl + '/jxEmploymentApp/addByPeople',
              method: 'post',
              data: {
                userId: that.data.user,
                employmentUserId: userid
              },
              header: {
                'content-type': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success(res) {
                that.create()
                wx.showToast({
                  title: res.data,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          }

          if (res.data.data.length == 4) {
            that.setData({
              show: false
            })
            for (let i = 0; i < that.data.piece.length; i++) {
              if (that.data.piece[i].employmentUserId == userid) {
                that.setData({
                  id: that.data.piece[i].id
                })
              }
            }
          }
        }
      })
    }

  },

  //分享
  onShareAppMessage: function(res) {
    let that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: "就业分析",
      path: '/pages/guidance/guidance?user=' + res.target.dataset.user,
      imageUrl:'/pages/images/employment-analysis.jpg'
    }
  },
  //计时器
  countDown: function() {
    let that = this;
    let countDownNum = that.data.countDownNum; //获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function() { //这里把setInterval赋值给变量名为timer的变量 //每隔一秒countDownNum就减一，实现同步
        countDownNum--; //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) { //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能//因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          that.setData({
            countshow: true,
            countDownNum: 60
          })
        }
      }, 1000)
    })
  },

  onLoad: function(options) {
    if (options.user == "undefined") {
      this.setData({
        user: wx.getStorageSync('userid')
      })
    } else {
      this.setData({
        user: options.user,
      })
    }

    this.pieces();
  },
})