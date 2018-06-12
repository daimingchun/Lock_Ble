import Tools from './Tools.js';

const Tls = new Tools();

const app = getApp();
var connectedDeviceId, ServiceId;
var characteristicId = [];
Page({
    data: {
        isConnected: false,
        name: '',
        advertisData: '',
        list: [],
        details: [],
        inputValue:null,
        connectedDeviceId:'',
        volume:'静音',
        longStr: '',
        shortStr: ''
    },

    querySystemStauts(){
        setTimeout(() => {
            this.writeValue('FC000701080EFE');
        }, 200)
    },

    queryUsedId() {
        setTimeout(() => {
            this.writeValue('FC0007020104FE');
        }, 200)
    },

    onLoad: function (options) {
        console.log(options)
        var that = this
        this.setData({
            isConnected: true,
            connectedDeviceId: options.connectedDeviceId,
            name: options.name,
            advertisData: options.advertisData
        })
        
        wx.getBLEDeviceServices({
            deviceId: that.data.connectedDeviceId,
            success: function (res) {
                console.log(res.services)
                var details = []
                for (var i = 0; i < res.services.length; i++) {
                    wx.getBLEDeviceCharacteristics({
                        deviceId: that.data.connectedDeviceId,
                        serviceId: res.services[i].uuid,
                        success: function (res) {
                            details.push(res)
                            if(details.length >= 12 ){
                                that.setData({
                                    details: details
                                })
                                console.log(that.data.details)
                            }
                            //   details.push({ serviceId: res.serviceId, characteristics: res.characteristics })

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
            this.writeValue('FC000701080EFE');
        }, 200)
        
    },

    setSwitch(e){
        console.log(e)
        let id = e.target.dataset.id;
        let value = e.detail.value;
        if (e.target.dataset.id === 'knobLock'){   //反锁模式
            if(value){
                console.log('true')
                this.writeValue('FC0009010701000EFE',id)
            }else{
                console.log('false')
                this.writeValue('FC0009010702000DFE',id)
            }
        }
        if (e.target.dataset.id === 'safeMode') {      //安全模式
            if (value) {
                this.writeValue('FC0009010704000BFE',id)
            } else {
                this.writeValue('FC00090107080007FE',id)
            }
        }
        if (e.target.dataset.id === 'openMode') {      //常开模式
            if (value) {
                this.writeValue('FC0009010710001FFE',id)
            } else {
                this.writeValue('FC0009010720002FFE',id)
            }
        }
        if (e.target.dataset.id === 'upLock') {      //上提模式
            if (value) {
                
                this.writeValue('FC00090107000807FE',id)
            } else {
                this.writeValue('FC0009010700101FFE',id)
            }
        }
    },

    setLanguage(e){         //语言设置
        let value = e.detail.value;
        if(value === 'zh'){
            this.writeValue('FC0009010740004FFE')
        }else{
            this.writeValue('FC0009010780008FFE')
        }
    },

    setVolume(e){           //音量调节
        let value = e.detail.value;
        console.log(value)
        if(value === 0){
            this.writeValue('FC0009010700040BFE')
            this.setData({
                volume : '静音'
            })
            
        }
        if (value === 33.3) {
            this.writeValue('FC0009010700030CFE')
            this.setData({
                volume : '低音'
            })
        }
        if (value === 66.6) {
            this.writeValue('FC0009010700020DFE')
            this.setData({
                volume : '中音'
            })
        }
        if (value > 66.6) {
            console.log(111)
            this.writeValue('FC0009010700010EFE')
            this.setData({
                volume : '高音'
            })
        }
    },

    writeValue(str,id){
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
                deviceId: this.data.connectedDeviceId,
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
                deviceId: this.data.connectedDeviceId,
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
                deviceId: this.data.connectedDeviceId,
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
        },200)

        setTimeout(() => {
            wx.writeBLECharacteristicValue({
                deviceId: this.data.connectedDeviceId,
                serviceId: "0000FFE5-0000-1000-8000-00805F9B34FB",
                characteristicId: "0000FFE9-0000-1000-8000-00805F9B34FB",
                value: buffer1,
                success: function (res) {
                    console.log(res)
                },
                fail: function (res) {
                    console.log(res)
                    console.log(id)
                    if (id === 'knobLock'){
                        that.setData({
                            knobLock: that.data.knobLock
                        })
                    }
                    if (id === 'safeMode') {
                        that.setData({
                            safeMode: that.data.safeMode
                        })
                    }
                    if (id === 'openMode') {
                        that.setData({
                            openMode: that.data.openMode
                        })
                    }
                    if (id === 'upLock') {
                        that.setData({
                            upLock: that.data.upLock
                        })
                    }
                    wx.showToast({
                        title: '设置失败',
                        duration: 1500
                    })
                }
            })
        },200)
        
        setTimeout(() => {
            wx.notifyBLECharacteristicValueChange({
                state: true,
                deviceId: this.data.connectedDeviceId,
                serviceId: "0000FFE0-0000-1000-8000-00805F9B34FB",
                characteristicId: "0000FFE4-0000-1000-8000-00805F9B34FB",
                success: function (res) {
                    console.log(res.errMsg)
                }
            })
        },200)

        wx.onBLECharacteristicValueChange(function (res) {
            //console.log(that.ab2hex(res.value));
            let value = that.ab2hex(res.value);

            if(value.length > 32){
                that.setData({
                    longStr: value
                })
            }
            if(value.length < 10){
                that.setData({
                    shortStr: value
                })
            }
            if(that.data.longStr && that.data.shortStr){
                let str = that.data.longStr + that.data.shortStr
                console.log(str);
                let PID = str.slice(2,4)
                let test = Tls.test(str.slice(10, 42))
                console.log(test)
                // console.log(PID)
                let data = `FC${PID}08020100`

                // console.log(str.slice(10,42))
            }





            if (value.indexOf('00090108') != -1) {
                let data = value.slice(12, 14) + value.slice(10, 12)
                console.log(data)
                let bin = parseInt(data, 16).toString(2)
                console.log(bin)
                let length = bin.length

                let knobLock = parseInt(bin.substring(length - 2, length), 2).toString(),
                    safeMode = parseInt(bin.substring(length - 4, length - 2), 2).toString(),
                    openMode = parseInt(bin.substring(length - 6, length - 4), 2).toString(),
                    language = parseInt(bin.substring(length - 8, length - 6), 2).toString(),
                    volume = parseInt(bin.substring(length - 11, length - 8), 2).toString(),
                    upLock = parseInt(bin.substring(length - 13, length - 11), 2).toString();
                that.setData({
                    knobLock: knobLock,
                    safeMode: safeMode,
                    openMode: openMode,
                    language: language,
                    volume: volume,
                    upLock: upLock
                })
                console.log(knobLock + '反锁')
                console.log(safeMode + '安全模式')
                console.log(openMode + '常开模式')
                console.log(language + '语言设置')
                console.log(volume + '音量设置')
                console.log(upLock + '上提')
            }
            if (value === 'fc00080107000efe') {
                wx.showToast({
                    title: '设置成功',
                    duration: 1500
                })
            }
            if (value === 'fc00080207000dfe') {
                wx.showToast({
                    title: '远程开门成功',
                    duration: 1500
                })
            }
            let bin = value.slice(10, 12) + value.slice(8, 10);
            // console.log(bin)
            // console.log(Number(bin).toString(2))
        }) 
    },

    bindButtonTap:function(e){
        // let str = 'FC0007020702FE';  //远程开锁
        let str = 'FC0007020702FE';
        //let str = 'FC000701080EFE';   //系统状态查询
        this.writeValue(str);
    },

    ab2hex: function (buffer){
        var hexArr = Array.prototype.map.call(
            new Uint8Array(buffer),
            function (bit) {
                return ('00' + bit.toString(16)).slice(-2)
            }
        )
        return hexArr.join('');
    },

    
    onShow: function () {
        console.log(1233333)
        if (wx.setKeepScreenOn) {
        wx.setKeepScreenOn({
            keepScreenOn: true,
            success: function (res) {
            //console.log('保持屏幕常亮')
            }
        })
        }
    },

    onReady:function(){
        console.log(1233333)
    },

    // onHide: function () {
    //     var that = this
    //     if (this.data.isConnected) {
    //     wx.closeBLEConnection({
    //         deviceId: this.data.connectedDeviceId,
    //         success: function (res) {
    //         console.log(res)
    //         that.setData({
    //             isConnected: false
    //         })
    //         }
    //     })
    //     }
    // },
    onUnload: function () {
        var that = this
        if (this.data.isConnected) {
        // wx.closeBLEConnection({
        //     deviceId: this.data.connectedDeviceId,
        //     success: function (res) {
        //     console.log(res)
        //     that.setData({
        //         isConnected: false
        //     })
        //     }
        // })
        }
    }
})