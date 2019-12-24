// pages/components/model2/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal:{
      type:Boolean,
      value:false
    },
    width:{
      type: String,
      value: '45%'
    },
    radius:{
      type: String,
      value: '30rpx'
    },
    close:{
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    delayed:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //打开消息提示
    show(){
      let that = this;
      that.setData({
        showModal:true
      })
      if (that.data.close){
        that.data.delayed = setTimeout(() => {
          that.setData({
            showModal: false
          })
        }, 3000)
      }
    },
    //点击关闭消息提示
    close(){
      let that=this;
      that.setData({
        showModal: false
      });
      if (that.data.close){
        clearTimeout(that.data.delayed)
      }
    },
    hold(){
      
    }
  },
  //组件生命周期
  attached(){

  }
})
