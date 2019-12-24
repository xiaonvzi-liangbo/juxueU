const requestUrl = require('../../../utils/request.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    college:{
      type:String,
      value:''
    },
    disabled:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    school:[],
    college:'',
    show:false,
    number:1,
    collage:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    //监听输入框输入事件
    monitor(e){
      this.setData({
        college:e.detail.value,
        show:true
      });
      if (!this.data.college){
        this.setData({
          show: false
        })
      };
      this.getSchool(e.detail.value)
    },
    //选择院校点击事件
    choice(e){
      let name = e.currentTarget.dataset.name + '-' + e.currentTarget.dataset.cam
      this.setData({
        college:name,
        show:false
      });
      let checkeddata = { checkedNum: e.currentTarget.dataset.id };
      this.triggerEvent("traCheckedNum", checkeddata)
    },
    //上拉加载点击事件
    tolower(){
      this.data.number++;
      this.getSchool(this.data.college)
    },
    //获取校区
    getSchool(name){
      let that=this;
      wx.request({
        url: requestUrl.requestUrl +'/jXCollageApp/findByAuto',
        method:'get',
        data:{
          pageNum: that.data.number,
          pageSize:'100',
          isPass:'1',
          name:name
        },
        header:{
          'content-type': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res){
          that.setData({
            school: res.data.rows
          })
        }
      })
    }
  },
    attached() {
    this.setData({
      collage: this.data.collageName
    })
  }
})
