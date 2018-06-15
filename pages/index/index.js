const app = getApp();
import Tools from '../../utils/Tools.js';

const Tls = new Tools();
Page({
    data: {
        connectedDeviceId:'',
        state:'',
        valWidth: 0
    },
    onLoad: function (options) {
        
    },
    onShow: function () {
        let that = this;
        let deviceId = app.globalData.deviceId;
        if (deviceId) {
            this.setData({
                connectedDeviceId: deviceId,
            })
            wx.createBLEConnection({
                deviceId: deviceId,
                success: function(res) {
                    console.log(deviceId)
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
                        that.writeValue('AA55AA55AA55AA55AA55');   //唤醒模块
                    }, 200)
                    setTimeout(() => {
                        that.writeValue('AA55AA55AA55AA55AA55');
                    }, 200)

                    setTimeout(() => {
                        that.writeValue('FC0007030105FE');        //查询门锁信息
                    },200)
                    setTimeout(() => {
                        console.log(deviceId)
                        that.writeValue('FC0007030105FE');        //查询门锁信息
                    }, 200)
                },
            })
            
        } else {
            console.log('连接失败')
            // wx.showModal({
            //     title: '',
            //     content: '请连接设备',
            //     showCancel: false
            // })
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
    onHide: function () {
    
    },
    onUnload: function () {
    
    },
    onPullDownRefresh: function () {
        
    },
    toBleList:function(){
        wx.openBluetoothAdapter({
            success: function(res) {
                wx.navigateTo({
                    url: '../blelist/blelist',
                })
            },
            fail: function(){
                wx.showModal({
                    title: '提示',
                    content: '请打开蓝牙，连接设备',
                    showCancel: false
                })
            }
        })
        
    },
    opendoor:function(){
        let that = this;
        let str = 'FC0007020702FE';
        wx.openBluetoothAdapter({
            success: function(res) {
                wx.getConnectedBluetoothDevices({
                    services: ['0000FFE5-0000-1000-8000-00805F9B34FB'],
                    success: function(res) {
                        console.log(res)
                        if(res.devices.length != 0){
                            that.writeValue(str);
                        }else{
                            wx.showModal({
                                title: '提示',
                                content: '请连接设备',
                                showCancel: false
                            })
                        }
                    },
                })
                
            },
            fail:function(){
                wx.showModal({
                    title: '提示',
                    content: '请打开蓝牙，连接设备',
                    showCancel:false
                })
            }
        })
        
    },
    setTemporaryKey:function(){
        wx.navigateTo({
            url: '../setTemporaryKey/setTemporaryKey',
        })
    },
    queryTemporaryKey: function(){
        wx.navigateTo({
            url: '../showTemporaryKey/showTemporaryKey',
        })
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
                    // console.log(res)
                },
                fail: function (res) {
                    
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
                    // console.log(res.errMsg)
                }
            })
        }, 200)

        wx.onBLECharacteristicValueChange(function (res) {
            let value = that.ab2hex(res.value);
            console.log(value)
            if (value === 'fc00080207000dfe') {
                wx.showToast({
                    title: '远程开门成功',
                    duration: 1500
                })
                that.setData({
                    state: '已开锁'
                })
            }

            if (value.indexOf('fc') != -1 && value.indexOf('fe') != -1) {
                value = value.match(/fc(\S*)fe/)[1];
                console.log(value.slice(0, value.length - 2))
                let p = Tls.test(value.slice(0, value.length - 2));
                if (p === value.slice(value.length - 2, value.length)) {
                    console.log('检验成功')
                    if(p.indexOf('00100302') != 0){
                        wx.showToast({
                            title: '验证成功',
                            duration: 1500
                        })
                        that.writeValue('FC000803020009FE')
                    }
                    
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
    },
})