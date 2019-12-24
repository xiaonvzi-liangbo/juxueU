import requestUrl from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTable:'0',
    subscri:[],
  },
  //导航点击切换事件
  navigation(e){
    let that = this;
    that.setData({
      currentTable: e.currentTarget.dataset.navi
    })
  },
  //学历提升上拉加载更多
  deucat(){
    this.selectComponent('#education').tolower()
  },
  //职业资格上拉加载更多
  career(){
    this.selectComponent('#careers').tolower()
  },
  //获取预约成功的信息
  subscribe(){
    let that=this;
    wx.request({
      url: requestUrl.requestUrl +'/promoteApp/findByAllP',
      method:'get',
      header:{
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        if(res.data.code=='200'){
          that.setData({
            subscri:res.data.data
          })
        }
      }
    })
  },
  onLoad(){
    this.subscribe()
  }
})