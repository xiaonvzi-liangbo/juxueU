import requestUrl from '/request.js'
//文件上传服务器
// function upImg(imgurl) {
//   console.log('str')
//   let that = this;
//   wx.uploadFile({
//     url: 'https://staticfile.xlcwx.com/api/modalupload/image',
//     filePath: imgurl,
//     name: 'upload',
//     header: {
//       "Content-Type": "multipart/form-data"
//     },
//     success(res) {
//       let arr = res.data.split('"');
//       let str = arr[3].replace(/^(\s|")+|(\s|ab)+$/g, '');
//       console.log(str)
//       that.jcImage(str)
//       console.log(str)
//       return str
//     },
//   })
// }
// 涂片检测
function jcImage(imgurl) {
  let that = this;
  wx.request({
    url: requestUrl.requestUrl + '/jj/weChat/getAccessToken',
    method: "get",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    success(res) {
      wx.request({
        url: requestUrl.requestUrl + '/jj/weChat/checkImage',
        method: "post",
        data: {
          accessToken: res.data.data,
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
    }
  })
}
module.exports = { 
  jcImage: jcImage
}