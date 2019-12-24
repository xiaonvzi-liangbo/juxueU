import requestUrl from '../.../../../../utils/request.js'
import imgcheck from '../.../../../../utils/imgcheck.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: '',
    picture: [],
    checkedNum: '',
    access_token: '',
    nickName: '',
    collageName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let nickName = wx.getStorageSync('nickName');
    let collageName = wx.getStorageSync('collageName');
    this.setData({
      collageName: collageName,
      nickName: nickName
    }) 
    
  },
  //获取accessToken
  accessToken(e) {
    let that = this
    let fun = ''
    if (e) {
      fun = e.currentTarget.dataset.fun
    }
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
        if (fun == "issue") {
          that.issue()
        } else if (fun == "uploading") {
          that.uploading()
        } else if (fun == "formSubmit") {
          that.formSubmit(e)
        }
      }
    })
  },
  //图片上传点击事件(单张)
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
        for (let i = 0; i < tempFilePaths.length; i++) {
          setTimeout(res => {
            that.upImg(tempFilePaths[i])
          }, 1000 * i) 
        }
      }
    });
  },
  upImg(imgurl) { 
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
          logo: str
        });
        imgcheck.jcImage(str)

      },
    })
  },
  //删除单张图片
  delect() {
    this.setData({
      logo: ''
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
        let pic = that.data.picture.concat(str)
        that.setData({
          picture: pic
        });
        imgcheck.jcImage(str)

      },
    })
  },

  //图片上传（多张）
  uploads() {
    let that = this;
    wx.chooseImage({
      count: 9, //最多可以选择的图片总数
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
        for (let i = 0; i < tempFilePaths.length; i++) {
          setTimeout(res => {
            that.upImgs(tempFilePaths[i]) 
          }, 1000 * i)
        }
      }
    });
  },
  //删除多张图片
  delects(e) {
    let arr = this.data.picture;
    let end = arr.splice(e.currentTarget.dataset.id, 1);
    this.setData({
      picture: arr
    })
  },
  //子组件调用的父组件的方法
  checkNum(e) { 
        this.setData({
      checkedNum: e.detail.checkedNum
    })
  },
  //提交点击事件
  formSubmit(e) {
    let that = this;
    let err = true;
    let conter = '';
    let userid = wx.getStorageSync('userid');
    if (!e.detail.value.zy) {
      conter = '社团名称不能为空！'
    } else if (!e.detail.value.text) {
      conter = '社团介绍不能为空！'
    } else if (!that.data.logo) {
      conter = '请上传社团logo！'
    } else if (that.data.picture.length < 3) {
      conter = '请上传最少三张社团风采！'
    } else {
      err = false;
      let pict = ''
      //社团风采图片上传格式处理
      let pice = that.data.picture.join(',');
      wx.request({
        url: requestUrl.requestUrl + '/jXAssociationApp/add',
        method: 'post',
        data: {
          headImg: that.data.logo,
          associationInfo: e.detail.value.text,
          associationName: e.detail.value.zy,
          associationType: '1',
          collageImg: pice,
          name: e.detail.value.name,
          userId: userid,
          collageId: that.data.checkedNum,
          accessToken: that.data.access_token
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.data.code == '200') {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];
            prevPage.onLoad()
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    };
    if (err) {
      wx.showToast({
        title: conter,
        icon: 'none',
        duration: 2000
      })
    }
  }
})