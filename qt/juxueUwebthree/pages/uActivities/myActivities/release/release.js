// pages/uActivities/myActivities/release/release.js
import requestUrl from '../../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gettitle: '',
    checkedNum: '',
    access_token: '',
    img: '/pages/images/stbgimg.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
        if (fun == "upload") {
          that.upload()
        }
      }
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
        that.jcImage(str)
        that.setData({
          img: str
        })
        that.jcImage(str)
      },
    })
  }, 
  //监听主题输入事件
  inptitle(e) {
    this.setData({
      gettitle: e.detail.value
    })
  },
  //监听学校子组件调用父组件的值
  checkNum(e) {
    this.setData({
      checkedNum: e.detail.checkedNum,
    })
  },
  //页面跳转事件
  next() {
    let that = this
    if (that.data.gettitle == '') {
      wx.showToast({
        title: '请输入活动主题',
        icon: 'none',
        duration: 2000,
      })
    } else if (that.data.checkedNum == '') {
      wx.showToast({
        title: '请选择举办院校',
        icon: 'none',
        duration: 2000,
      })
    } else {
      wx.navigateTo({
        url: '/pages/uActivities/myActivities/releaseTwo/releaseTwo?gettitle=' + that.data.gettitle + '&checkedNum=' + that.data.checkedNum + '&bgimg=' + that.data.img
      })
    }

  },

})