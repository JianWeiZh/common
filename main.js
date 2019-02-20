;(function (golden, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(golden)
    } else if (typeof define === "function" && define.amd) {
        define('plus', [], function () {
            return factory(golden);
        });
    } else {
        window.plus = factory(golden)
        if (jQuery) {
            window.$ = $.extend(window.$, factory(golden))
        }
    }
})(window, function () {
    var plus = {}
    /**
     * 存储localStorage
     */
    plus.setLocalStore = (name, content) => {
      if (!name) return;
      if (typeof content !== 'string') {
        content = JSON.stringify(content);
      }
      window.localStorage.setItem(name, content);
    }

    /**
     * 获取localStorage
     */
    plus.getLocalStore = name => {
      if (!name) return;
      return window.localStorage.getItem(name);
    }

    /**
     * 删除localStorage
     */
    plus.removeLocalStore = name => {
      if (!name) return;
      window.localStorage.removeItem(name);
    }
    //判断是否为微信
    plus.is_weixin = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/micromessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    //获取URL上参数
    plus.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return ''
    }


    /**
     * 获取地址栏参数
     * @param name
     * @returns {string}
     */
    plus.getQueryStringByName = function (name) {
      var result = document.location.search.match(new RegExp('[\?\&]' + name + '=([^\&]+)', 'i'))
      if (result == null || result.length < 1) {
        return ''
      }
      return result[1]
    }

    plus.getUrlObject = function (url) {
        url = url || location.search
        url = url.split('?')[1] || ''

        if (url) {
            var list = url.split('&')
            if (list && list.length) {
                var object = {}
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    object[obj.split('=')[0]] = obj.split('=')[1]
                }
                return object
            }

            return ''
        }

        return ''


    }


    plus.set_font = function (size) {

        // 计算、转换布局单位
        var html = document.getElementsByTagName('html')[0];
        var designFontSize = 100,
            designWidth = size ? size : 750;

        function setFontSize() {
            var winWidth = document.documentElement.getBoundingClientRect().width;
            var fontSize = winWidth / designWidth * designFontSize;

            html.style.fontSize = fontSize + 'px';
        }

        setFontSize();
        window.addEventListener('resize', function () {
            setFontSize();
        });

        return this;
    }

    // rem布局
    (function () {
        var docEl = window.document.documentElement
        var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
        /**
        * ================================================
        *   设置根元素font-size
        * 当设备宽度为375(iPhone6)时，根元素font-size=16px;
        × ================================================
        */
        var refreshRem = function () {
            var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
            console.log(clientWidth)
            if (!clientWidth) return
            var fz
            var width = clientWidth
            fz = 100 * width / 750
            docEl.style.fontSize = fz + 'px'
        }
        if (!document.addEventListener) return
        window.addEventListener(resizeEvt, refreshRem, false)
        document.addEventListener('DOMContentLoaded', refreshRem, false)
        refreshRem()
    }())

    //删除HTML里面标签
    plus.DELHTML = function (str) {
        return str ? str.replace(/<[^>].*?>/g, "") : str;
    }

    //base64加密
    plus.base64encode = function (str) {
        var encryptedHexStr = CryptoJS.enc.Utf8.parse(str);
        var words = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        return words
    }
    //base64解密
    plus.base64decode = function (str) {
        var words = CryptoJS.enc.Base64.parse(str);
        words = words.toString(CryptoJS.enc.Utf8);
        return words
    }

    plus.fdate = function (date, fmt) {
        //date=new Date(dates);
        //fmt=fmts||'yyyy-MM-dd hh:mm';
        var o = {
            "M+": date.getMonth() + 1,
            //月份
            "d+": date.getDate(),
            //日
            "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
            //小时
            "H+": date.getHours(),
            //小时
            "m+": date.getMinutes(),
            //分
            "s+": date.getSeconds(),
            //秒
            "q+": Math.floor((date.getMonth() + 3) / 3),
            //季度
            S: date.getMilliseconds()
        };
        var week = {
            "0": "日",
            "1": "一",
            "2": "二",
            "3": "三",
            "4": "四",
            "5": "五",
            "6": "六"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "星期" : "周" : "") + week[date.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return fmt;
    };
    Date.prototype.addDays = function (number) {
        var adjustDate = new Date(this.getTime() + 24 * 60 * 60 * 1e3 * 30 * number);
        //alert("Date" + adjustDate.getFullYear()+"-"+adjustDate.getMonth()+"-"+adjustDate.getDate());
        return;
    };

    //本地存储实现搜索历史功能，支持最新搜索在列表最上方，支持存储json数据
    plus.searchHsitory = function(){
        this.history = function(keyName){
            var arr = localStorage.getItem(keyName)?JSON.parse(localStorage.getItem(keyName)):[];
            return arr;
        };
        this.unique = function(arr,keyName){
            var res = [],json = {};
            for(var i=0;i<arr.length;i++){
                if(typeof arr[i] == 'string'){
                    if(!json[arr[i]]){
                        res.push(arr[i]);
                        json[arr[i]] = 1;
                    }else{
                        if(!json[arr[i][keyName]]){
                            res.push(arr[i]);
                            json[arr[i][keyName]] = 1;
                        }
                    }
                }
            }
            return res;
        };
        this.set = function(val,keyName,msgNum){
            var arr = this.history(keyName);
            arr.unshift(val);
            if(typeof val[0] == 'string'){
                arr = this.unique(arr);
            }else{
                for(var i in arr[0]){};
                arr = this.unique(arr,i)
            }
                
            if(arr.length>msgNum){
                arr = arr.slice(0,msgNum);
            }
            localStorage.setItem(keyName,JSON.stringify(arr));
        };
    }

    // 数组快速排序
    plus.quicksort = function (arr) {
        if(arr.length<=1){return arr};
        var pivotIndex = Math.floor(arr.length/2);
        var pivot = arr.splice(pivotIndex,1)[0];
        var left = [],right = [];
        for(var i=0;i<arr.length;i++){
            if(arr[i]<=pivot){
                left.push(arr[i]);
            }else{
                right.push(arr[i]);
            }
        }

        return left.quicksort().concat([pivot],right.quicksort());
    }

    // 根据传入的日期获取周几
    plus.getWeek = function (date) {
        var d = new Date(date)
        var weekday=new Array(7);
        weekday[0]="星期日";
        weekday[1]="星期一";
        weekday[2]="星期二";
        weekday[3]="星期三";
        weekday[4]="星期四";
        weekday[5]="星期五";
        weekday[6]="星期六";
        return weekday[d.getDay()]
    }

    return plus

});

/*
 sessionStorage & localStorage 封装
 @param storageName [String] // 默认sessionStorage
*/
export default class {
  constructor(storageName) {
    this.storage = storageName || 'sessionStorage'
  }
  setItem(key, val) {
    const storage = window[this.storage]
    storage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val)
  }
  getItem(key) {
    const storage = window[this.storage]
    const val = storage.getItem(key)
    let rst
    try {
      rst = JSON.parse(val)
    } catch (err) {
      rst = val
    }
    return rst
  }
  removeItem(key) {
    const storage = window[this.storage]
    storage.removeItem(key)
  }
  clear() {
    const storage = window[this.storage]
    storage.clear()
  }
}
