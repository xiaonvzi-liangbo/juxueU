const requestUrl = require('../../../utils/request.js')
const number = require('../../../utils/quantity.js')
const time = require('../../../utils/time.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    searinput: {
      type: String,
      value: "",
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    information: [],
    pageNum: 1,
    collageName: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //详情点击事件
    particulars(e) {
      wx.navigateTo({
        url: '/pages/universityCircle/information/information?tzid=' + e.currentTarget.dataset.id,
      })
    },
    //前往话题贴子
    topics(e) {
      wx.navigateTo({
        url: '/pages/tztopics/tztopics?topid=' + e.currentTarget.dataset.topid
      })
    },
    //搜索贴子
    search() {
    let that=this
        wx.request({
          url: requestUrl.requestUrl + '/jXCollagePostsApp/findByLikeName',
          data: {
            likeName: that.data.searinput,
            pageNum: that.data.pageNum,
            pageSize: 10
          },
          header: {
            'content-type': 'application/json',
            "content-type": "application/x-www-form-urlencoded"
          },
          success(res) {
            let date = res.data.rows;
            for (let i = 0; i < date.length; i++) {
              date[i].visitNumber = number.number(date[i].visitNumber);
              date[i].commentNumber = number.number(date[i].commentNumber);
              date[i].createTime = time.getDateDiff(date[i].createTime);

              if (typeof (date[i].postsImg) == 'string') {
                date[i].postsImgs = date[i].postsImg.split(',')
              }
            }
            if (that.data.pageNum=='1'){
            that.setData({
              information:  res.data.rows,
            })
          }else{
            that.setData({
              information: that.data.information.concat(res.data.rows),
            })
          }
          }
        }) 
    },
    //发帖人详情
    personage(e) {
      wx.navigateTo({
        url: '/pages/universityCircle/myPost/myPost?id=' + e.currentTarget.dataset.id,
      })
    },
    tolower() {
      if (this.data.information.length == 10) {
        this.data.pageNum++;
        this.getData()
      }
    }
  }, 
})