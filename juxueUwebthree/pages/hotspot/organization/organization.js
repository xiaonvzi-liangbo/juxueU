import requestUrl from '../../../utils/request.js'
import time from '../../../utils/time.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stdynamic: [],
    details: [],
    pageNum: 1,
    stid: '',
    commander: false,
    compile: true,
    text: '',
    editor: false,
    addition: false,
    elegants: false,
    picture: [],
    productInfo: {},
    imgs: "",
    picture: [],
    access_token:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      stid: options.stid,
    });
    this.getDetails();
    // this.dynamic(4)
    this.dynamic(options.stid)
  },
  //获取社团详情
  getDetails() {
    let that = this;
    let dquserid = wx.getStorageSync('userid')
    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/findById',
      method: 'get',
      data: {
        associationType: '1',
        id: that.data.stid
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            text: res.data.data.associationInfo,
            details: res.data.data
          })
         
          if (res.data.data.userId == dquserid) {
            that.setData({
              commander: true
            })
          }
        } else {
          wx.showToast({
            title: '获取失败，请重试！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //社团详情点击事件
  particulars(e) {
    wx.navigateTo({
      url: '/pages/universityCircle/information/information?tzid=' + e.currentTarget.dataset.id,
    })
  },
  //社团成员点击事件
  perName() {
    wx.navigateTo({
      url: '/pages/hotspot/member/member?id=' + this.data.stid
    })
  },
  //点击推广事件
  popularizes(res) {
    let that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: "添加社团",
      path: '/pages/hotspot/organization/JoinClub/organization?stid=' + that.data.stid,
    }
  },
  //获取社团动态
  dynamic(id) {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jXCollagePostsApp/findByAssociationActivity',
      method: 'get',
      data: {
        authenticationId: id,
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
        let date = res.data.rows
        for (let i = 0; i < res.data.rows.length; i++) {
          res.data.rows[i].createTime = time.getDateDiff(res.data.rows[i].createTime)

          if (typeof (date[i].postsImg) == 'string') {
            date[i].postsImgs = date[i].postsImg.split(',')
          }
        };
        that.setData({
          stdynamic: that.data.stdynamic.concat(res.data.rows)
        })
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
        if (fun == "formSubmit") {
          that.formSubmit(e)
        } else if (fun == 'picture') {
          that.picture()
        } else if (fun == 'accomplish') {
          that.accomplish()
        }
      }
    })
  },
  //监听社团介绍输入事件
  monitor(e) {
    this.setData({
      text: e.detail.value
    })
  },
  //编辑个性签名点击事件
  addition() {
    this.setData({
      compile: false,
      text: ''
    })
  },
  //编辑个性签名取消点击事件
  cancel() {
    this.setData({
      compile: true,
      text: this.data.details.associationInfo
    })
  },
  //编辑个性签名完成点击事件
  accomplish() {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/update',
      method: 'post',
      data: {
        associationInfo: that.data.text,
        id: that.data.stid,
        accessToken: that.data.access_token 

      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '修改成功！',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            compile: true
          });
          that.getDetails()
        }
      }
    })
  },
  //联系方式编辑点击事件
  redact() {
    this.setData({
      editor: true
    })
  },
  //联系方式编辑取消点击事件
  redactcancels() {
    this.setData({
      editor: false
    })
  },
  //添加联系方式点击事件
  add() {
    this.setData({
      addition: true
    })
  },
  //删除点击事件
  delet(e) {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/fromDel',
      method: 'get',
      data: {
        id: e.currentTarget.dataset.id
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除成功！',
            icon: 'none',
            duration: 2000
          });
          that.getDetails()
        } else {
          wx.showToast({
            title: '删除失败，请重试！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //添加联系方式提交点击事件
  formSubmit(e) {
    let that = this;
    let err = true;
    let matter = '';
    if (!e.detail.value.name) {
      matter = '姓名不能为空！'
    } else if (!(/^1[3456789]\d{9}$/.test(e.detail.value.phone))) {
      matter = '电话号码错误！'
    } else {
      err = false;
      wx.request({
        url: requestUrl.requestUrl + '/jXAssociationApp/fromAdd',
        method: 'post',
        data: {
          associationId: that.data.stid,
          fromType: '1',
          titile: e.detail.value.name,
          phone: e.detail.value.phone,
          remarks: e.detail.value.bz,
          accessToken: that.data.access_token 

        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 2000
            });
            that.setData({
              addition: false
            });
            that.getDetails()
          } else {
            wx.showToast({
              title: '添加失败，请重试！',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    };
    if (err) {
      wx.showToast({
        title: matter,
        icon: 'none',
        duration: 2000
      });
    }
  },
  //社团风采点击添加事件
  elegant() {
    this.setData({
      elegants: true
    })
  },
  //点击取消事件
  cancels() {
    this.setData({
      elegants: false
    })
  },
  //上传图片点击事件
  picture() {
    let that = this;
    wx.chooseImage({
      count: 9, //最多可以选择的图片总数
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        //启动上传等待中...
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
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
        // let pic = that.data.files.concat(str);
        that.bjjcImage(str)
        that.setData({
          bgimg: str,
        });
        that.addpicture(str)
      },
    })
  },
  //添加图片
  addpicture(str) {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/fromAdd',
      method: 'post',
      data: {
        associationId: that.data.stid,
        fromType: '2',
        img: str
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            addition: false
          });
          that.getDetails()
        } else {
          wx.showToast({
            title: '添加失败，请重试！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //删除图片点击事件

  delimg(e) {
    let that = this;
    wx.request({
      url: requestUrl.requestUrl + '/jXAssociationApp/fromDel',
      method: 'get',
      data: {
        id: e.currentTarget.dataset.id
      },
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除成功！',
            icon: 'none',
            duration: 2000
          });
          that.getDetails()
        } else {
          wx.showToast({
            title: '删除失败，请重试！',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    that.data.pageNum++;
    that.dynamic(that.data.pageNum)
  },
})