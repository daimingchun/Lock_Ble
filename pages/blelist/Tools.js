class Tools{
    constructor(){}

    buf2hex(buffer){
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    versionCompare(ver1, ver2){
        var version1pre = parseFloat(ver1)
        var version2pre = parseFloat(ver2)
        var version1next = parseInt(ver1.replace(version1pre + ".", ""))
        var version2next = parseInt(ver2.replace(version2pre + ".", ""))
        if (version1pre > version2pre)
            return true
        else if (version1pre < version2pre)
            return false
        else {
            if (version1next > version2next)
                return true
            else
                return false
        }
    }
}

export default Tools;