class Tools{
    constructor(){}

    test(str){    //十六进制字符串按异或运算
        let arr = [];
        for (let i = 0; i < str.length; i++) {
            if (i % 2 === 0) {
                arr.push(str.slice(i, i + 2))
            }
        }
        let res = 0;
        for (let i = 0; i < arr.length; i++) {
            res = res ^ parseInt(arr[i], 16);
        }
        let hex = parseInt(res).toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex;
    }

    MathRand(){    //随机获得六位数字
        var Num = "";
        for (var i = 0; i < 6; i++) {
            Num += Math.floor(Math.random() * 10);
        } 

        return Num;
    }

    toHourMinute(minutes){  //将分钟数量转为小时和分钟json格式
        return {
            day: parseInt(minutes / 60 / 24),
            hour: parseInt(minutes / 60 % 24),
            minute: minutes % 60
        }
    }
}

export default Tools;