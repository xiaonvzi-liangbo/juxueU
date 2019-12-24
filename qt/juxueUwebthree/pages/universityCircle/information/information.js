var app = getApp(); //获取应用实例
const requestUrl = require('../../../utils/request.js')
const number = require('../../../utils/quantity.js')
Page({
  data: {
    navHeight: app.globalData.navHeight, 
    showReply: false,
    showNegative: false, //是否是问答
    postData: [],
    postCritic: [],
    showCritic: false,
    show: false,
    tzid: '',
    number: 1,
    pages: 1,
    replyData: [],
    commentId: '',
    ejindex: '',
    stair: '', //一级评论的内容
    second: '', //二级评论的内容
    collageName: '',
    imgs: [],      
    access_token: '',
    postsId: ''
  },
  onLoad(options) {
    if (options.id == '3') {
      this.setData({
        showNegative: true
      })
    };
    this.setData({
      tzid: options.tzid
    })
    this.getData(this.data.tzid);
    this.getCritic(this.data.tzid);
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
  //获取帖子详情
  getData() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXCollagePostsApp/findById',
      data: {
        id: that.data.tzid,
        followUserId: userid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.data.code == '200') {
          that.setData({
            postData: res.data.data.data,   
          })
          console.log(that.data.postData.isCollection)
          if (res.data.data.data.collageName == null) {
            that.setData({
              collageName: "尚未认证"
            })
          } else {
            that.setData({
              collageName: res.data.data.data.collageName
            })
          }
        } else {
          wx.showToast({
            title: '获取帖子失败，请重试！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //图片放大事件
  amplify(e) {
    let that = this
    var id = e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    var previewImgArr = [];
    //通过循环在数据链里面找到和这个id相同的这一组数据，然后再取出这一组数据当中的图片
    var data = that.data.postData.jxCollagePostsFroms;
    for (var i in data) {
      if (id == data[i].id) {
        previewImgArr = previewImgArr.concat(data[i].imgUrl)
      }
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: previewImgArr // 需要预览的图片http链接列表
    })
  },

  //获取评论详情
  getCritic() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXPostsCommentApp/findByAuto',
      data: {
        postsId: that.data.tzid,
        pageSize: '10',
        pageNum: that.data.number,
        userId: userid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (that.data.number=='1') {
          that.setData({
            postCritic: res.data.rows,
          })
          
        } else {
          that.setData({
            postCritic: that.data.postCritic.concat(res.data.rows),
          }) 
        }
      }
    })
  },
 
  tolower() {
    console.log("44")
    if (this.data.showReply == false) {
      console.log("false")

      this.data.number++;
      this.getCritic()
    } else {
      console.log("true")
      this.data.pages++;
      this.write()
    }

  },
  //关注点击事件
  attention(e) {
    let that = this;
    let userid = wx.getStorageSync('userid')
    wx.request({
      url: requestUrl.requestUrl + '/jXFollowApp/findByAuto',
      data: {
        followType: '用户',
        userId: userid,
        followId: e.currentTarget.dataset.followid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          if (that.data.postData.isFollow == '0') {
            wx.showToast({
              title: '关注成功!',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '取消关注成功!',
              icon: 'none',
              duration: 2000
            })
          }

          that.getData(that.data.tzid);

        } else {
          wx.showToast({
            title: '关注失败，请重试!',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //消息回复点击事件
  reply(e) {
    this.setData({
      commentId: e.currentTarget.dataset.reid,
      ejindex: e.currentTarget.dataset.index,
      showReply: true
    });
    this.write()
  },
  //获取二级评论
  write() {
    let that = this;
    let userid = wx.getStorageSync('userid')
    wx.request({
      url: requestUrl.requestUrl + '/jXPostsCommentTwoApp/getList',
      data: {
        commentId: that.data.commentId,
        userId: userid,
        pageNum: that.data.pages,
        pageSize: '10'
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (that.data.pages == '1') {
          that.setData({
            replyData: res.data.rows,
          })
        } else {
          that.setData({
            replyData: that.data.replyData.concat(res.data.rows),
          })
        }
      }
    }) 
  },
  //点赞点击事件 
  praise(e) {
    let that = this;
    let userid = wx.getStorageSync('userid');
    console.log(e.currentTarget)
    wx.request({
      url: requestUrl.requestUrl + '/jXFabulousApp/addDel',
      method: 'post',
      data: {
        fabulousType: e.currentTarget.dataset.type,
        userId: userid,
        fabulousId: e.currentTarget.dataset.id
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          if (e.currentTarget.dataset.type == '帖子') {
            let isFabulous="postData.isFabulous"
            let fabulousNumber ="postData.fabulousNumber"
            if (that.data.postData.isFabulous == '1') {
              that.setData({
                [isFabulous]: '0',
                [fabulousNumber]: that.data.postData.fabulousNumber - 1
              })
            } else {
              that.setData({
                [isFabulous]: '1',
                [fabulousNumber]: that.data.postData.fabulousNumber + 1
              })
            }
          } else if (e.currentTarget.dataset.type == '一级点赞') {
            let i = e.currentTarget.dataset.index
            let isFabulous = 'postCritic[' + i + '].isFabulous'
            let fabulousNumber = 'postCritic[' + i + '].fabulousNumber'
            if (that.data.postCritic[i].isFabulous == "1") {
              that.setData({
                [isFabulous]: '0',
                [fabulousNumber]: that.data.postCritic[i].fabulousNumber - 1
              })
            } else {
              that.setData({
                [isFabulous]: '1',
                [fabulousNumber]: that.data.postCritic[i].fabulousNumber + 1
              })
            }

          } else if (e.currentTarget.dataset.type == '二级点赞') {
            let i = e.currentTarget.dataset.index
            let isFabulous = 'replyData[' + i + '].isFabulous'
            let fabulousNumber = 'replyData[' + i + '].fabulousNumber'
            if (that.data.replyData[i].isFabulous == 1) {
              that.setData({
                [isFabulous]: '0',
                [fabulousNumber]: that.data.replyData[i].fabulousNumber - 1
              })
            } else {
              that.setData({
                [isFabulous]: '1',
                [fabulousNumber]: that.data.replyData[i].fabulousNumber + 1
              })
            }
          }
        }

      }
    })
  },
  //差评点击事件
  negative(e) {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXDifferenceApp/findByAuto',
      method: 'post',
      data: {
        differenceType: e.currentTarget.dataset.type,
        userId: userid,
        differenceId: e.currentTarget.dataset.id
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          if (e.currentTarget.dataset.type == '一级评论') {
            that.getCritic()
          } else if (e.currentTarget.dataset.type == '帖子') {
            that.getData()
          }
        }
      }
    })
  },
  //收藏点击事件
  collect(e) {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXCollectionApp/findByAuto',
      method: 'post',
      data: {
        collectionType: '帖子',
        userId: userid,
        collectionId: e.currentTarget.dataset.id
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          let isCollection =  "postData.isCollection"
          if (that.data.postData.isCollection == "1") {
            that.setData({
              [isCollection]: "0"
            }) 
          } else { 
            that.setData({
              [isCollection]: "1"
            }) 
          }
        }
      }
    })
  },
  /** * 用户分享自定义 */
  onShareAppMessage: function(ops) {
    let userid = wx.getStorageInfo('userid');
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: ops.target.dataset.title,
      path: '/pages/universityCircle/information/information?id=' + ops.target.dataset.id,
      success: function(res) {
        wx.request({
          url: requestUrl.requestUrl + '/jXShareApp/add',
          shareId: ops.target.dataset.id,
          userId: userid,
          header: {
            'content-type': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            if (res.data.code) {}
          }
        })
      },
      fail: function(res) {}
    }
  },
  //消息回复关闭点击事件
  close() {
    this.setData({
      showReply: false
    })
  },
  //获取accessToken
  accessToken(e) {
    let that = this
    let fun = e.currentTarget.dataset.fun
    wx.request({
      url: requestUrl.requestUrl + '/jj/weChat/getAccessToken',
      method: "get",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success(res) {
        that.setData({
          access_token: res.data.data
        })
        if (fun == "critic") {
          that.critic(e)
        } else if (fun == "level") {
          that.level(e)
        }
      }
    })
  },
  //输入框获取焦点
  inputshow() {
    let that = this
    that.setData({
      show: true
    })
  },
  //输入框失去焦点
  assignment(e) {
    let that = this
    that.setData({
      stair: e.detail.value,
      postsId: e.currentTarget.dataset.id
    })
  },
  //取消发送
  quxiao() {
    let that = this
    that.setData({
      show: false,
    })
  },
  //发送一级评论
  critic(e) {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXPostsCommentApp/add',
      method: 'post',
      data: {
        userId: userid,
        postsId: that.data.postsId,
        info: that.data.stair,
        accessToken: that.data.access_token
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        let commentNumber = "postData.commentNumber"
        if (res.data.code == 200) {
          that.getCritic();
          that.setData({
            show: false,
            stair: '',
            number: '1',
            [commentNumber]: that.data.postData.commentNumber + 1,
          })
        }
      }
    })
  },
  // 二级评论输入监听
  transmit(e) {
    this.setData({
      second: e.detail.value
    })
  },
  //发送二级评论
  level(e) {
    let that = this;
    let userid = wx.getStorageSync('userid');
    let i = that.data.ejindex
    let commentNumber = 'postCritic[' + i + '].commentNumber'
    wx.request({
      url: requestUrl.requestUrl + '/jXPostsCommentTwoApp/add',
      method: 'post',
      data: {
        commentId: that.data.commentId,
        userId: userid,
        info: that.data.second,
        accessToken: that.data.access_token
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          second: '',
          [commentNumber]: that.data.postCritic[i].commentNumber + 1
        })

        that.write()
      }
    })
  },

})