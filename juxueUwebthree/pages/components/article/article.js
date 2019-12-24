  const requestUrl = require('../../../utils/request.js')
  const app = getApp()
  Component({
    /** * 组件的属性列表*/
    properties: {
      attentionId: {
        type: String,
        value: "1",
      },
      attentionName: {
        type: String,
        value: "",
      },
      topicsName: {
        type: String,
        value: "",
      },
      topicsId: {
        type: String,
        value: "1",
      },
      associationId: {
        type: String,
        value: '1',
      }
    },

    /*** 组件的初始数据 */
    data: {
      title: '',
      // context: '',
      files: [],
      content: {},
      formats: {}, // 样式
      placeholder: '请开始你的表演',
      access_token: '',
      description: ''

    },
    /** * 组件的方法列表 */
    methods: {
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
        // let value = 'content.text'; // 注意这里哈
        // let html = 'content.html'

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
      //图片上传点击事件
      uploading() {
        let that = this;
        wx.chooseImage({
          count: 9,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            let tempFilePaths = res.tempFilePaths;
            let orig = that.data.files.length + tempFilePaths.length;
            if (orig > 9) {
              wx.showToast({
                title: '最多上传9张照片！',
                icon: 'none',
                duration: 2000
              })
            } else {
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
          }
        })
      },
      //点击添加图片
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

      //帖子发布点击事件
      issue() {
        let that = this;
        let reminder = '';
        let imgUrl = '';
        let userid = wx.getStorageSync('userid');
        let renzheng = wx.getStorageSync('renzheng');
        if (that.data.files.length > 0) {
          imgUrl = that.data.files.join(',');
        }
        if (!renzheng){
          reminder = "尚未认证，请先去认证个人信息！"
        }else if (!that.data.title) {
          reminder = "请编辑标题";
        } else if (!that.data.content) {
          reminder = "请编辑正文"
        } else {
          wx.request({
            url: requestUrl.requestUrl + '/jXCollagePostsApp/add',
            data: {
              title: that.data.title,
              associationId: that.data.associationId,
              context: JSON.stringify(that.data.content),
              imgUrl: imgUrl,
              isDraft: '0',
              userId: userid,
              authenticationType: '1',
              isVisible: '1',
              accessToken: that.data.access_token,
              talkId: that.data.topicsId
            },
            method: 'post',
            header: {
              'content-type': 'application/json',
              "content-type": "application/x-www-form-urlencoded"
            },
            success(res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '发布成功',
                  icon: "success",
                  duration: 2000
                })
                that.onEditorReady()

                let pages = getCurrentPages();
                if (pages[pages.length - 2]) {
                  if (pages[pages.length - 2].route == 'pages/my/myInvitation/myInvitation') {
                    pages[pages.length - 2].userdata(); //异步同步}
                  } else if (pages[pages.length - 2].route == 'pages/universityCircle/invitation/invitation') {
                    let pagedata = pages[pages.length - 2]
                    pagedata.setData({
                      currentTab: '1',
                    })
                  }
                }
              } else {
                wx.showToast({
                  title: '发帖失败，请重新发现！',
                  icon: "success",
                  duration: 2000
                })
              };
              that.setData({
                title: '',
                context: '',
                content: '',
                filePaths: '',
                description:''
              })
            }
          })
        };
        if (reminder) {
          wx.showToast({
            title: reminder,
            icon: 'none',
            duration: 2000
          })
        }
      },
      //查询是否存在草稿
      exist(e) {
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
              let html = 'content.html';
              let htmlval = res.data.data.context
              that.setData({
                title: res.data.data.title,
                description: res.data.data.context,
                filePaths: res.data.data.imgUrl, 
                [html]: htmlval,
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
    },
    attached() {
      this.exist()
    },
    detached: function(e) {
      if (this.data.content.text != undefined) {
        this.accessToken()
      }

    },
  })