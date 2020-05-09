/**
 * 游戏管理
 */
'use strict';

const {TwoRule, ThreeRule, FourRule} = require('./rule');
const CardGroup = require('./card');

class GameManager {
    constructor() {
        this.currency = {};
        this.cardGroups = {};

        this.currentTurn = 0;
        this.currentPlayer = 0;
        this.playOrder = [];
        this.overList = [];
        this.winner = 0;
        this.over = false;
    }

    selectRule(userList) {
        const num = userList.length;
        let rule = null;
        switch (num) {
        case 2:
            rule = new TwoRule();
            break;
        case 3:
            rule = new ThreeRule();
            break;
        case 4:
            rule = new FourRule();
            break;
        default:
            return false;
        }

        this.currency = rule.currency;
        const cardGroups = new CardGroup(rule.nobleCount);
        this.cardGroups = cardGroups.get();

        const random = Math.floor(Math.random() * num);
        for (let i = 0; i < num; ++i) {
            this.playOrder[Math.abs(i - random)] = userList[i];
        }
        this.playOrder = userList.sort((a, b) => b - a);
        this.currentPlayer = this.playOrder[0].uid;
        return true;
    }

    show() {
        return {
            firstShow: this.cardGroups.firstCards.showCards,
            secondShow: this.cardGroups.secondCards.showCards,
            thirdShow: this.cardGroups.thirdCards.showCards,
            nobleShow: this.cardGroups.nobleCards,
            currency: this.currency,
        };
    }

    showPlayOrder() {
        return {
            playOrder: this.playOrder,
            currentPlayer: this.currentPlayer,
            winner: this.winner,
            gameOver: this.over,
        };
    }

    getCardsByType(type) {
        if (type === 1) {
            return this.cardGroups.firstCards;
        } else if (type === 2) {
            return this.cardGroups.secondCards;
        } else if (type === 3) {
            return this.cardGroups.thirdCards;
        }
        return null;
    }

    checkAction(action, userSelect, player) {
        switch (action) {
        case 1:
            return {ok: this.action1(userSelect, player.currencyNum)};
        case 2:
            return {ok: this.action2(userSelect, player.currencyNum)};
        case 3:
            return this.action3(userSelect.type, userSelect.id);
        case 4:
            return this.action4(userSelect.type, userSelect.id, player.currency, player.ownerCards, player.waitBuyCards);
        default:
            return {ok: false};
        }
    }

    action1({red = 0, blue = 0, white = 0, green = 0, black = 0}, userCurrencyNum) {
        if (this.currency.red + this.currency.blue + this.currency.white + this.currency.green + this.currency.black < 3) {
            return false;
        }

        const total = red + blue + white + green + black;
        if (total > 3) {
            return false;
        }

        if (total + userCurrencyNum > 10) {
            return false;
        }

        if (red > 0) {
            if (this.currency.red === 0) {
                return false;
            }

            this.currency.red -= 1;
        }

        if (blue > 0) {
            if (this.currency.blue === 0) {
                return false;
            }

            this.currency.blue -= 1;
        }

        if (white > 0) {
            if (this.currency.white === 0) {
                return false;
            }

            this.currency.white -= 1;
        }

        if (green > 0) {
            if (this.currency.green === 0) {
                return false;
            }
            this.currency.green -= 1;
        }

        if (black > 0) {
            if (this.currency.black === 0) {
                return false;
            }

            this.currency.black -= 1;
        }

        return true;
    }

    action2({red = false, blue = false, white = false, green = false, black = false}, userCurrencyNum) {
        if (2 + userCurrencyNum > 10) {
            return false;
        }

        if (red) {
            if (blue || white || green || black) {
                return false;
            }

            if (this.currency.red < 4) {
                return false;
            }

            this.currency.red -= 2;

            return true;
        }

        if (blue) {
            if (white || green || black) {
                return false;
            }

            if (this.currency.blue < 4) {
                return false;
            }

            this.currency.blue -= 2;

            return true;
        }

        if (white) {
            if (green || black) {
                return false;
            }

            if (this.currency.white < 4) {
                return false;
            }

            this.currency.white -= 2;

            return true;
        }

        if (green) {
            if (black) {
                return false;
            }

            if (this.currency.green < 4) {
                return false;
            }

            this.currency.green -= 2;

            return true;
        }

        if (black) {
            if (this.currency.black < 4) {
                return false;
            }

            this.currency.black -= 2;

            return true;
        }

        return false;
    }

