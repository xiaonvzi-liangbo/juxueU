// pages/universityCircle/invitation/invitation.js
import requestUrl from '../../../utils/request.js'
Page({
  data: {
    nav:[{
      id:'0',
      text:"关注"
    },
      {
        id: '1',
        text: "推荐"
      },
      {
        id: '2',
        text: "精品"
      },
      {
        id: '3',
        text: "社团"
      },
      {
        id: '4',
        text: "话题"
      },],
    currentTab: '1',
    mytime: '',
    show: false,
    searinput: "",
    pages: '1',
    information: []
  },
  //点击切换事件
  attention(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.number,
    })
    console.log(this.data.currentTab, e.currentTarget.dataset.number)
  },
  //发帖事件
  post() {
    let renzheng = wx.getStorageSync('renzheng');
    if (renzheng) {
      wx.navigateTo({
        url: '/pages/universityCircle/article/article'
      })
    } else {
      wx.showToast({
        title: '请先去 "我的-认证中心" 进行认证',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //下拉触底加载
  tolower() {
    let that = this;
    if (that.data.show == true) {
      
      that.selectComponent('#search').tolower()
    } else {
      if (that.data.currentTab == '0') {
        that.selectComponent('#attention').tolower()
      } else if (that.data.currentTab == '1') { 
        that.selectComponent('#boutique').tolower()
      } else if (that.data.currentTab == '2') {
        that.selectComponent('#newest').tolower()
      } else if (that.data.currentTab == '3') {
        that.selectComponent('#question').tolower()
      } else if (that.data.currentTab == '4') {
        that.selectComponent('#club').tolower()
      }
    }
  },
 
  //监听输入框输入事件
  commun(e) {
    this.setData({
      searinput: e.detail.value
    })
  },
  //搜索事件
  search() {
    let that = this 
    if (that.data.show == false) { 
      that.setData({ 
        show :true
      })
    } else { 
      this.selectComponent("#search").search()
    }
  },
  //取消点击事件
  quxiao() {
    this.setData({
      show: false
    })
  },
})