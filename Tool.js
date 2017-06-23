"use struct";
var Tools = {
    /*
        移动端重置input样式
            -webkit-appearance: none;
            -ms-appearance: none;
            appearance: none;

    	若一个函数在定时器里，则函数中的this一定是window
    		getComputedStyle(elem).style 获取elem计算后的style样式
    		var e=e||window.event;
    		if(e.stopPropagation){
    			e.stopPropagation();
    		}
    		else{ e.cancelBubble=true; }
    		var tat=e.target||e.srcElement;
    		window.onscroll=function() { var top=document.body.scrollTop||document.documentElement.scrollTop; }

    	计算行间距margin
    		margin=行高x高度-字体大小x高度-字体大小

    	判断类型
        Object.prototype.toString.call(obj);
        obj instanceof ObjectType
    */

    init: function() {
        //阻止网站点击关闭
        window.isCloseHint = true;
        //初始化关闭
        window.addEventListener("beforeunload", function(e) {
            if (window.isCloseHint) {
                var confirmationMessage = "要记得保存！你确定要离开我吗？";
                (e || window.event).returnValue = confirmationMessage; // 兼容 Gecko + IE
                return confirmationMessage; // 兼容 Gecko + Webkit, Safari, Chrome
            }
        });
        //日期格式化
        Date.prototype.format = function(format) {
                var date = {
                    "M+": this.getMonth() + 1,
                    "d+": this.getDate(),
                    "h+": this.getHours(),
                    "m+": this.getMinutes(),
                    "s+": this.getSeconds(),
                    "q+": Math.floor((this.getMonth() + 3) / 3),
                    "S+": this.getMilliseconds()
                };
                if (/(y+)/i.test(format)) {
                    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                for (var k in date) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                            date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                    }
                }
                return format;
            }
            //解决IE8下不支持indexOf
        if (Array.prototype.indexOf === undefined) {
            Array.prototype.indexOf = function(val, fromi) {
                fromi === undefined && (fromi = 0);
                for (var leng = this.length, i = fromi; i < leng; i++) {
                    this[i] == val;
                    return i;
                }
                return -1;
            }
        }

        //解决IE8不支持trim
        if (String.prototype.trim === undefined) {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, ""); //去掉开头或结尾的空格
            }
        }

        //解决IE8不支持map
        if (Array.prototype.map === undefined) {
            Array.prototype.map = function(fun) {
                var arr = [];
                for (var i = 0; i < this.length; i++) {
                    (i in this) && (arr[i] = fun(this(i), i, this));
                }
                return arr;
            }
        }

        //解决IE8不支持create
        if (Object.prototype.create === undefined) {
            Object.prototype.create = function(father, props) {
                if (Object.setPrototypeOf !== undefined) {
                    var o = new Object();
                    Object.setPrototypeOf(o, father);
                } else {
                    function Construct() {}
                    Construct.prototype = father;
                    var o = new Construct();
                }
                if (props === undefined) {
                    return o;
                }
                Object.definedProperties(o, props);
                return o;
            }
        }

        //bind
        //基于一个现有函数，创建一个新函数，同时永久绑定this对象和部分参数。
        //var fun=Fun.bind(obj,*,*)
        //基于已有的Fun函数创建新函数fun，并且永久绑定this对象为obj
        if (Function.prototype.bind === undefined) {
            Function.prototype.bind = function(obj) {
                var f = this; //原函数对象
                var arg_1 = Array.prototype.slice.call(arguments, 1);
                return function() {
                    var arg_2 = Array.prototype.slice.call(arguments);
                    f.apply(obj, arg_1.concat(arg_2));
                }
            }
        }
    },
    //产生两数之间随机数
    getNum: function(max, min) {
        return parseInt(Math.random() * (max - min + 1) + min);
    },

    //去掉数组重复元素
    clearSame: function(arr) {
        if (String.splice === undefined) {
            for (var i = 0; i < arr.length - 1; i++) {
                for (var j = (i + 1); j < arr.length;) {
                    if (arr[i] == arr[j]) {
                        for (var k = j; k < arr.length - 1; k++) {
                            arr[k] = arr[k + 1];
                        }
                        arr.pop();
                        continue;
                    }
                    j++;
                }
            }
            return arr;
        }
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length;) {
                if (arr[i] == arr[j]) {
                    arr.splice(j, 1);
                    continue;
                }
                j++;
            }
        }
        return arr;
    },

    //获取a标签的href网址
    getUrl: function(str) {
        // str="<a name='sadas'></a><a href='http://baidu.com'></a><a href='http://www.souhu.com'></a>";
        var reg = /<a\s+[^>]*?href='([^']*?)'>/ig;
        var arr = [];
        var data = null;
        while ((data = reg.exec(str)) != null) { //data并没有被赋值
            arr[data.index] = data[1]; //   exec(String的match)返回一个数组，0代表匹配的元素，1-9表示括号的分组，index:出现的位置 ，input：接收的原参数a
        }
        return arr;
        // 输出 [20: "http://baidu.com", 51: "http://www.souhu.com"]
        // console.log(data)   输出还是null;
    },

    //首字母大写
    FirstUp: function(str) {
        var b = str.split(/\s/g);
        for (var i = 0, len = b.length; i < len; i++) {
            b[i] = b[i][0].toUpperCase() + b[i].slice(1);
        }
        return b + "";
    },

    //单词中每个字母出现次数，返回的是哈希数组
    wordNum: function(str) {
        //var str="helloworld";
        var arr = [];
        for (var i = 0, len = str.length; i < len; i++) {
            if (arr[str[i]] === undefined) {
                arr[str[i]] = 1;
            } else {
                arr[str[i]] += 1;
            }
        }
        return arr;
    },

    //冒泡排序(数字)  进行n-1轮，每轮比较次数比上一轮-1
    sort: function(arr, comp) {
        if (comp === undefined) {
            comp = function(x, y) {
                return x > y ? 1 : x < y ? 0 : 1
            }
        }
        for (var i = 1, len = arr.length; i < len; i++) {
            for (var j = 0; j < (len - i); j++) {
                if (comp(arr[j], arr[j + 1])) {
                    arr[j] += arr[j + 1];
                    arr[j + 1] = arr[j] - arr[j + 1];
                    arr[j] -= arr[j + 1];
                }
            }
        }
        return arr;
    },

    //获取给定日期和今天的差
    getDay: function(time) { //2013-2-2 00：00：00 接收字符串格式，可不带时间
        time = time.replace(/-/, '/');
        var now = new Date();
        var target = new Date(time);
        target = target.getTime(); //获取时间戳
        var des = (target - now) / 1000;
        var d = parseInt(des / 3600 / 24);
        d < 10 && (d = "0" + d);
        var h = parseInt(des % (3600 * 24) / 3600);
        h < 10 && (h = "0" + h);
        var m = parseInt(des % 3600 / 60);
        m < 10 && (m = "0" + m);
        var s = parseInt(des %= 60);
        s < 10 && (s = "0" + s);
        return (d + "天" + h + ":" + m + ":" + s);
    },
    //获取两条消息时间间隔
    //  time1上一条消息发送时间戳，time2本条消息发送时间戳，type是否是第一条
    //    根据消息时间与当前时间对比，得到时间差，第一条消息time1为0，type=1
    getChatIntervalTime: function(time1, time2, type) {
        var timeGap, msg2Timestamp, timeText = "";
        msg2Timestamp = new Date(parseInt(time2));
        if (!type) {
            timeGap = (time2 - time1) / 1000;
            var minutes = parseInt(timeGap / 60);
            if (minutes < 5) {
                return null;
            }
        }
        var msg2Date = new Date(time2).format("yyyy-MM-dd");
        var todayDate = new Date().format("yyyy-MM-dd");
        var msg2Time = new Date(time2).format("hh:mm");
        if (msg2Date == todayDate) {
            timeText = msg2Time;
        } else {
            var todayTimestamp = new Date(todayDate).getTime();
            var msg2DateTimestamp = new Date(msg2Date).getTime();
            if (todayTimestamp - msg2DateTimestamp <= 24 * 60 * 60 * 1000) {
                //昨天
                timeText = "昨天" + msg2Time;
            } else if (todayTimestamp - msg2DateTimestamp <= 7 * 24 * 60 * 60 * 1000) {
                //昨天之前
                var week = ["一", "二", "三", "四", "五", "六", "日"];
                timeText = "星期" + week[msg2Timestamp.getDay() - 1] + " " + msg2Time;
            } else {
                timeText = msg2Date + " " + msg2Time;
            }
        }
        return timeText;
    },

    //获取Url查询关键字，返回一个对象
    getParams: function() {
        var params = location.search;
        if (params != "") {
            var search = {};
            params = params.slice(1).split("&").forEach(
                function(v) {
                    var arr = v.split("=");
                    search[arr[0]] = arr[1];
                }
            );
            return search;
        }
    },

    //获取url中的参数
    getUrlParam: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return decodeURI(r[2]);
        return null; //返回参数值
    },

    //获取url#之后的参数
    getParamShape: function() {
        var params = window.location.href.split('#');
        if (params[1] != "") {
            var search = {};
            params = params[1].split("&").forEach(
                function(v) {
                    var arr = v.split("=");
                    search[arr[0]] = arr[1];
                }
            );
            return search;
        }
    },

    //Ajax
    getAjax: function() {
        var xhr = null;
        if (window.XMLHttpRequese) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHttp');
        }
        return xhr;
    },

    //blobObj
    //接收Blob和操作base64的字符串
    setBlob: function(blob, callback) {
        var reader = new window.FileReader();
        reader.readAsDataURL(blob);
        //读取文件是异步操作
        reader.onloadend = function() {
            var data = reader.result;
            callback(data);
        };
    },

    //X5以及安卓端浏览器不支持音频
    //接收base64字符
    // getBlob:function(dataurl) {
    //     var obj = dataurl.split(','), mime = obj[0].match(/:(.*?);/)[1], //获取类型
    //     bstr = atob(obj[1]);
    //     var n = bstr.length, arr = new Array(n);
    //     while (n--) {
    //             arr[n] = bstr.charCodeAt(n);
    //     }
    //     var u8arr=new Uint8Array(arr);
    //     return new Blob([u8arr], { type: mime });
    // 	},

    //接收base64字符和一个回调函数，对新读取的blob的操作在回调里完成
    getBlob: function(dataurl, callback) {
        var obj = dataurl.split(','),
            mime = obj[0].match(/:(.*?);/)[1], //获取类型
            bstr = atob(obj[1]);
        var n = bstr.length,
            arr = new Array(n);
        while (n--) {
            arr[n] = bstr.charCodeAt(n);
        }
        var u8arr = new Uint8Array(arr);
        var newblob = new Blob([u8arr], { type: mime });
        var url = URL.createObjectURL(newblob);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = function() {
            var blob = this.response;
            callback(blob);
            //操作完成之后，手动移除
            window.URL.revokeObjectURL(url);
        }
        xhr.send(null);
    },

    browser: {
        versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    },
    //var isAndroid = browser.versions.android;

    //判断打开页面的浏览器是否是微信
    wxBrowser: function() {
        if (this.browser.versions.mobile) { //判断是否是移动设备打开。browser代码在下面
            var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                //在微信中打开
                return true;
            }
        }
    },
    //解析json
    strToJson: function(str) {
        if (JSON.parse) {
            return JSON.parse(str);
        }
        var json = eval('(' + str + ')');
        return json;
    },
    //时间戳转换字符串格式2010-11-11
    timeToStr: function(time) {
        var d = new Date(parseInt(time));
        return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    },
    //字符串格式2010-11-11转换时间戳
    strToTime: function(str) {
        if (Date.parse) {
            return Date.parse(str);
        }
        var d = new Date(str);
        return d.getTime();
    },
    //md5加密
    md5: function(string) {
        function md5_RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function md5_AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function md5_F(x, y, z) {
            return (x & y) | ((~x) & z);
        }

        function md5_G(x, y, z) {
            return (x & z) | (y & (~z));
        }

        function md5_H(x, y, z) {
            return (x ^ y ^ z);
        }

        function md5_I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function md5_FF(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };

        function md5_GG(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };

        function md5_HH(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };

        function md5_II(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };

        function md5_ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function md5_WordToHex(lValue) {
            var WordToHexValue = "",
                WordToHexValue_temp = "",
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function md5_Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22;
        var S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20;
        var S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23;
        var S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;
        string = md5_Utf8Encode(string);
        x = md5_ConvertToWordArray(string);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = md5_AddUnsigned(a, AA);
            b = md5_AddUnsigned(b, BB);
            c = md5_AddUnsigned(c, CC);
            d = md5_AddUnsigned(d, DD);
        }
        return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
    },
}