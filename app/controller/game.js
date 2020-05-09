'use strict';

const Controller = require('egg').Controller;
const Room = require('../service/room');

const rooms = {};
let id = 0;
class GameController extends Controller {
    // 游戏发起
    launch(ctx) {
        const {uid} = ctx.query;
        id++;
        const room = new Room(id, uid);
        room.join(uid);

        rooms[id] = room;
        ctx.body = {rid: id};
    }

    join(ctx) {
        const {uid, rid} = ctx.query;
        const room = rooms[rid];
        if (!room) {
            ctx.body = 'room not exist';
            return;
        }

        if (room.checkInRoom(uid)) {
            ctx.body = 'user has already in room';
            return;
        }

        if (room.checkFull()) {
            ctx.body = 'room has full';
            return;
        }

        if (room.roomStatus > 0) {
            ctx.body = 'game has start';
            return;
        }

        room.join(uid);

        ctx.body = 'ok';
    }

    start(ctx) {
        const {uid, rid} = ctx.query;
        const room = rooms[rid];
        if (!room) {
            ctx.body = 'room not exist';
            return;
        }

        if (room.master !== uid) {
            ctx.body = 'you are not master';
            return;
        }

        if (room.roomStatus > 0) {
            ctx.body = 'game has start';
            return;
        }

        if (!room.start(uid)) {
            ctx.body = 'start failed';
            return;
        }

        ctx.body = room.get();

    }

    show(ctx) {
        const {rid} = ctx.query;
        const room = rooms[rid];
        if (!room) {
            ctx.body = 'room not exist';
            return;
        }
        ctx.body = room.get();
    }

    do(ctx) {
        const {uid, rid, action, select} = ctx.request.body;
        const room = rooms[rid];
        if (!room) {
            ctx.body = 'room not exist';
            return;
        }

        const player = room.getPlayer(uid);
        if (!player) {
            ctx.body = 'you can not join this game';
            return;
        }

        const referee = room.getReferee();

        if (!referee.checkCanDo()) {
            ctx.body = 'is not you turn';
            return;
        }

        const result = referee.checkAction(action, select, player);
        if (!result.ok) {
            ctx.body = 'pls select right action';
            return;
        }

        switch (action) {
        case 1:
            player.action1(select);
            break;
        case 2:
            player.action2(select);
            break;
        case 3:
            player.action3(result.card, result.getGold);
            break;
        case 4:
            player.action4(result);
            break;
        default:
            break;
        }

        const players = room.getPlayers();

        let needPlayerSelect = false;
        const nobles = referee.checkNoble(player.ownerCards);

        if (!nobles.length || nobles.length === 1) {
            if (nobles.length === 1) {
                const card = referee.visitNoble(nobles[0].id, player.ownerCards);
                player.getNobleCard(card);
            }

            // 判断玩家能否获胜(玩家自我判断)
            if (player.checkWin()) {
                // 判断当前有无其他完成者(裁判全局判断)
                if (referee.checkWin(player)) {
                    // 是不是最后一个执行者
                    if (referee.checkIsLastPlayer(uid)) {
                        referee.gameOver();
                        ctx.body = 'congratulation !! you win';
                        return;
                    }
                    // 如果不是最后一个人需要等待其他人本轮结束
                    referee.beforePlayersOver(uid, players);
                } else {
                    referee.enterLost(uid);
                }
            } else {
                // 判断游戏有没有进入结算阶段
                const tempWinner = referee.getWinner();
                if (tempWinner) {
                    // 已经有其他胜者了，你的比赛已经结束
                    referee.enterLost(uid);
                    if (referee.checkIsLastPlayer(uid)) {
                        referee.gameOver();
                        ctx.body = `congratulation !! player ${tempWinner.uid} win`;
                        return;
                    }
                }
            }

            // 进入下一个人
            referee.enterNextPlayer(uid);
        } else {
            needPlayerSelect = true;
        }

        const msg = room.get();
        msg.needPlayerSelect = needPlayerSelect;
        msg.canGetNobleCards = nobles;

        ctx.body = msg;
    }

    select(ctx) {
        const {uid, rid, id} = ctx.query;
        const room = rooms[rid];
        if (!room) {
            ctx.body = 'room not exist';
            return;
        }

        const player = room.getPlayer(uid);
        if (!player) {
            ctx.body = 'you can not join this game';
            return;
        }

        const players = room.getPlayers();

        const referee = room.getReferee();
        if (!referee.checkCanDo()) {
            ctx.body = 'is not you turn';
            return;
        }

        const card = referee.visitNoble(parseInt(id), player.ownerCards);
        player.getNobleCard(card);

        // 判断玩家能否获胜(玩家自我判断)
        if (player.checkWin()) {
            // 判断当前有无其他完成者(裁判全局判断)
            if (referee.checkWin(player)) {
                // 是不是最后一个执行者
                if (referee.checkIsLastPlayer(uid)) {
                    referee.gameOver();
                    ctx.body = 'congratulation !! you win';
                    return;
                }
                // 如果不是最后一个人需要等待其他人本轮结束
                referee.beforePlayersOver(uid, players);
            } else {
                referee.enterLost(uid);
            }
        } else {
            // 判断游戏有没有进入结算阶段
            const tempWinner = referee.getWinner();
            if (tempWinner) {
                // 已经有其他胜者了，你的比赛已经结束
                referee.enterLost(uid);
                if (referee.checkIsLastPlayer(uid)) {
                    referee.gameOver();
                    ctx.body = `congratulation !! player ${tempWinner.uid} win`;
                    return;
                }
            }
        }

        // 进入下一个人
        referee.enterNextPlayer(uid);

        ctx.body = room.get();
    }

}

module.exports = GameController;
