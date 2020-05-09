'use strict';

const GameManager = require('./gameManager');
const UserManager = require('./userManager');
class Room {
    constructor(rid, uid) {
        this.id = rid;
        this.maxPeople = 4;
        this.userManager = new UserManager();
        this.gameManager = new GameManager();

        this.roomMaster = uid;
        this.status = 0;
    }

    get master() {
        return this.roomMaster;
    }

    get roomStatus() {
        return this.status;
    }

    join(uid) {
        if (this.checkFull()) {
            return false;
        }

        this.userManager.join(uid);

        return true;
    }

    leave() {
    }

    checkInRoom(uid) {
        return this.userManager.checkInRoom(uid);
    }

    checkFull() {
        const peopleNum = this.userManager.getPeopleNum();
        return peopleNum >= 4;
    }

    start(uid) {
        if (uid !== this.roomMaster) {
            return false;
        }

        const peopleNum = this.userManager.getPeopleNum();
        if (peopleNum < 2) {
            return false;
        }

        if (this.status > 0) {
            return false;
        }

        const userList = this.userManager.get();
        this.status = 1;

        return this.gameManager.selectRule(userList);

    }

    get() {
        const msg = this.gameManager.show();
        const msg2 = this.gameManager.showPlayOrder();
        return Object.assign(msg, msg2);
    }

    getReferee() {
        return this.gameManager;
    }

    getPlayer(uid) {
        return this.userManager.getPlayer(uid);
    }

    getPlayers() {
        return this.userManager.get();
    }

    gameOver() {
        this.status = 0;
    }

    end() {
        this.gameManager.close();
        this.gameManager = null;
        this.roomMaster = '';

        this.userManager.close();
        this.userManager = null;
    }
}

module.exports = Room;
