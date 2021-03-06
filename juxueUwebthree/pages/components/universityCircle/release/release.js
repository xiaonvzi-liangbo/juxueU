// pages/components/universityCircle/myPost/myPost.js
import requestUrl from '../../../../utils/request.js'
import time from '../../../../utils/time.js'
Component({
  properties: {
    zjid: {  
      type: String,  
      value:'',
    },
  },

  data: {
    article: [],
    pageNum: 0,
  },
  methods: {
    //详情点击事件
    particulars(e) {
      wx.navigateTo({
        url: '/pages/universityCircle/information/information?tzid=' + e.currentTarget.dataset.id,
      })
    },
  //获取他的发布
    announce(id) {
      let that = this;   
      wx.request({
        url: requestUrl.requestUrl + '/jXUserApp/findByHePosts',
        method: 'get',
        data: {
          pageNum: that.data.pageNum,
          pageSize: '10',
          userId: id
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) { 
          let date=res.data.rows
          for (let i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].createTime = time.getDateDiff(res.data.rows[i].createTime)
            if (typeof (date[i].postsImg) == 'string') {
              date[i].postsImgs = date[i].postsImg.split(',')
            }
          };
          that.setData({
            article: that.data.article.concat(res.data.rows)
          }); 
        }
      })
    },
    tolower() {
      this.data.pageNum++;
      this.announce()
    },
  },
  attached() { 
    this.announce(this.data.zjid)
  },

})