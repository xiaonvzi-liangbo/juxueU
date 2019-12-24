// pages/tztopics/tztopics.js
import requestUrl from '../../utils/request.js'
const time = require('../../utils/time.js')
const quantity = require('../../utils/quantity.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topics: [],
    pageNum: '1',
    toplist: [],
    id: '',
    isFollow:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.topid
    })
    this.gettuplist()
    this.gettopics()
  },
  //获取贴子详情
  gettopics() {
    let that = this
    wx.request({
      url: requestUrl.requestUrl + '/jxCollagePostsTalkApp/findById',
      method: 'get',
      data: {
        id:that.data.id
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          
          that.setData({
            topics: res.data.data,
            isFollow: res.data.data.isFollow
          })

        }
      }
    })
  },
  //获取话题贴子列表
  gettuplist() {
    let that = this
    wx.request({
      url: requestUrl.requestUrl + '/jXCollagePostsApp/findByTalkList',
      method: 'get',
      data: {
        pageNum: that.data.pageNum,
        pageSize: '10',
        talkId: that.data.id
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        let date = res.data.rows;
        //数量,时间的处理
        for (let i = 0; i < date.length; i++) {
          date[i].createTime = time.getDateDiff(date[i].createTime);

          if (typeof (date[i].postsImg) == 'string') {
            date[i].postsImgs = date[i].postsImg.split(',')
          }
        }
        that.setData({
          toplist: that.data.toplist.concat(date)
        })
      }
    })
  },
  //关注点击事件
  attention(e) {
    let that = this;
    let userid = wx.getStorageSync('userid');
    this.setData({
      private: false,
      attention: true
    });
    wx.request({
      url: requestUrl.requestUrl + '/jXFollowApp/findByAuto',
      method: 'post',
      data: {
        followType: '话题',
        followId: e.currentTarget.dataset.id,
        userId: userid
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          if (that.data.isFollow=='0'){
            that.setData({
               isFollow:'1'
            })
          } else if (that.data.isFollow=='1'){
            that.setData({
              isFollow:'0'
            })
          }
        }
      }
    })
  },
  //详情点击事件
  particulars(e) {
    wx.navigateTo({
      url: '/pages/universityCircle/information/information?tzid=' + e.currentTarget.dataset.id,
    })
  },
  //发帖人详情
  personage(e) {
    wx.navigateTo({
      url: '/pages/universityCircle/myPost/myPost?id=' + e.currentTarget.dataset.id,
    })
  },
  tolower() {
    if (this.data.toplist.length == 10) {
      this.data.pageNum++;
      this.gettuplist()
    }
  }

})