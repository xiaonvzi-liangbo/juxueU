import requestUrl from '../../../../utils/request.js'
Component({

  /**
   * 页面的初始数据
   */
  data: {
    actions: [{
      name: '删除',
      width: 100,
      color: '#80848f'
    }, ],
    letter: [],
    privatedata: [],
  },
  methods: { //获取私信
    getdata: function() {
      var that = this;
      let userid = wx.getStorageSync('userid');
      wx.request({
        url: requestUrl.requestUrl + '/jXPrivateApp/findByAuto',
        data: {
          privateUserId: userid
        },
        method: 'get',
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          let information = res.data.data
          that.setData({
            privatedata: information.reverse(),

          });
        },

      })
    },
    // 删除私信
    deldata: function(e) {
      let that = this;
      wx.request({
        url: requestUrl.requestUrl + '/jXPrivateApp/del',
        data: {
          id: e.currentTarget.id
        },
        method: 'get',
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.data.code == '200') {
            wx.showToast({
              title: '删除成功！',
              icon: 'none',
              duration: 2000
            });
            that.getdata()
          }
        },
      })
    },
  },
  attached() {
    this.getdata();
  },

})