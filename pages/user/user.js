const app = getApp();
import Tools from '../../utils/Tools.js';

const Tls = new Tools();

Page({
    data: {
        userIds:[]
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
                    //console.log(res)
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
                    //console.log(res.errMsg)
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
                let PID = value.slice(2,4);
                let data = value.slice(10, 42);
                for(let i = 0; i < data.length; i++){
                    if(i % 4 === 0){
                        that.data.userIds.push(data.slice(i,i+4))
                    }
                }
                let test = (Tls.test(`${PID}08020100`)).toUpperCase()
                that.writeValue(`FC${PID}08020100${test}FE`)
            }
            let _arr = [...new Set(that.data.userIds)];
            _arr = _arr.filter((item) => {
                    return item != "0000"
                    })
            _arr = _arr.map((item) => {
                return item.slice(2, 4) + item.slice(0, 2)
            }) 
            _arr = _arr.map((item) => {
                let binVal = parseInt(item, 16).toString(2);
                let length = binVal.length;
                let str0 = '';
                if(length != 16){
                    let num = 16 - length;
                    for(let i = 0;i < num; i++){
                        str0 += '0'
                    }
                }
                return str0 + binVal;
            })
            _arr = _arr.map((item) => {
                let ID = (item.slice(item.length-10,item.length)).toString(2);
                    ID = parseInt(ID,2)
                let IDTYPE = item.slice(item.length-12,item.length-10).toString(2);
                    IDTYPE = parseInt(IDTYPE,2).toString(16);
                let userType = item.slice(item.length - 15, item.length - 12).toString(2);
                    userType = parseInt(userType, 2).toString(16);
                switch (IDTYPE){
                    case '1':
                        IDTYPE = '管理员';
                        break;
                    case '2':
                        IDTYPE = '普通';
                        break;
                    case '3':
                        IDTYPE = '胁迫报警';
                        break;
                }
                switch (userType){
                    case '1':
                        userType = '指纹';
                        break;
                    case '2':
                        userType = '密码';
                        break;
                    case '3':
                        userType = '感应卡';
                        break;
                    case '4':
                        userType = '临时密码';
                        break;
                }
                
                    return { item, ID, IDTYPE, userType}
            })
            console.log(_arr)
            
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