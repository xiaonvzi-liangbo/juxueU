const requestUrl = require('../../../../utils/request.js')
const number = require('../../../../utils/quantity.js')
const time = require('../../../../utils/time.js')

Component({

  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer(visible) {
        if (visible && !this.beginDraw) {
          // this.draw()
          this.beginDraw = true
        }
      }
    },
  },
  data: {
    beginDraw: false,
    isDraw: false,
    twoDimension: '',
    mine: [],
    phone: ''

  },

  methods: {
    handleClose() {
      this.triggerEvent('close')
    },
    // 保存
    handleSave() {
      let that = this
      var imgSrc = that.data.twoDimension; //base64编码
      var save = wx.getFileSystemManager();
      var number = Math.random();
      save.writeFile({
        filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
        data: imgSrc,
        encoding: 'base64',
        success: res => {
          wx.saveImageToPhotosAlbum({
            filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
            success: function(res) {
              wx.showToast({
                title: '保存成功',
              })
            },
            fail: function(err) {
            }
          })
        },
        fail: err => {
        }
      })
    },
  }
})