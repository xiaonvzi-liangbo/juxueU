// pages/hotspot/myCommunity/myCommunity.js
import requestUrl from '../../../utils/request.js'
import time from '../../../utils/time.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    organ: [],
    stdynamic: [],
    pageNum: 1,
    id: '',
    commander: false, //判断是否是团长
    showmodal: false,//委任界面
    cyList: [],
    img: '',
    bgimg: '',
    access_token: ''

  },
  //获取社团信息
  getOrganization() {
    let that = this;
    let userid = wx.getStorageSync('userid')
    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/findById',
      method: "get",
      data: {
        associationType: '1',
        id: that.data.id,
        associationUserId: userid
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) { 
          //判断是不是团长
          if (res.data.data.myPosition == '0') {
            that.setData({
              commander: true,
              organ: res.data.data
            })
          } else {
            that.setData({
              commander: false,
              organ: res.data.data
            })
          } 
        } else {
          wx.showToast({
            title: '获取失败，请重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
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
        if (fun == "bgupload") {
          that.bgupload()
        } else if (fun == 'upload') {
          that.upload()
        }
      }
    })
  },
  //背景图片修改点击
  bgupload() {
    let that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        //启动上传等待中...
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        // let uploadImgCount = 0;
        for (let i = 0; i < tempFilePaths.length; i++) {
          setTimeout(res => {
            that.bjupImgs(tempFilePaths[i])
            if (i == tempFilePaths.length - 1) {
              wx.hideLoading()
            }
          }, 1000 * i)
        }
      }
    });
  },
  // 涂片检测
  bjjcImage(imgurl) {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jj/weChat/checkImage',
      method: "post",
      data: {
        accessToken: that.data.access_token,
        funnyUrl: imgurl,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success(res) {
        wx.showToast({
          title: '上传成功',
          icon: 'none',
          duration: 2000
        });
        that.bgformSubmit()
      },
    })
  },
  //文件上传服务器
  bjupImgs(imgurl) {
    let that = this;
    wx.uploadFile({
      url: 'https://staticfile.xlcwx.com/api/modalupload/image',
      filePath: imgurl,
      name: 'upload',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success(res) {
        let arr = res.data.split('"');
        let str = arr[3].replace(/^(\s|")+|(\s|ab)+$/g, '');
        that.bjjcImage(str)
        that.setData({
          bgimg: str,
        })
      },
    })
  },

  //图片上传点击事件
  upload() {
    let that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        //启动上传等待中...
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        // let uploadImgCount = 0;
        for (let i = 0; i < tempFilePaths.length; i++) {
          setTimeout(res => {
            that.upImgs(tempFilePaths[i])
            if (i == tempFilePaths.length - 1) {
              wx.hideLoading()
            }
          }, 1000 * i)
        }
      }
    });
  },
  // 涂片检测
  jcImage(imgurl) {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jj/weChat/checkImage',
      method: "post",
      data: {
        accessToken: that.data.access_token,
        funnyUrl: imgurl,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success(res) {
        wx.showToast({
          title: '上传成功',
          icon: 'none',
          duration: 2000
        });
        that.formSubmit()
      },

    })
  },
  //文件上传服务器
  upImgs(imgurl) {
    let that = this;
    wx.uploadFile({
      url: 'https://staticfile.xlcwx.com/api/modalupload/image',
      filePath: imgurl,
      name: 'upload',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success(res) {
        let arr = res.data.split('"');
        let str = arr[3].replace(/^(\s|")+|(\s|ab)+$/g, '');
        that.setData({
          img: str,
        });
        that.jcImage(str)
        wx.hideToast();
      },
    })
  },
  //背景保存点击事件
  bgformSubmit(e) {
    let that = this;
    let err = true;
    let conter = '';
    let userid = wx.getStorageSync('userid');
    err = false;
    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/update',
      method: 'post',
      data: {
        id: that.data.id,
        associationType: 1,
        img: that.data.bgimg
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          let page = getCurrentPages();
          page[page.length - 1].getOrganization()
        } else {
          wx.showToast({
            title: '修改失败，请重试！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
    if (err) {
      wx.showToast({
        title: conter,
        icon: 'none',
        duration: 2000
      })
    }
  },
  //保存点击事件
  formSubmit(e) {
    let that = this;
    let err = true;
    let conter = '';
    let userid = wx.getStorageSync('userid');
    err = false;
    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/update',
      method: 'post',
      data: {
        id: that.data.id,
        associationType: 1,
        headImg: that.data.img
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          let page = getCurrentPages();
          page[page.length - 1].getOrganization()
          page[page.length - 2].hotspot()
        } else {
          wx.showToast({
            title: '修改失败，请重试！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
    if (err) {
      wx.showToast({
        title: conter,
        icon: 'none',
        duration: 2000
      })
    }
  },

  //社团帖子详情点击事件
  particulars(e) {
    wx.navigateTo({
      url: '/pages/universityCircle/information/information?tzid=' + e.currentTarget.dataset.id,
    })
  },
  //社团成员点击事件
  member() {
    wx.navigateTo({
      url: '/pages/hotspot/member/member?id=' + this.data.organ.id + '&&isSuccess=' + this.data.organ.isSuccess
    })
  },
  //关于社团点击事件
  organizatiuon(e) {
    wx.navigateTo({
      url: '/pages/hotspot/organization/organization?stid=' + e.currentTarget.dataset.stid + '&&commander=' + this.data.commander
    })
  },
  //申请列表点击事件
  chengyuan(e) {
    wx.navigateTo({
      url: '/pages/hotspot/chengyuan/chengyuan?stid=' + e.currentTarget.dataset.stid + '&&commander=' + this.data.commander,
    })
  },
  //获取社团动态
  dynamics() {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jXCollagePostsApp/findByAssociationActivity',
      method: 'get',
      data: {
        authenticationId: that.data.id,
        authenticationType: 2,
        pageNum: that.data.pageNum,
        pageSize: 10
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        //时间的处理
        for (let i = 0; i < res.data.rows.length; i++) {
          let date = res.data.rows
          res.data.rows[i].createTime = time.getDateDiff(res.data.rows[i].createTime)
          if (typeof(date[i].postsImg) == 'string') {
            date[i].postsImgs = date[i].postsImg.split(',')
          }
        };
        that.setData({
          stdynamic: that.data.stdynamic.concat(res.data.rows)
        })
      }
    })
  },
  //获取社团动态
  dynamic() {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jXCollagePostsApp/findByAssociationActivity',
      method: 'get',
      data: {
        authenticationId: that.data.id,
        authenticationType: 2,
        pageNum: '1',
        pageSize: 10
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        //时间的处理
        for (let i = 0; i < res.data.rows.length; i++) {
          let date = res.data.rows
          res.data.rows[i].createTime = time.getDateDiff(res.data.rows[i].createTime)
          if (typeof (date[i].postsImg) == 'string') {
            date[i].postsImgs = date[i].postsImg.split(',')
          }
        };
        that.setData({
          stdynamic: res.data.rows
        })
      }
    })
  },
  //退出社团点击事件
  quit(e) {
    let userid = wx.getStorageSync('userid')
    if (this.data.commander) {
      this.getList(e.currentTarget.dataset.id)
    } else {
      wx.showModal({
        title: '提示',
        content: '确定要退出社团吗？',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: requestUrl.requestUrl + '/jXAssociationApp/deleteByIdandUserIdT',
              method: 'get',
              data: {
                id: e.currentTarget.dataset.id,
                userId: userid
              },
              header: {
                'content-type': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success(res) {
                if (res.data.code == 200) {
                  let pages = getCurrentPages()
                  pages[pages.length - 2].setData({
                    pagenum: '1'
                  })
                  pages[pages.length - 2].hotspots()

                  wx.showToast({
                    title: '退出成功',
                    icon: 'none',
                    duration: 2000
                  });
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000)
                }
              }
            })
          }
        }
      })
    }
  },
  //获取社团成员
  getList(id) {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/findByAutoByPeople',
      method: 'get',
      data: {
        associationId: id,
        isSuccess: '2'
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            cyList: res.data.data,
            showmodal: true
          })
        } else {
          wx.showToast({
            title: '获取失败，请重试！',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  //团长委任新的团长
  appoint(e) {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/deleteByCommander',
      method: 'post',
      data: { 
        id: e.currentTarget.dataset.cybid,
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '委任成功！',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            showmodal: false,
            commander:false
          });
          
        } else {
          wx.showToast({
            title: '委任失败，请重试！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //发布社团动态点击事件
  issue() {
    wx.navigateTo({
      url: '/pages/hotspot/activity/activity?authenticationId=' + this.data.id,
    })
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.getOrganization();
    this.dynamic();
  },
  //上拉加载
  onReachBottom() {
    let that = this;
    this.data.pageNum++;
    this.dynamics()
  }
})