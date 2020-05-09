/**
 * 玩家
 */
'use strict';

class Player {
    constructor(uid) {
        this.uid = uid;
        this.ownerCards = [];
        this.waitBuyCards = [];
        this.currency = {
            red: 0,
            blue: 0,
            white: 0,
            green: 0,
            black: 0,
            gold: 0,
        };
        this.prestige = 0;
        this.currencyNum = 0;
    }

    checkCurrency() {
        return this.currencyNum <= 10;
    }

    action1({red = 0, blue = 0, white = 0, green = 0, black = 0}) {
        if (red !== 0) {
            this.currency.red += 1;
            this.currencyNum += 1;
        }

        if (blue !== 0) {
            this.currency.blue += 1;
            this.currencyNum += 1;
        }

        if (white !== 0) {
            this.currency.white += 1;
            this.currencyNum += 1;
        }

        if (green !== 0) {
            this.currency.green += 1;
            this.currencyNum += 1;
        }

        if (black !== 0) {
            this.currency.black += 1;
            this.currencyNum += 1;
        }
    }

    action2({red = false, blue = false, white = false, green = false, black = false}) {
        if (red) {
            this.currency.red += 2;
            this.currencyNum += 2;
        }

        if (blue) {
            this.currency.blue += 2;
            this.currencyNum += 2;
        }

        if (white) {
            this.currency.white += 2;
            this.currencyNum += 2;
        }

        if (green) {
            this.currency.green += 2;
            this.currencyNum += 2;
        }

        if (black) {
            this.currency.black += 2;
            this.currencyNum += 2;
        }
    }

    action3(card, getGold) {
        if (getGold) {
            this.currency.gold++;
            this.currencyNum += 1;
        }

        if (card) {
            this.waitBuyCards.push(card);
        }
    }

    action4({card, red, blue, white, green, black, gold}) {
        this.ownerCards.push(card);
        if (red > 0) {
            this.currency.red -= red;
            this.currencyNum -= red;
        }

        if (blue > 0) {
            this.currency.blue -= blue;
            this.currencyNum -= red;
        }

        if (white > 0) {
            this.currency.white -= white;
            this.currencyNum -= white;
        }

        if (green > 0) {
            this.currency.green -= green;
            this.currencyNum -= green;
        }

        if (black >= 0) {
            this.currency.black -= black;
            this.currencyNum -= black;
        }

        if (gold > 0) {
            this.currency.gold -= gold;
            this.currencyNum -= gold;
        }

        if (card.prestige) {
            this.prestige += card.prestige;
        }
    }

    getNobleCard(card) {
        this.ownerCards.push(card);

        if (card.prestige) {
            this.prestige += card.prestige;
        }
    }

    checkWin() {
        return this.prestige >= 15;
    }
}

module.exports = Player;
