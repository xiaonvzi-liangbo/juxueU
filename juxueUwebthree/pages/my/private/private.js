import requestUrl from '../../../utils/request.js'
Page({

  data: {
    currenTable: '0'
  },
  onLoad: function(options) {
  },
  //点击切换页面事件
  switchPage(e) {
    this.setData({
      currenTable: e.currentTarget.dataset.table
    })
  },
 
})