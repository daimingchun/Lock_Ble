class Tools{
    constructor(){}

    test(str){
        let arr = []
        if ((str.length % 2) != 0) {
            console.log('数据有误')
        } else {
            let len = Math.ceil(str.length / 2)
            for (let i = 0; i < len; i++) {
                if (str.length >= 2) {
                    let strCut = str.substring(0, 2);
                    arr.push(strCut);
                    str = str.substring(2);
                } else {
                    str = str;
                    arr.push(str);
                }
            }
            let result = '';
            for (let i = 0; i < arr.length; i++) {
                result = result ^ arr[i];
            }
            let b = parseInt(result).toString(16).toUpperCase();
            if (b.length === 1) {
                b = '0' + b;
            }
            console.log(b)
            return b;
        }
    }
}

export default Tools;