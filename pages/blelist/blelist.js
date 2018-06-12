import Tools from './Tools.js';

const Tls = new Tools();
const app = getApp()
var devices_list = []
var connectedDeviceId
Page({
  data: {
    searching: false,
    button_width: 0,
    list_width: 0,
    list_height: 0
  },
  searchBluetooth: function () {
    var that = this
    if (!that.data.searching) {
      wx.closeBluetoothAdapter({
        complete: function (res) {
          wx.openBluetoothAdapter({
            success: function (res) {
              wx.getBluetoothAdapterState({
                success: function (res) {
                  
                }
              })
              wx.onBluetoothAdapterStateChange(function (res) {
                
                that.setData({
                  searching: res.discovering
                })
                if (!res.available) {
                  that.setData({
                    devices_list: [],
                    searching: false
                  })
                }
              })
              wx.onBluetoothDeviceFound(function (devices) {
                //剔除重复设备，兼容不同设备API的不同返回值
                var isnotexist = true
                if (devices.deviceId) {
                  var i = 0;
                  devices.advertisData = Tls.buf2hex(devices.advertisData)
                  if (devices.advertisData == "") {
                    devices.advertisData = '空'
                  }
                  if (devices.name == "") {
                    devices.name = '空'
                  }
                  for (i = 0; i < devices_list.length; i++) {
                    if (devices.deviceId == devices_list[i].deviceId) {
                      isnotexist = false
                    }
                  }
                  if (isnotexist) {
                    devices_list.push(devices)
                  }
                  else {
                    devices_list[i - 1].RSSI = devices.RSSI
                  }
                }
                else if (devices.devices) {
                  var i;
                  devices.devices[0].advertisData = Tls.buf2hex(devices.devices[0].advertisData)
                  if (devices.devices[0].advertisData == "") {
                    devices.devices[0].advertisData = '空'
                  }
                  if (devices.devices[0].name == "") {
                    devices.devices[0].name = '空'
                  }
                  
                  for (i = 0; i < devices_list.length; i++) {
                    if (devices.devices[0].deviceId == devices_list[i].deviceId) {
                      isnotexist = false
                    }
                  }
                  if (isnotexist) {
                    devices_list.push(devices.devices[0])
                  }
                  else {
                    devices_list[i - 1].RSSI = devices.devices[0].RSSI
                  }
                }
                else if (devices[0]) {
                  var i;
                  devices[0].advertisData = Tls.buf2hex(devices[0].advertisData)
                  if (devices[0].advertisData == "") {
                    devices[0].advertisData = '空'
                  }
                  if (devices[0].name == "") {
                    devices[0].name = '空'
                  }
                  console.log(devices[0])
                  for (i = 0; i < devices_list.length; i++) {
                    if (devices[0].deviceId == devices_list[i].deviceId) {
                      isnotexist = false
                    }
                  }
                  if (isnotexist) {
                    devices_list.push(devices[0])
                  }
                  else {
                    devices_list[i - 1].RSSI = devices[0].RSSI
                  }
                }
                that.setData({
                  devices_list: devices_list
                })
              })
              wx.startBluetoothDevicesDiscovery({
                allowDuplicatesKey: false,
                success: function (res) {
                //   console.log(res)
                  that.setData({
                    searching: true,
                    devices_list: []
                  })
                }
              })
            },
            fail: function (res) {
              console.log(res)
              wx.showModal({
                title: '提示',
                content: '请检查手机蓝牙是否打开',
                showCancel: false,
                success: function (res) {
                  that.setData({
                    searching: false,
                    devices_list: []
                  })
                }
              })
            }
          })
        }
      })
    }
    else {
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          console.log(res)
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  ConnectTo: function (e) {
    var that = this
    var advertisData, name
    // console.log(e.currentTarget.id)
    for (var i = 0; i < devices_list.length; i++) {
      if (e.currentTarget.id == devices_list[i].deviceId) {
        name = devices_list[i].name
        advertisData = devices_list[i].advertisData
      }
    }
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        // console.log(res)
        that.setData({
          searching: false
        })
      }
    })
    wx.showLoading({
      title: '连接蓝牙设备中...'
    })
    wx.createBLEConnection({
      deviceId: e.currentTarget.id,
      success: function (res) {
        // console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          duration: 2600
        })
        app.globalData.deviceId = e.currentTarget.id
        wx.switchTab({
            url: '../index/index',
        })
        
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '连接失败',
          showCancel: false
        })
      }
    })
  },
  onShow: function () {
    if (wx.setKeepScreenOn) {
      wx.setKeepScreenOn({
        keepScreenOn: true,
        success: function (res) {
          //console.log('保持屏幕常亮')
        }
      })
    }
  },
  onLoad: function () {
      this.searchBluetooth();

    this.setData({
      devices_list: [],
      button_width: app.getWindowWidth() - 32,
      list_width: app.getWindowWidth() - 32,
      list_height: app.getWindowHeight() - 82
    })
    if (app.getPlatform() == 'android' && Tls.versionCompare('6.5.7', app.getVersion())) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请更新至最新版本',
        showCancel: false
      })
    }
    else if (app.getPlatform() == 'ios' && Tls.versionCompare('6.5.6', app.getVersion())) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请更新至最新版本',
        showCancel: false
      })
    }
  },
  onHide: function () {
    // var that = this
    // this.setData({
    //   devices_list: []
    // })
    // if (this.data.searching) {
    //   wx.stopBluetoothDevicesDiscovery({
    //     success: function (res) {
    //       console.log(res)
    //       that.setData({
    //         searching: false
    //       })
    //     }
    //   })
    // }
  }
})
