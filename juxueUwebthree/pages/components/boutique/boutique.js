const requestUrl = require('../../../utils/request.js')
const number = require('../../../utils/quantity.js')
const time = require('../../../utils/time.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    information: [],
    pageNum:1,
    collageName:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    particulars(e) {
      wx.navigateTo({
        url: '/pages/universityCircle/information/information?tzid='+e.currentTarget.dataset.id,
      })
    },
    //前往话题贴子
    topics(e) {
      wx.navigateTo({
        url: '/pages/tztopics/tztopics?topid=' + e.currentTarget.dataset.topid
      })
    },
    //发帖人详情
    personage(e) {
      wx.navigateTo({
        url: '/pages/universityCircle/myPost/myPost?id=' + e.currentTarget.dataset.id,
      })
    },
    //获取帖子的数据
    getData() {
      let that = this;
      let collageid = wx.getStorageSync('collageid');
      let userid = wx.getStorageSync('userid');
      wx.request({
        url: requestUrl.requestUrl + '/jXCollagePostsApp/getList',
        data: {
          pageNum: that.data.pageNum,
          pageSize:'10',
          isDraft: '0',
          postsType: '最新',
          userId: userid//用户id
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          let date = res.data.rows;
          //数量,时间的处理
          for (let i = 0; i < date.length; i++) {
            date[i].visitNumber = number.number(date[i].visitNumber);
            date[i].commentNumber = number.number(date[i].commentNumber);
            date[i].createTime = time.getDateDiff(date[i].createTime);

            if (typeof (date[i].postsImg) == 'string') {
              date[i].postsImgs = date[i].postsImg.split(',')
            }
          }
          that.setData({
            information: that.data.information.concat(date)
          })
        }
      })
    },
    tolower(){
      this.data.pageNum++;
      this.getData()
    }
  },
  attached() {
    this.getData()
  }
})
