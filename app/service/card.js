/**
 * 基础卡牌
 */
'use strict';

const baseCards = require('./baseCards');

const GoodsCardType = {
    First: 1,
    Second: 2,
    Third: 3,
};

const SHOW_NUM = 4;

// 商品卡
class GoodsCard {
    // 需要的货币数量以及能产出的红利 和 声望
    constructor({id, type, red = 0, blue = 0, white = 0, black = 0, green = 0, prestige = 0, bonus}) {
        this.id = id;
        this.type = type;
        this.red = red;
        this.blue = blue;
        this.white = white;
        this.black = black;
        this.green = green;
        this.prestige = prestige;
        this.bonus = bonus;
    }
}

// 贵族卡
class NobleCard {
    // 需要的红利数量以及能产出的声望
    constructor({id, red = 0, blue = 0, white = 0, black = 0, green = 0, prestige = 0}) {
        this.id = id;
        this.red = red;
        this.blue = blue;
        this.white = white;
        this.black = black;
        this.green = green;
        this.prestige = prestige;
    }
}

// 卡组
class CardGroup {
    constructor(num) {
        this.firstCards = {
            showCards: [],
            backCards: [],
        };

        this.secondCards = {
            showCards: [],
            backCards: [],
        };

        this.thirdCards = {
            showCards: [],
            backCards: [],
        };

        this.nobleCards = [];

        this.init(num);
    }

    init(num) {
        const goodsCards = baseCards.goodsCards;
        for (const card of goodsCards) {
            const goodsCard = new GoodsCard(card);
            if (goodsCard.type === GoodsCardType.First) {
                if (this.firstCards.showCards.length < SHOW_NUM) {
                    this.firstCards.showCards.push(goodsCard);
                } else {
                    this.firstCards.backCards.push(goodsCard);
                }
            } else if (goodsCard.type === GoodsCardType.Second) {
                if (this.secondCards.showCards.length < SHOW_NUM) {
                    this.secondCards.showCards.push(goodsCard);
                } else {
                    this.secondCards.backCards.push(goodsCard);
                }
            } else if (goodsCard.type === GoodsCardType.Third) {
                if (this.thirdCards.showCards.length < SHOW_NUM) {
                    this.thirdCards.showCards.push(goodsCard);
                } else {
                    this.thirdCards.backCards.push(goodsCard);
                }
            }
        }

        for (let i = 0; i < num; ++i) {
            if (!baseCards.nobleCards[i]) {
                break;
            }
            const nobleCard = new NobleCard(baseCards.nobleCards[i]);
            this.nobleCards.push(nobleCard);
        }
    }

    get() {
        return {
            firstCards: this.firstCards,
            secondCards: this.secondCards,
            thirdCards: this.thirdCards,
            nobleCards: this.nobleCards,
        };
    }
}

module.exports = CardGroup;
