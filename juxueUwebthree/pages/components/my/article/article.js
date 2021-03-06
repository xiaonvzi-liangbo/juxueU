const requestUrl = require('../../../../utils/request.js')
const number = require('../../../../utils/quantity.js')
const time = require('../../../../utils/time.js')
Component({


  /**组件的初始数据*/
  data: {
    actions: [{
      name: '删除',
      width: 100,
      color: '#80848f'
    },],
    information: [],
    pageNum: 1,
    postsImg: [{
      imageone: '',
      imagetwo: '',
      imagethree: ''
    }]
  },
 
  /*** 组件的方法列表*/
  methods: {
    //详情点击事件
    particulars(e) {
      wx.navigateTo({
        url: '/pages/universityCircle/information/information?tzid=' + e.currentTarget.dataset.id,
      })
    },
    //获取帖子文章的数据
    getData() {
      let that = this;
      let userid = wx.getStorageSync('userid');
      wx.request({
        url: requestUrl.requestUrl + '/jXUserApp/findByHePosts',
        data: {
          pageNum: that.data.pageNum,
          pageSize: 10,
          userId: userid //用户id
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          let date = res.data.rows;
          for (let i = 0; i < date.length; i++) {
            //时间处理
            date[i].createTime = time.getDateDiff(date[i].createTime);
            if (typeof(date[i].postsImg)=='string') {
              date[i].postsImgs = date[i].postsImg.split(',')
            }
          };
          if (that.data.pageNum=='1'){
            that.setData({
              information: date,
            })
          }else{
           that.setData({
             information: that.data.information.concat(date),
           })
         }

        }
      })
    },
    //上拉加载
    tolower() {
      this.data.pageNum++;
      this.getData()
    },
    //删除文章
    deldata(e) {
      let that = this;
      wx.showModal({
        title: '确定删除？',
        cancelText: '取消',
        confirmText: '删除',
        success(res) {
          if (res.confirm == true) {
            wx.request({
              url: requestUrl.requestUrl + '/jXCollagePostsApp/deleteUpdatae',
              data: {
                id: e.currentTarget.id
              },
              method: 'post',
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
                  that.setData({
                    pageNum:'1'
                  })
                  that.getData()
                }
              },
            })
          }
        }
      })
    },
  },
  attached() {
    this.getData()
  },

})