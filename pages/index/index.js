// index.js
const app = getApp()

Page({
  data: {
    shutter_color: "#eeeeee",
    uploader_stat: 0,
    img_src: "../../assets/camera.png",
    show: false
  },
  tapframe(e) {
    let { uploader_stat } = this.data
    let that = this
    if (uploader_stat === 0) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          const tempFilePaths = res.tempFilePaths[0]
          that.setData({
            shutter_color: "#cf0808",
            uploader_stat: 1,
            img_src: tempFilePaths
          })
        }
      })
    } else {
      wx.previewImage({
        urls: [this.data.img_src],
      })
    }
  },
  moreAction(e) {
    let that = this
    if(this.data.uploader_stat === 0) {
      wx.showActionSheet({
        itemList: ['📷 上传图片', '关于'],
        success (res) {
          console.log(res.tapIndex)
          if(res.tapIndex === 0) {
            wx.chooseImage({
              count: 1,
              sizeType: ['original', 'compressed'],
              sourceType: ['album', 'camera'],
              success (res) {
                const tempFilePaths = res.tempFilePaths[0]
                that.setData({
                  uploader_stat: 1,
                  img_src: tempFilePaths
                })
              }
            })
          } else if(res.tapIndex === 1) {
            that.setData({
              show: true
            })
          }
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    } else {
      wx.showActionSheet({
        itemList: ['🗑️删除图片', '关于'],
        success (res) {
          console.log(res.tapIndex)
          if(res.tapIndex === 0) {
            that.setData({
              uploader_stat: 0,
              img_src: "../../assets/camera.png"
            })
          } else if(res.tapIndex === 1) {
            that.setData({
              show: true
            })
          }
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  ganImg(e) {
    if(this.data.shutter_color === "#eeeeee") {
      wx.showToast({
        title: '请点击相框添加一张图片😄',
        icon: "none"
      })
    } else {
      let that = this
      that.setData({
        shutter_color: "#eeeeee"
      })
      console.log("hi")
      const fileManager = wx.getFileSystemManager()
      const { img_src } = this.data
      let img_base64 = fileManager.readFileSync(img_src, 'base64')
      let data = {
        "img_base64": img_base64
      }
      wx.request({
        url: `${app.globalData.server}/api/anime`,
        method: 'POST',
        data: data,
        success(res) {
          console.log(res)
          that.setData({
            shutter_color: "#cf0808",
            btn_stat: false,
            img_src: 'data:image/png;base64,' + res.data
          })
        },
        fail(err) {
          console.log(err)
        }
      })
    }
    console.log("hei")
  },
  onLoad() {
  }
})