    action3(type, id, userCurrencyNum, waitCards) {
        // 判断能不能拿黄金
        let getGold = this.currency.gold > 0;
        if (userCurrencyNum + 1 > 10) {
            getGold = false;
            return {ok: false, card: null, getGold};
        }

        // 获取当前类型的卡组
        const cards = this.getCardsByType(type);
        if (!cards) {
            return {ok: getGold, card: null, getGold};
        }

        if (waitCards.length > 3) {
            return {ok: false, card: null, getGold};
        }

        let card = null;
        if (id) {
        // 如果有id，说明从 观察区选一张
            const index = cards.showCards.findIndex(x => x.id === id);
            if (index > -1) {
                card = cards.splice(index, 1);
            }
        } else {
        // 没有id 从预备卡组中抽一张
            card = cards.backCards.pop();
        }

        return {ok: true, card, getGold};
    }

    action4(type, id, userCurrency, userCards, waitCards) {
        // 获取当前类型的卡组
        const cards = this.getCardsByType(type);
        if (!cards) {
            return {ok: false};
        }

        let card = cards.showCards.find(x => x.id === id);
        if (!card) {
            card = waitCards.find(x => x.id === id);
            if (!card) {
                return {ok: false};
            }
        }

        const red = card.red;
        const blue = card.blue;
        const white = card.white;
        const green = card.green;
        const black = card.black;

        const userRed = userCurrency.red;
        const userBlue = userCurrency.blue;
        const userWhite = userCurrency.white;
        const userGreen = userCurrency.green;
        const userBlack = userCurrency.black;
        const userGold = userCurrency.gold;

        let redBonus = 0;
        let blueBonus = 0;
        let whiteBonus = 0;
        let greenBonus = 0;
        let blackBonus = 0;

        for (const card of userCards) {
            switch (card.bonus) {
            case 'red':
                redBonus++;
                break;
            case 'blue':
                blueBonus++;
                break;
            case 'white':
                whiteBonus++;
                break;
            case 'green':
                greenBonus++;
                break;
            case 'black':
                blackBonus++;
                break;
            default:
                break;
            }
        }

        let redPay = 0;
        let bluePay = 0;
        let whitePay = 0;
        let greenPay = 0;
        let blackPay = 0;
        let goldPay = 0;

        if (red > 0) {
            // 红利不足以直接支付
            if (redBonus < red) {
                // 红利 + 货币足够
                const needPay = red - redBonus;
                // 扣除红利， 玩家实际应该支付的货币数量
                if (userRed >= needPay) {
                    redPay = needPay;
                } else {
                    // 当前货币数量不足，可以由黄金来补齐
                    redPay = userRed;
                    goldPay = needPay - userRed;
                }
            }
        }

        if (blue > 0) {
            if (blueBonus < blue) {
                // 红利 + 货币足够
                const needPay = blue - blueBonus;
                // 扣除红利， 玩家实际应该支付的货币数量
                if (userBlue >= needPay) {
                    bluePay = needPay;
                } else {
                    // 当前货币数量不足，可以由黄金来补齐
                    bluePay = userBlue;
                    goldPay = needPay - userBlue;
                }
            }
        }

        if (white > 0) {
            if (whiteBonus < white) {
                // 红利 + 货币足够
                const needPay = white - whiteBonus;
                // 扣除红利， 玩家实际应该支付的货币数量
                if (userWhite >= needPay) {
                    whitePay = needPay;
                } else {
                    // 当前货币数量不足，可以由黄金来补齐
                    whitePay = userWhite;
                    goldPay = needPay - userWhite;
                }
            }
        }

        if (green > 0) {
            if (greenBonus < green) {
                // 红利 + 货币足够
                const needPay = green - greenBonus;
                // 扣除红利， 玩家实际应该支付的货币数量
                if (userGreen >= needPay) {
                    greenPay = needPay;
                } else {
                    // 当前货币数量不足，可以由黄金来补齐
                    greenPay = userGreen;
                    goldPay = needPay - userGreen;
                }
            }
        }

        if (black > 0) {
            if (blackBonus < black) {
                // 红利 + 货币足够
                const needPay = black - blackBonus;
                // 扣除红利， 玩家实际应该支付的货币数量
                if (userBlack >= needPay) {
                    blackPay = needPay;
                } else {
                    // 当前货币数量不足，可以由黄金来补齐
                    blackPay = userBlack;
                    goldPay = needPay - userBlack;
                }
            }
        }

        if (goldPay > 0) {
            if (userGold < goldPay) {
                return {ok: false};
            }

            this.currency.gold += goldPay;
        }

        if (redPay > 0) {
            this.currency.red += redPay;
        }

        if (bluePay > 0) {
            this.currency.blue += bluePay;
        }

        if (whitePay > 0) {
            this.currency.white += whitePay;
        }

        if (greenPay > 0) {
            this.currency.green += greenPay;
        }

        if (blackPay > 0) {
            this.currency.black += blackPay;
        }

        return {ok: true, card, red: redPay, blue: bluePay, white: whitePay, green: greenPay, black: blackPay, gold: goldPay};
    }

