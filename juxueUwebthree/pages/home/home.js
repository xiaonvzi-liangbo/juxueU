 const requestUrl = require('../../utils/request.js')
 const time = require('../../utils/time.js')
 const quantity = require('../../utils/quantity.js')
 var app = getApp(); //获取应用实例
 Component({
   pageLifetimes: {
     show() {
       this.accredit()
     }
   },
   data: {
     imgUrls: [],
     navHeight: app.globalData.navHeight,
     navOneUrl: [{
         id: '0',
         url: '../images/district-1.png',
         linkUrl: '/pages/universityCircle/invitation/invitation',
         title: '大学圈'
       },
       {
         id: '1',
         url: '../images/district-2.png',
         linkUrl: '',
         title: '自习室'
       },
       {
         id: '2',
         url: '../images/district-3.png',
         linkUrl: '/pages/openClass/topTeacher/topTeacher',
         title: '名师公开课'
       },
       {
         id: '3',
         url: '../images/district-4.png',
         linkUrl: '/pages/education/promote/promote',
         title: '自我提升'
       },
       //自我测评

     ], //就业分析
     navTneUrl: [{
         id: '0',
         url: '../images/district-5.png',
         linkUrl: '/pages/CourseActivities/CourseActivities',
         title: '课程活动'
       },
       {
         id: '1',
         url: '../images/district-6.png',
         linkUrl: '',
         title: '大学生创业'
       },
       {
         id: '2',
         url: '../images/district-7.png',
         linkUrl: '/pages/prospects/Jobanalysis/Jobanalysis',
         title: '大学生就业'
       },
       {
         id: '3',
         url: '../images/district-8.png',
         linkUrl: '/pages/my/conversion/conversion',
         title: '简历超人'
       }
     ], //签到
     indicatorDots: true, //轮播指示点
     interval: 5000, //切换时间
     duration: 1000, //动画时长
     article: [],
     pageNum: 1,
     user: true,
     limits: true,
     logbut: false

   },
   methods: {
     //点击跳转页面
     navpage(e) {
       let that = this
       if (e.currentTarget.dataset.linkurl == '/pages/my/conversion/conversion' || e.currentTarget.dataset.linkurl == '' || e.currentTarget.dataset.linkurl == '') {
         wx.showToast({
           title: '正在开发，敬请期待！',
           icon: 'none',
           duration: 2000
         })
       } else {
         wx.navigateTo({
           url: e.currentTarget.dataset.linkurl,
         })
       }

     },
     //前往话题贴子
     topics(e) {
       wx.navigateTo({
         url: '/pages/tztopics/tztopics?topid=' + e.currentTarget.dataset.topid
       })
     },
     //点击授权
     getUserInfo(e) {
       let that = this
       if (e.detail.errMsg == "getUserInfo:ok") {
         let sessionKey = wx.getStorageSync('sessionKey')
         let openid = wx.getStorageSync('openid')

         wx.request({
             url: requestUrl.requestUrl + '/jXUserApp/authorization',
             method: 'post',
             data: {
               openId: openid,
               nickName: e.detail.userInfo.nickName,
               logo: e.detail.userInfo.avatarUrl,
               country: e.detail.userInfo.country,
               province: e.detail.userInfo.province,
               city: e.detail.userInfo.city
             },
             header: {
               'content-type': 'application/x-www-form-urlencoded',
               'Accept': 'application/json'
             },
             success(res) {
               if (res.data.code == 200) {
                 wx.showToast({
                   title: '授权成功',
                   icon: 'none',
                   duration: 2000,
                 })
                 wx.setStorageSync('uid', res.data.data.unionId)
                 wx.setStorageSync('userid', res.data.data.id)
                 wx.setStorageSync('quanxian', res.data.openId);
                 that.setData({
                   loginshow: true,
                   limits: true,
                   logbut: false,
                   log: res.data.data.logo,
                   niname: res.data.data.nickName,
                 })
               } else {
                 wx.showToast({
                   title: '授权失败!',
                   icon: 'none',
                   duration: 2000,
                 })
                 that.setData({
                   loginshow: false,
                   limits: false,
                   logbut: true,
                 })
               }
             }
           }),
           wx.request({
             url: requestUrl.requestUrl + '/jj/weChat/jm',
             method: 'POST',
             data: {
               encryptedData: e.detail.encryptedData,
               errMsg: sessionKey,
               iv: e.detail.iv
             },
             header: {
               'content-type': 'application/x-www-form-urlencoded',
               'Accept': 'application/json'
             },
             success(res) {
               that.setData({
                 userinfo: e.detail.userInfo,
                 but: false,
                 button: true
               })
               wx.setStorageSync('uid', res.data.unionId)
             }
           })
       }
     },
     //用户授权
     accredit() {
       let that = this;
       wx.getSetting({
         success: res => {
           if (res.authSetting['scope.userInfo']) {
             // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
             that.setData({
               limits: true,
               logbut: false
             })
           } else {
             that.setData({
               limits: false,
               logbut: true
             })
           }
         }
       })
     },
     //发帖人详情
     personage(e) {
       let that = this
       if (that.data.limits == false) {
         wx.showToast({
           title: '尚未登录，请立即登录！',
           icon: 'none',
           duration: 2000
         })
       } else {
         wx.navigateTo({
           url: '/pages/universityCircle/myPost/myPost?id=' + e.currentTarget.dataset.id,
         })
       }
     },
     //帖子详情点击事件
     particulars(e) {
       let that = this
       if (that.data.limits == false) {
         wx.showToast({
           title: '尚未登录，请立即登录！',
           icon: 'none',
           duration: 2000
         })
       } else {
         wx.navigateTo({
           url: '/pages/universityCircle/information/information?tzid=' + e.currentTarget.dataset.id,
         })
       }
     },
     //获取校园热点数据
     getdata() {
       let that = this;
       wx.request({
         url: requestUrl.requestUrl + '/jXCollagePostsApp/getList',
         data: {
           postsType: '首页',
           isDraft: '0',
           pageNum: that.data.pageNum,
           pageSize: '10'
         },
         method: 'GET',
         header: {
           'content-type': 'application/json',
           "content-type": "application/x-www-form-urlencoded"
         },
         success(res) {
           let information = res.data.rows
           for (let i = 0; i < information.length; i++) {
             //时间处理
             information[i].createTime = time.getDateDiff(information[i].createTime);
             //数量处理
             information[i].commentNumber = quantity.number(information[i].commentNumber);
             information[i].visitNumber = quantity.number(information[i].visitNumber)

             if (typeof(information[i].postsImg) == 'string') {
               information[i].postsImgs = information[i].postsImg.split(',')
             } 
           };
           that.setData({
             article: that.data.article.concat(information)
           });
         }
       })
     },
     strike() {
       this.data.pageNum++
         this.getdata()
     },
     //首页轮播图
     images() {
       let that = this
       wx.request({
         url: requestUrl.requestUrl + '/jXPictureManageApp/findByAutoFrom',
         data: {
           pageNum: that.data.pageNum,
           pmId: 7,
           pageSize: 4,
         },
         method: 'GET',
         header: {
           'content-type': 'application/json',
           "content-type": "application/x-www-form-urlencoded"
         },
         success(res) {
           let information = res.data.rows
           that.setData({
             imgUrls: that.data.imgUrls.concat(information)
           })
         }
       })
     }

   },
   attached() {
     this.accredit();
     this.getdata();
     this.images()
   }
 })