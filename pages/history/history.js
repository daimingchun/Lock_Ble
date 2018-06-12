const app = getApp()
Page({
    data: {
    
    },
    onLoad: function (options) {
        console.log(app.globalData)
        setTimeout(() =>{
            console.log(121212)
        },100)
        
        wx.setNavigationBarTitle({
            title: '历史记录',
        })
    },
    onShow: function () {
        setTimeout(() => {
            console.log('show')
        }, 1000)
    },
    onHide: function () {
    
    },
    onUnload: function () {
    
    }
})