const app = getApp();
import Tools from '../../utils/Tools.js';

const Tls = new Tools();

let timer = null;

Page({
    data: {
        password:'',
        validTime: '',
        validNum: ''
    },
    onLoad: function (options) {
        let that = this;
        let deviceId = app.globalData.deviceId;
        if (deviceId) {
            this.setData({
                connectedDeviceId: deviceId,
            })
            wx.createBLEConnection({
                deviceId: deviceId,
                success: function (res) {
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
                        that.writeValue('AA55AA55AA55AA55AA55');
                    }, 200)
                    setTimeout(() => {
                        that.writeValue('AA55AA55AA55AA55AA55');
                    }, 200)
                },
            })

        } else {
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

            if (value.indexOf('fc') != -1 && value.indexOf('fe') != -1) {
                value = value.match(/fc(\S*)fe/)[1];
                let data = value.slice(0, value.length - 2);
                //console.log(value.slice(0, value.length - 2))
                let p = Tls.test(data);
                if (p === value.slice(value.length - 2, value.length)) {
                    console.log('检验成功')
                    if(value.includes('00110205')){
                        //console.log('设置临时密码成功')
                        let res = data.slice(8,data.length);
                        console.log('res:'+res)
                        let time = parseInt((res.slice(3, 5) + res.slice(0, 2)),16);
                        console.log(time)
                        let cnt = parseInt(res.slice(4,6))
                        console.log(cnt)
                        let key = res.slice(8,20)
                        console.log(key)
                        let arr = [];
                        for(let i = 0;i < key.length; i++){
                            if(i % 2 === 0){
                                arr.push(key[i] + key[i+1])
                            }
                        }
                        let str = '';
                        for(let i of arr){
                            str += String.fromCharCode(parseInt(i,16))
                        }
                        console.log(str)
                        that.setData({
                            valisNum: cnt,
                            password: str
                        })
                        let times = Tls.toHourMinute(time);
                        let {day,hour,minute} = times;
                        console.log(day,hour,minute)
                        let total = parseInt(day) * 86400 + parseInt(hour) * 3600 + parseInt(minute) * 60 + 30;
                        timer = setInterval(() => {
                           that.setData({
                                _day: Math.floor(total / 86400),
                                _hour: Math.floor((total - that.data._day * 86400) / 3600),
                                _minute: Math.floor((total - that.data._day * 86400 -that.data._hour * 3600) / 60),
                                _second: Math.floor((total - that.data._day * 86400 - that.data._hour * 3600 - that.data._minute * 60))
                           })
                           total--;
                           
                        },1000)
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
    onShow: function () {
        this.writeValue('FC0007020500FE')
    },
    onHide: function () {
    
    },
    onUnload: function () {
    
    },
    onShareAppMessage: function () {
    
    }
})