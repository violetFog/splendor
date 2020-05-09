/**
 * 玩家管理
 */
'use strict';

const Player = require('./player');

class UserManager {
    constructor() {
        this.playerList = [];
    }

    get() {
        return this.playerList;
    }

    getPlayer(uid) {
        return this.playerList.find(p => p.uid === uid);
    }

    getPeopleNum() {
        return this.playerList.length;
    }

    join(uid) {
        const player = new Player(uid);
        this.playerList.push(player);
    }

    checkInRoom(uid) {
        return this.playerList.findIndex(p => p.uid === uid) > -1;
    }

    close() {
        this.playerList = [];
    }
}

module.exports = UserManager;
