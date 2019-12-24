// pages/prospects/Jobanalysis/Jobanalysis.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hq:[
      { id: '0', linkImg: '../../images/fgg.png', title: '覆盖广', content:'覆盖96%以上的大学专业，包含国内所有院校！'},
      { id: '1', linkImg: '../../images/zqw.png', title: '最权威', content: '联合多家权威大数据公司，助你分析专业前景！'},
      { id: '2', linkImg: '../../images/zfz.png', title: '最负责', content: '百人团队，耗时一年八个月整理归纳分析！'},
      { id: '3', linkImg: '../../images/zzy.png', title: '最专业', content: '涵盖近三年该专业毕业生薪酬、就业率，主业方向行业发展前景及职业发展规划等！'}
    ],
    user:'',
    vishow:false
  },
 
  //立即领取点击事件
  pullDown(){

    let renzheng = wx.getStorageSync('renzheng');
    if (renzheng) {
      wx.navigateTo({
        url: '/pages/prospects/welfare/welfare?user=' + this.data.user,
      })
    } else {
      wx.showToast({
        title: '请先去 "我的-认证中心" 进行认证',
        icon: 'none',
        duration: 2000
      })
    }

 


  },
  onLoad(options) {
    this.setData({
      user: options.user,
    })
  },
})