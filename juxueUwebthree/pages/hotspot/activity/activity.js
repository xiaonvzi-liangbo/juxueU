import requestUrl from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check: false,
    title: '',
    text: '',
    picture: [],
    files: [],
    content: {},
    formats: {}, // 样式
    access_token: '',
    authenticationId: '',
    attentionId: '',
    attentionName: '',
    topicsName: "",
    topicsId: "",
    associationId: "",
    placeholder: '请开始你的表演',
    description: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      authenticationId: options.authenticationId
    })
  },
  //图片上传点击事件
  uploading() {
    let that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '上传中...',
          icon: 'loading',
          mask: true,
          duration: 10000
        });
        for (let i = 0; i < tempFilePaths.length; i++) {
          setTimeout(res => {
            that.upImgs(tempFilePaths[i])
            if (i == tempFilePaths.length - 1) {
              wx.hideLoading()
            }
          }, 1000 * i)
        }

      }
    })
  },
  //拼接添加图片
  upimg(str) {
    let that = this
    this.editorCtx.insertImage({
      src: str,
      width: '100%',
    })
  },
  //点击删除图片事件
  imageDeletion(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let paths = that.data.files;
    paths.splice(index, 1)
    that.setData({
      files: paths
    })
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
        that.upimg(imgurl)
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
        let pic = that.data.files.concat(str);
        that.jcImage(str)
        that.setData({
          files: pic
        })
      },
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
        } else {
          that.draftBox()
        }
      }
    })
  },

  //标题监听事件
  headline(e) {
    this.setData({
      title: e.detail.value
    })
  },
  //初始化
  onEditorReady(description) {
    const that = this
    that.createSelectorQuery().select('#editor').context(function(res) {
      that.editorCtx = res.context
      if (!res) return
      that.editorCtx.setContents({
        html: that.data.description ? that.data.description : '',
      })

    }).exec()
  },

  // 内容发生改变
  onContentChange(e) {
    let that = this
    let value = 'content.text'; // 注意这里哈
    let html = 'content.html'
    let text = e.detail.text
    let htmlval = e.detail.html
    that.setData({
      [html]: htmlval,
      [value]: text,
    })
  },
  //点击跳转事件
  into(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  //内容拼接
  invoke(e) {
    let that = this
    let attentionName = that.data.attentionName
    that.editorCtx.format('color', '#2896cc');
    that.editorCtx.insertText({
      text: '@' + attentionName,
      success() {
        that.editorCtx.format('color', '#000');
      }
    });

  },
  onShow: function() {
    var that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页
  },

  //选择是否同步点击事件
  choice() {
    this.setData({
      check: !this.data.check
    })
  },
  //发布文章点击事件
  issue() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    let visible = 1;
    let imgUrl = '';
    if (that.data.files.length > 0) {
      imgUrl = that.data.files.join(',');
    }

    if (that.data.check) {
      visible = 0;
    };
    if (!that.data.title) {
      wx.showToast({
        title: '请输入主题！',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: requestUrl.requestUrl + '/jXCollagePostsApp/add',
        method: 'POST',
        data: {
          title: that.data.title,
          context: JSON.stringify(that.data.content),
          isVisible: visible,
          userId: userid,
          authenticationType: '2',
          isDraft: '0',
          imgUrl: imgUrl,
          authenticationId: that.data.authenticationId,
          accessToken: that.data.access_token
        },
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.data.code == '200') {
            wx.showToast({
              title: '发布成功！',
              icon: 'none',
              duration: 2000
            })
            let pages = getCurrentPages();
            pages[pages.length - 2].dynamic(); //异步同步
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          }
        }
      })
    }
  },
  //查询是否存在草稿
  exist() {
    let that = this;
    let userid = wx.getStorageSync('userid');
    wx.request({
      url: requestUrl.requestUrl + '/jXCollagePostsApp/findByDraft',
      data: {
        userId: userid,
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          let value = 'content.text'; // 注意这里哈
          let html = 'content.html'
          that.setData({
            title: res.data.data.title,
            description: res.data.data.context,
            filePaths: res.data.data.imgUrl,
            html: res.data.data.context
          })
        }
      }
    })
  },
  //自动保存入草稿箱
  draftBox() {
    let that = this;
    let imgUrl = '';
    let userid = wx.getStorageSync('userid');
    if (that.data.content.text != undefined) {
      if (that.data.files.length > 0) {
        imgUrl = that.data.files.join(',');
      }
      wx.request({
        url: requestUrl.requestUrl + '/jXCollagePostsApp/addDraft',
        data: {
          title: that.data.title,
          authenticationId: that.data.associationId,
          context: JSON.stringify(that.data.content),
          imgUrl: imgUrl,
          isDraft: '1',
          userId: userid,
          talkId: that.data.topicsId,
          authenticationType: '1',
          isVisible: '1',
          accessToken: that.data.access_token,
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
      })
    }
  },
})