import requestUrl from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conter:'',
    tzid:'',
    stid:'',
    historys:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tzid:options.tzid,
      stid: options.stid
    });
    this.history()
  },
  //监听用户输入事件
  contents(e){
    this.setData({
      conter:e.detail.value
    })
  },
  //查询历史消息记录
  history(){
    let that = this;
    wx.request({
      url: requestUrl.requestUrl +'/jXPrivateApp/findByAuto',
      method:'get',
      data:{
        associationId:that.data.stid,
        privateType:'1',
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        if(res.data.code==200){
          that.setData({
            historys:res.data.data
          })
        }
      }
    })
  },
  //留言点击事件
  sends(){
    let that = this;
    if (that.data.conter){
      wx.request({
        url: requestUrl.requestUrl +'/jXAssociationApp/sendByPeople',
        method:'post',
        data:{
          associationUserId:that.data.tzid,
          id:that.data.stid,
          sendInfo: that.data.conter
        },
        header:{
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res){
          if(res.data.code==200){
            wx.showToast({
              title: '发送成功',
              icon:'none',
              duration:2000
            });
            that.setData({
              conter:''
            });
            that.history();
          }else{
            wx.showToast({
              title: '发送失败，请重试！',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '请输入要发送的消息',
        icon:'none',
        duration:2000
      })
    }
  }
})