import requestUrl from '../../../utils/request.js'
/**
 * 立即签到可能有bug需要数据进行测试
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    sign: [{
        id: '0',
        checked: false,
        toSign: true,
        seven: false,
        money: '18'
      }, //checked:控制是否选中  toSing：控制未选中的状态 
      {
        id: '1',
        checked: false,
        toSign: true,
        seven: false,
        money: '28'
      }, //seven：控制礼包是否显示
      {
        id: '2',
        checked: false,
        toSign: true,
        seven: false,
        money: '38'
      },
      {
        id: '3',
        checked: false,
        toSign: true,
        seven: false,
        money: '58'
      },
      {
        id: '4',
        checked: false,
        toSign: true,
        seven: false,
        money: '68'
      },
      {
        id: '5',
        checked: false,
        toSign: true,
        seven: false,
        money: '88'
      },
      {
        id: '6',
        checked: false,
        toSign: false,
        seven: true,
        money: '188'
      }
    ],
    signInfor: 1,
    signnumber: '',
    already: false,
    missionInfo: [],
    showPost: 'none',
    twoDimension: '',
    visible: false,
    imgs: []
  },
  //前往页面点击事件
  leaveFor(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
    wx.switchTab({
      url: e.currentTarget.dataset.url,
    })
  },

  //积分兑换点击事件
  conversion() {
    wx.navigateTo({
      url: '/pages/my/conversion/conversion',
    }) 
  },
  //获取签到天数
  signNumber: function () {
    let that = this
    let userid = wx.getStorageSync('userid');
    wx: wx.request({
      url: requestUrl.requestUrl + '/jXSignInApp/findByContinuity',
      data: {
        userId:userid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          imgs: res.data.data,
          signnumber: res.data.number,
          signInfor: 7 - res.data.number
        })
      },

    })
  },
  //获取今天是否已签到
  signAlready() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXSignInApp/findByNow',
      data: {
        userId: userid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          if (res.data.data==1){
            that.setData({
              already: false
            })
          } else {
            that.setData({
              already: true
            })}
          
        }
      }
    })
  },
  //立即签到点击事件
  sign(e) {
    let that = this;
    let index = e.currentTarget.dataset.signs;
    let userid = wx.getStorageSync('userid');
    let integra = that.data.sign[index].money;


    wx.request({
      url: requestUrl.requestUrl + '/jXSignInApp/add',
      method: 'POST',
      data: {
        integralType: '签到',
        userId: userid,
        integralNumber: integra,
          integralId: that.data.signnumber+1
       //获取的积分数
        // integralNumber: integra
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          if (index < 6) {
            that.selectComponent('#hint').show();
          } else if (index == 6) {
            that.selectComponent('#hint2').show();
          };
          that.signNumber()
          that.setData({
            already:false
          })
        }
      }
    })
  },
  //积分任务详情
  mission() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXSignInApp/findByTask',
      data: {
        userId:userid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            missionInfo: res.data.data
          })
        }
      }
    })
  },
  //
  //分享图片事件处理
  shower: function() {
    this.setData({
      visible: true
    })
    this.selectComponent("#share").getMy();
  },
  close: function() {
    this.setData({
      visible: false
    })
  },
   block() {
    let that = this
    that.setData({
      showPost: 'block'
    })
  },
  onLoad() {
    let that = this
    that.signNumber();
    that.mission();
    that.signAlready()
  }
})