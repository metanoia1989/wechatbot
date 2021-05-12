module.exports = function () {
    var cache = {};
    return {
        get: key => cache[key],
        set: (key, val) => cache[key] = val,
    }
} ();