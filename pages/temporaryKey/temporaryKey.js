import Tools from '../../utils/Tools.js';

const Tls = new Tools();
 
const hours = []
const minutes = []
const nums = []

for (let i = 0; i <= 24; i++) {
    hours.push(i)
}

for (let i = 0; i <= 60; i++) {
    minutes.push(i)
}

for(let i = 1; i <= 10; i++){
    nums.push(i)
}

const app = getApp();
var connectedDeviceId, ServiceId;
var characteristicId = [];
Page({
    data: {
        hours: hours,
        minutes: minutes,
        nums: nums,
        num: 1,
        hour:0,
        minute: 30,
        value: [0, 30],
        value1:[0],
        pass: Tls.MathRand(),
        focus:false
    },
    onLoad: function (options) {
        const pass = Tls.MathRand();
        wx.setNavigationBarTitle({
            title: '临时密码',
        })
        let that = this;
        let deviceId = app.globalData.deviceId;
        if (deviceId) {
            this.writeValue('AA55AA55AA55AA55AA55')
            this.writeValue('AA55AA55AA55AA55AA55')
            this.setData({
                connectedDeviceId: deviceId,
            })
        }
    },
    onShow: function () {
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
    onHide: function () {
    
    },
    onUnload: function () {

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
    bindChange: function (e) {
        const val = e.detail.value
        this.setData({
            hour: this.data.hours[val[0]],
            minute: this.data.minutes[val[1]]
        })
    },
    bindChange2: function(e){
        const val = e.detail.value;
        this.setData({
            num: this.data.nums[val[0]],
        })
    },
    emptyKey: function(){
        console.log(123)
        this.setData({
            pass: '',
            focus:true
        })
    },
    setKey:function(){
        let key = this.data.pass,
            time = this.data.hour * 60 + this.data.minute,
            num = this.data.num;
        if(key === ''){
            wx.showModal({
                title: '提示',
                content: '请输入临时密码',
                showCancel:false
            })
        }
        if(key.length != 6){
            wx.showModal({
                title: '提示',
                content: '请输入6位数字的密码',
                showCancel: false
            })
        }
        let TIME = parseInt(time).toString(16);
        let CNT = parseInt(num).toString(16);
        let KEY = '';
        if (TIME.length === 1){
            TIME = '0' + TIME + '00'
        }
        if (TIME.length === 2) {
            TIME = TIME + '00'
        }
        if (TIME.length === 3) {
            let aa = '0' + TIME;
            TIME = aa.slice(2,3) + aa.slice(0,1)
        }
        if (CNT.length === 1){
            CNT = '0' + CNT
        }
        for(let i of key){
            KEY += i.charCodeAt().toString(16)
        }
        let p = Tls.test(`00110203${TIME}${CNT}06${KEY}`)
        const keyPass = `FC00110203${TIME}${CNT}06${KEY}${p}FE`
        this.writeValue(keyPass)
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
                let data = value.slice(0, value.length - 2)
                let p = Tls.test(data);
                if (p === value.slice(value.length - 2, value.length)) {
                    if (value.includes('000a0203')){   //设置临时密码的回馈
                        console.log(data.slice(8, value.length))
                        let ID = data.slice(8,12);
                        let STATE = data.slice(12,14)
                        console.log(ID)
                        console.log(STATE)
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
})