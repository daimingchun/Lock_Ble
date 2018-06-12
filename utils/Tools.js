class Tools{
    constructor(){}

    test(str){
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

    MathRand(){
        var Num = "";
        for (var i = 0; i < 6; i++) {
            Num += Math.floor(Math.random() * 10);
        } 

        return Num;
    }
}

export default Tools;