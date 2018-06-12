const app = getApp();
import Tools from '../../utils/Tools.js';

const Tls = new Tools();

Page({
    data: {
    
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '用户管理',
        })

        let that = this;
        let deviceId = app.globalData.deviceId;
        if (deviceId) {
            this.setData({
                isConnected: true,
                connectedDeviceId: deviceId,
            })
            wx.getBLEDeviceServices({
                deviceId: deviceId,
                success: function (res) {
                    var details = []
                    for (var i = 0; i < res.services.length; i++) {
                        wx.getBLEDeviceCharacteristics({
                            deviceId: deviceId,
                            serviceId: res.services[i].uuid,
                            success: function (res) {
                                details.push(res)
                                if (details.length >= 12) {
                                    that.setData({
                                        details: details
                                    })
                                }
                            },
                            fail: function (res) {
                                console.log(res)
                            }
                        })
                    }
                }
            })

            wx.onBluetoothAdapterStateChange(function (res) {
                console.log(res)
                if (!res.available) {
                    wx.closeBLEConnection({
                        deviceId: that.data.connectedDeviceId,
                        success: function (res) {
                            console.log(res)
                        }
                    })
                }
            })

            setTimeout(() => {
                this.writeValue('FC0007020104FE');
            }, 200)
        } else {
            wx.showModal({
                title: '',
                content: '请连接设备',
                showCancel: false
            })
        }

        if (wx.setKeepScreenOn) {
            wx.setKeepScreenOn({
                keepScreenOn: true,
                success: function (res) {
                    //console.log('保持屏幕常亮')
                }
            })
        }
    },
    onShow: function () {
        
    },
    onHide: function () {
    
    },
    onUnload: function () {
    
    },
    writeValue(str, id) {
        let that = this;
        let awakenValue = 'AA55AA55AA55AA55AA55';
        let typedArray = new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
        }));
        let awaken = new Uint8Array(awakenValue.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
        }));
        let awaken1 = awaken.buffer;
        let buffer1 = typedArray.buffer;



        setTimeout(() => {
            wx.writeBLECharacteristicValue({
                deviceId: that.data.connectedDeviceId,
                serviceId: "0000FFE5-0000-1000-8000-00805F9B34FB",
                characteristicId: "0000FFE9-0000-1000-8000-00805F9B34FB",
                value: awaken1,
                success: function (res) {
                    // console.log(res)
                },
                fail: function (res) {
                    console.log(res)
                }
            })
        }, 200)
        setTimeout(() => {
            wx.writeBLECharacteristicValue({
                deviceId: that.data.connectedDeviceId,
                serviceId: "0000FFE5-0000-1000-8000-00805F9B34FB",
                characteristicId: "0000FFE9-0000-1000-8000-00805F9B34FB",
                value: awaken1,
                success: function (res) {
                    // console.log(res)
                },
                fail: function (res) {
                    console.log(res)
                }
            })
        }, 200)
        setTimeout(() => {
            wx.writeBLECharacteristicValue({
                deviceId: that.data.connectedDeviceId,
                serviceId: "0000FFE5-0000-1000-8000-00805F9B34FB",
                characteristicId: "0000FFE9-0000-1000-8000-00805F9B34FB",
                value: awaken1,
                success: function (res) {
                    // console.log(res)
                },
                fail: function (res) {
                    console.log(res)
                }
            })
        }, 200)

        setTimeout(() => {
            wx.writeBLECharacteristicValue({
                deviceId: that.data.connectedDeviceId,
                serviceId: "0000FFE5-0000-1000-8000-00805F9B34FB",
                characteristicId: "0000FFE9-0000-1000-8000-00805F9B34FB",
                value: buffer1,
                success: function (res) {
                    console.log(res)
                },
                fail: function (res) {
                    console.log(res)
                    console.log(id)
                    if (id === 'knobLock') {
                        that.setData({
                            knobLock: that.data.knobLock
                        })
                        wx.showToast({
                            title: '设置失败',
                            duration: 1500
                        })
                    }
                    if (id === 'safeMode') {
                        that.setData({
                            safeMode: that.data.safeMode
                        })
                        wx.showToast({
                            title: '设置失败',
                            duration: 1500
                        })
                    }
                    if (id === 'openMode') {
                        that.setData({
                            openMode: that.data.openMode
                        })
                        wx.showToast({
                            title: '设置失败',
                            duration: 1500
                        })
                    }
                    if (id === 'upLock') {
                        that.setData({
                            upLock: that.data.upLock
                        })
                        wx.showToast({
                            title: '设置失败',
                            duration: 1500
                        })
                    }

                }
            })
        }, 200)

        setTimeout(() => {
            wx.notifyBLECharacteristicValueChange({
                state: true,
                deviceId: that.data.connectedDeviceId,
                serviceId: "0000FFE0-0000-1000-8000-00805F9B34FB",
                characteristicId: "0000FFE4-0000-1000-8000-00805F9B34FB",
                success: function (res) {
                    console.log(res.errMsg)
                }
            })
        }, 200)


        wx.onBLECharacteristicValueChange(function (res) {
            var value = that.ab2hex(res.value);
            if (value.indexOf('fc') != -1 && value.indexOf('fe') != -1) {
                value = value.match(/fc(\S*)fe/)[1];
                console.log(value.slice(0, value.length - 2))
                let p = Tls.test(value.slice(0, value.length - 2));
                if (p === value.slice(value.length - 2, value.length)) {
                    console.log('检验成功')
                    that.writeValue('FC000803020009FE')
                }
            } else {
                if (value.length > 38) {
                    that.setData({
                        longStr: value
                    })
                }
                if (value.length < 10) {
                    that.setData({
                        shortStr: value
                    })
                }
            }
            if (that.data.longStr && that.data.shortStr) {
                let value = that.data.longStr + that.data.shortStr;
                console.log(value)
                value = that.ab2hex(res.value);
                console.log(value)

            }

            
        })
    },
    ab2hex: function (buffer) {
        var hexArr = Array.prototype.map.call(
            new Uint8Array(buffer),
            function (bit) {
                return ('00' + bit.toString(16)).slice(-2)
            }
        )
        return hexArr.join('');
    }
})