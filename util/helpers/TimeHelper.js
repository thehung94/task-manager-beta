var TimeHelper = function (data) {  
    this.data = data;
};
process.env.TZ = 'Asia/Ho_Chi_Minh';
TimeHelper.prototype.data = {};
TimeHelper.getCurrentTime = function(format){
    var newDate = new Date();
    var timer = {
        H: newDate.getHours(),
        i: newDate.getMinutes(),
        s: newDate.getSeconds(),
        d: newDate.getDate(),
        m: newDate.getMonth() + 1,
        Y: newDate.getFullYear(),
        D: newDate.getDay()
    };
    var result = format;
    for(var attr in timer){
        var value = timer[attr];
        if(parseInt(value) < 10 && value.toString().length < 2){
            value = '0' + value.toString();
        }
        result = result.replace(attr, value);
    }
    return result;
};

TimeHelper.getCurrentTimeInt = function(){
    return Math.floor(new Date().getTime() / 1000);
};

TimeHelper.getNextWeekDay = function(dayNumber){
    var d = new Date();
    var diff = d.getDate() - d.getDay() + 1;
    if (d.getDay() === 0)
        diff -= 7;
    diff += 7; // ugly hack to get next monday instead of current one
    return new Date(d.setDate(diff + (dayNumber - 1)));
};

TimeHelper.getPreviousWeekDay = function(dayNumber){
    var d = new Date();
    var diff = d.getDate() - d.getDay() + 1;
    if (d.getDay() === 0)
        diff -= 7;
    diff -= 7; // ugly hack to get next monday instead of current one
    return new Date(d.setDate(diff + (dayNumber - 1)));
};

TimeHelper.getTimeByDate = function(format, date){
    var timer = {
        H: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        d: date.getDate(),
        m: date.getMonth() + 1,
        Y: date.getFullYear(),
        D: date.getDay()
    };
    var result = format;
    for(var attr in timer){
        var value = timer[attr];
        if(parseInt(value) < 10 && value.toString().length < 2){
            value = '0' + value.toString();
        }
        result = result.replace(attr, value);
    }
    return result;
};

module.exports = TimeHelper;