/**
 * 游戏规则
 */
'use strict';


// 基础游戏规则
class BaseRule {
    constructor() {
        // 红宝石
        this.red = 0;
        // 蓝宝石
        this.blue = 0;
        // 钻石
        this.white = 0;
        // 绿宝石
        this.green = 0;
        // 黑宝石
        this.black = 0;
        // 黄金
        this.gold = 5;
        // 贵族人数
        this.noble = 0;
    }

    // 获取初始货币数量
    get currency() {
        return {
            red: this.red,
            blue: this.blue,
            white: this.white,
            green: this.green,
            black: this.black,
            gold: this.gold,
        };
    }

    // 获取贵族卡数量
    get nobleCount() {
        return this.noble;
    }
}

module.exports.TwoRule = class TwoRule extends BaseRule {
    constructor() {
        super();
        this.red = 4;
        this.blue = 4;
        this.white = 4;
        this.green = 4;
        this.black = 4;
        this.noble = 3;
    }
};

module.exports.ThreeRule = class ThreeRule extends BaseRule {
    constructor() {
        super();
        this.red = 5;
        this.blue = 5;
        this.white = 5;
        this.green = 5;
        this.black = 5;
        this.noble = 4;
    }
};

module.exports.FourRule = class FourRule extends BaseRule {
    constructor() {
        super();
        this.red = 7;
        this.bule = 7;
        this.white = 7;
        this.green = 7;
        this.black = 7;
        this.noble = 5;
    }
};

