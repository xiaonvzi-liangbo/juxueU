import requestUrl from '../../../utils/request.js'
import myPlugin from '../../plugin/index.js'
import md5 from '../../../utils/md5.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teachersDetails: [],
    title: '',
    definitionsKey: {
      'same': '原画',
      '720p': '超清',
      '480p': '高清',
      '360p': '标清',
      'a': '纯音频'
    },
    msg: '',
    timeMsg: '',
    currentTime: '0',
    screenStatus: '',
    showSource: false,
    showLine: false,
    selectType: 'other',
    videoUrl: '',
    showTool: false,
    liveConfig: ''
  },

  /** * 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    let that = this;
    that.details(options.id)
    that.setData({
      title: options.title
    })
  },
  //微吼的视频路径
  getPlaySource(source) {
    let playInfo = source.detail;
    playInfo.sourceInfo.qualiTypes.sort().reverse();
    this.setData({
      playInfo: playInfo
    });
    this.setData({
      msg: JSON.stringify(playInfo)
    });
  },
  //vhall处理错误事件
  errorFn(e) {
    wx.showToast({
      title: e.detail.msg,
      icon: 'none',
      duration: 2000
    });
    this.setData({
      msg: JSON.stringify(e.detail)
    });
  },

  //sign生成过程
  createSign() {
    let that = this
    //时间戳
    let unix = String(Math.round(new Date().getTime() / 1000));
    let uid = wx.getStorageSync('uid');

    let liveConfig = that.data.liveConfig;
    let roomid = liveConfig.substring(liveConfig.lastIndexOf("/")+1);
    //参与计算的参数（参数名按照升序排列）
    var app = getApp();
    let $params = {
      "account": '15376403705',
      "app_key": 'ad493af2fdc36bffbd8515554c85ab8e',
      "roomid": roomid,
      "signedat": unix,
      "username": uid
    };
    let $value = "";
    for (let key in $params) {
      $value += key + $params[key]; //然后按参数名1+参数值+参数名2+参数值拼接
    }
    //在首尾各加上secret_key
    let $value1 = 'e5148bdd470174b6a99fcce6842c6e8c' + $value + 'e5148bdd470174b6a99fcce6842c6e8c';
    //计算md5作为sign, 此处需要引入MD5插件如（ts-md5）
    return md5.hexMD5($value1);

  },
  broadcast() {
    let that = this;
    let uid = wx.getStorageSync('uid');
    let sign = that.createSign();
    const account = "15376403705";
    const app_key = "ad493af2fdc36bffbd8515554c85ab8e";
    const secret_key = "e5148bdd470174b6a99fcce6842c6e8c";
    let liveConfig = that.data.liveConfig;
    const roomid = liveConfig.substring(liveConfig.lastIndexOf("/")+1);
    let timestamp = String(Math.round(new Date().getTime() / 1000));

    myPlugin.setOptions({
      account: account,
      app_key: app_key,
      username: uid,
      roomid: roomid,
      signedat: timestamp,
      sign: sign,
    })
  },
  //获取课程详情
  details(id) {
    let that = this;
    wx.request({
      url: requestUrl.courseUrl + '/api/Course/free/live/' + id,
      method: 'GEt',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        // res.data.summary = res.data.summary.split('；');
        that.setData({
          teachersDetails: res.data,
          liveConfig: res.data.liveConfig,
        })
        that.footprint(id)
        that.broadcast()
      }
    })
  },
  //了解一下点击事件
  getPhoneNumber(e) {},
  //添加足迹事件
  footprint(id) {
    let that = this
    // that.details(id)
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXFootprint/findByUserId',
      method: 'post',
      data: {
        footprintType: "公开课",
        userId: userid,
        footprintId: id,
        title: that.data.teachersDetails.title
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {}

      }
    })
  },
})