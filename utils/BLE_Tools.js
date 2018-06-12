class bleState{
    constructor(){}

    //蓝牙模块是否打开
    isOpenBle(){
        let state = null;
        wx.openBluetoothAdapter({
            success: function(res) {
               state = true
            },
            fail: function(){
                
            }
        })
    }
}
export default bleState;