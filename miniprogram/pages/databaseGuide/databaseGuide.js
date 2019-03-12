// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({
  data: {
    step: 1,
    counterId: '',
    openid: '',
    count: '',
    queryResult: '',
    msgData: [] ,
    otherData: []
  },
  changeInputValue(ev) {
    this.setData({
      inputVal: ev.detail.value
    })
  },
  //删除留言
  DelMsg(ev) {
    const db = wx.cloud.database()
    var n = ev.target.dataset.index;

    var list = this.data.msgData;
    list.splice(n, 1);

    this.setData({
      msgData: list
    });
    db.collection('msgData').doc(this.data._openid).update({
      data: {
        msgData: list,
      },
    })
  },
  //添加留言
  addMsg() {
    var list = this.data.msgData;
    list.push({
      msg: this.data.inputVal
    });
    //更新
    this.setData({
      msgData: list,
      inputVal: ''
    });
    const db = wx.cloud.database()
    db.collection('msgData').add({
      data: {
        msgData: list,
      },
    })
    console.log(list)
    console.log(this.data.msgData)
  },

  updMsg() {
    var list = this.data.msgData;
    list.push({
      msg: this.data.inputVal
    });
    //更新
    this.setData({
      msgData: list,
      inputVal: ''
    });
    const db = wx.cloud.database()
    db.collection('msgData').doc(this.data._openid).update({
      data: {
        msgData: list,
      },
    })
  },

onShow()
{
 // console.log('1')
 let that  = this
  const db = wx.cloud.database()
  console.log(this.data.msgData)
  var temp=[]
  db.collection('msgData').get(
  {
    success(res) {
      console.log('22222222')
      temp = res.data
      console.log(temp[0].msgData)
      //this.data.msgData = temp[0].msgData
      var tmp = temp[0].msgData
      console.log(tmp)
      //this.data.msgData = tmp
      console.log(that.data.msgData)
      console.log('成功')
      that.setData({
        msgData: temp[0].msgData
      })
      // this.setData({
      //   //msgData: []
      // })
      // console.log('33333333333333333333333')
      // console.log(this.data.msgData)
      
      // this.setData({
      //   msgData: temp[0].msgData
      // })
      // console.log('res.data')
      // for (var i = 0; i < temp.length; i++) {
      //   console.log(temp[i])
      //   console.log(this.data._openid)
      //   //this.data.msgData = temp[i].msgData
      //   console.log('相等')
      //   if(temp[i]._openid==this.data._openid)
      //   {
      //     console.log('相等')
      //     this.data.msgData = temp[i].msgData
      //   }
      //   else
      //   {
      //     console.log('不相等')
      //     var list = this.data.otherData;
      //     list.push({
      //       msg: temp[i].msgData
      //     });
      //     this.setData({
      //       otherData: list,
      //       inputVal: ''
      //     });
      //     //otherData=temp[i].msgData
      //   }
      // }
      //console.log(temp[0])
    }
  },)
  
  console.log(this.data.msgData)
  console.log("结束")

},

  onLoad: function (options) {
    // const db = wx.cloud.database()
    // db.collection('msgData').get(
    //   {
    //     success(res)
    //     {
    //       msgData=res.msgData
    //       console.log(res.data)
    //     }
    //   }
    // )
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  

  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('counters').add({
      data: {
        count: "你好"
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  onQuery: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('counters').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  onCounterInc: function() {
    const db = wx.cloud.database()
    const newCount = this.data.count + 1
    db.collection('counters').doc(this.data.counterId).update({
      data: {
        count: newCount
      },
      success: res => {
        this.setData({
          count: newCount
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  onCounterDec: function() {
    const db = wx.cloud.database()
    const newCount = this.data.count - 1
    db.collection('counters').doc(this.data.counterId).update({
      data: {
        count: newCount
      },
      success: res => {
        this.setData({
          count: newCount
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  onRemove: function() {
    if (this.data.counterId) {
      const db = wx.cloud.database()
      db.collection('counters').doc(this.data.counterId).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          this.setData({
            counterId: '',
            count: null,
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
  },

  nextStep: function () {
    // 在第一步，需检查是否有 openid，如无需获取
    if (this.data.step === 1 && !this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            step: 2,
            openid: res.result.openid
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    } else {
      const callback = this.data.step !== 6 ? function() {} : function() {
        console.group('数据库文档')
        console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html')
        console.groupEnd()
      }

      this.setData({
        step: this.data.step + 1
      }, callback)
    }
  },

  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },

  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }

})