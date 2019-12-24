import requestUrl from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member: [],
    id: '', //认证表id
    isSuccess: '', //认证区别
    my: '',
    myconsole: false,
    colonel: '',
    colonels: '',
    position: [],
    modifies: false,
    xgpositions: ["团长", '副团长', '秘书', '宣传部长', '财务部长', '外联部长', '组织部', '团员']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      isSuccess: options.isSuccess,
    })
    this.getMember()
  },
  //社团成员详情
  personage(e) {
    wx.navigateTo({
      url: '/pages/universityCircle/myPost/myPost?id=' + e.currentTarget.dataset.id,
    })
  },
  //获取成员列表
  getMember() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/findByAutoByPeople',
      method: 'get',
      data: {
        associationId: that.data.id,
        userId: userid,
        isSuccess:'2'
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].myType == "1") { //当前用户
              that.setData({
                my: res.data.data[i]
              })
              if (res.data.data[i].userId == res.data.data[i].associationUserId) {
                that.setData({
                  myconsole: true //当前用户即团长
                })
              } else {
                that.setData({
                  myconsole: false
                })
              }
            };
          } 
          that.setData({
            member: that.sortByKey(res.data.data, 'position')
          })
        } else {
          wx.showToast({
            title: '获取失败，请重试！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  sortByKey(array, key) { 
    return array.sort(function(a, b) {
      var x = a[key]; //如果要从大到小,把x,y互换就好
      var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  },

  //编辑点击事件
  redact() {
    this.setData({
      modifies: true
    })
  },
  //取消编辑点击事件
  redactcancels() {
    this.getMember()
    this.setData({
      modifies: false
    })
  },
  //职位选择
  bindPickerChange: function(e) {
    let that = this

    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/updateByPosition',
      method: 'POST',
      data: {
        id: e.currentTarget.dataset.id,
        position: e.detail.value,
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success() {
        that.getMember()
      }
    })
  },
  //删除成员点击事件
  delete(e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除这个成员吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: requestUrl.requestUrl + '/jXAssociationApp/deleteByIdandUserIdS',
            method: 'get',
            data: {
              associationId: e.currentTarget.dataset.rzid,
              id: e.currentTarget.dataset.tyid,
              userId: e.currentTarget.dataset.tzid
            },
            header: {
              'content-type': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 2000
                })
                that.getMember()
              } else {
                wx.showToast({
                  title: '删除失败，请重试！',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
  },

  //群发点击事件
  mass(e) {
    wx.navigateTo({
      url: '/pages/hotspot/massTexting/massTexting?tzid=' + e.currentTarget.dataset.tzid + '&&stid=' + e.currentTarget.dataset.stid
    })
  }
})