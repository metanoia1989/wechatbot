//********************************************************** 
// 测试代理模式
//********************************************************** 
class Wechaty {
    constructor({ name }) {
        this.xxx_name = name;
    }
    findList() {
        console.log(this.xxx_name, "call wechaty findList");
        return [1, 3, 3, 5];
    }
    logonoff() {
        return true;
    }
}
class Bot {
    constructor(name = 'wechat-puppet-wechat') {
        if (this.instance) {
            return this.instance;
        }
        this.bot = new Wechaty({ name });
    }
    /**
     * 单例模式，保证实例化一次
     * @returns this
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new Proxy(new Bot(), {
                get(target, prop, receiver) {
                    if (!(prop in target) && (prop in target.bot)) {
                        console.log("请求属性代理类不存在，但bot中存在", prop);
                        // 不在Bot中的方法，则是向this.bot请求，检测 bot 是否登录
                        if (target.bot.logonoff()) {
                            // 访问的是函数，需要重新绑定this
                            if (typeof target.bot[prop] === 'function') {
                                return new Proxy(target.bot[prop], {
                                    apply(target, thisArg, args) {
                                        target.apply(thisArg.bot, args);
                                    }
                                });
                            }
                            return target.bot[prop];
                        }
                        else {
                            throw new Error("小助手未登录，无法调用！");
                        }
                    }
                    return target[prop];
                }
            });
        }
        return this.instance;
    }
    testProxy() {
        console.log("call Bot testProxy 测试代理");
    }
}
// 编写测试代码
function main() {
    bot = Bot.getInstance();
    bot.testProxy();
    bot.findList();
}
main();