    // 判断贵族卡
    checkNoble(userCards) {
        const nobleCards = this.cardGroups.nobleCards;
        if (!nobleCards.length) {
            return [];
        }
        let redBonus = 0;
        let blueBonus = 0;
        let whiteBonus = 0;
        let greenBonus = 0;
        let blackBonus = 0;

        for (const card of userCards) {
            switch (card.bonus) {
            case 'red':
                redBonus++;
                break;
            case 'blue':
                blueBonus++;
                break;
            case 'white':
                whiteBonus++;
                break;
            case 'green':
                greenBonus++;
                break;
            case 'black':
                blackBonus++;
                break;
            default:
                break;
            }
        }

        const canGet = [];
        for (const card of nobleCards) {
            if (card.red === redBonus && card.blue === blueBonus && card.white === whiteBonus && card.green === greenBonus && card.black === blackBonus) {
                canGet.push(card);
            }
        }

        return canGet;
    }

    // 挑选贵族卡
    visitNoble(id, userCards) {
        const canGet = this.checkNoble(userCards);
        const card = canGet.find(x => x.id === id);
        if (!card) {
            return null;
        }

        const index = this.cardGroups.nobleCards.findIndex(x => x.id === id);
        this.cardGroups.nobleCards.splice(index, 1);

        return card;
    }

    checkIsLastPlayer(uid) {
        return this.playOrder[this.playOrder.length - 1].uid === uid;
    }

    enterNextPlayer(uid) {
        const index = this.playOrder.findIndex(x => x.uid === uid);
        const next = this.playOrder[index + 1];
        if (next) {
            this.currentPlayer = next.uid;
            return false;
        }

        this.currentPlayer = this.playOrder[0].uid;
        this.currentTurn++;

        return true;
    }

    gameOver() {
        this.over = true;
    }

    enterLost(uid) {
        this.overList.push(uid);
    }

    getWinner() {
        return this.winner;
    }

    checkWin(player) {
        if (this.winner) {
            if (player.prestige < this.winner.prestige) {
                return false;
            } else if (player.prestige > this.winner.prestige) {
                this.winner = player;
                return true;
            }
            const playerGoodsCardNum = player.ownerCards.filter(x => !!x.type).length;
            const tempWinnerGoodsCardNum = this.winner.ownerCards.filter(x => !!x.type).length;
            if (playerGoodsCardNum < tempWinnerGoodsCardNum) {
                this.winner = player;
                return true;
            } else if (playerGoodsCardNum > tempWinnerGoodsCardNum) {
                return false;
            }
            if (player.currencyNum > this.winner.currencyNum) {
                this.winner = player;
                return true;
            }
            return false;


        }
        this.winner = player;
        return true;

    }

    beforePlayersOver(uid, players) {
        const index = this.playOrder.findIndex(x => x.uid === uid);
        for (let i = 0; i <= index; ++i) {
            this.overList.push(players[i].uid);
        }
    }

    checkCanDo(uid) {
        return this.currentPlayer === uid;
    }

    close() {
        this.currency = {};
        this.cardGroups = {};

        this.currentTurn = 0;
        this.totalTurn = 0;
        this.playOrder = [];
    }
}


module.exports = GameManager;

