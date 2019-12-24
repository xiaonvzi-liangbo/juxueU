// pages/components/universityCircle/community/community.js
import requestUrl from '../../../../utils/request.js'
import time from '../../../../utils/time.js'
Component({
  properties: {
    zjid: {
      type: String,
      value: '', 
    },
  },

  data: {
    mygroup: [],
    pageNum: 0,
  },
  methods: {
    //详情点击事件
    particulars(e) {
      wx.navigateTo({
        url: '/pages/universityCircle/information/information?tzid=' + e.currentTarget.dataset.id,
      })
    },
    //点击进入社团
    entrance(e) {
      wx.navigateTo({
        // url: '/pages/hotspot/myCommunity/myCommunity?id=' + e.currentTarget.dataset.id
        url: '/pages/hotspot/organization/organization?stid=' + e.currentTarget.dataset.id
      })
    },
    //获取他的社团
    announce() {
      let that = this;
      wx.request({
        url: requestUrl.requestUrl + '/jXAssociationApp/findByMyAssociationList',
        method: 'get',
        data: {
          userId: that.data.zjid
        },
        header: {
          'content-type': 'application/json',
          "content-type": "application/x-www-form-urlencoded"
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              mygroup: res.data.data
            })
          }
        }
      })
    },
  },

  attached() {
    this.announce()
  },

})