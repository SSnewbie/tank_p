class Tank {
  public name: string;
  public code: string;
  public author: string;
  public score: number;
  public timestamp: string;
  public state: number;
  constructor(text: string) {
    if (text != "") {
      let obj = JSON.parse(text);
      this.name = obj.name;
      this.code = obj.code;
      this.author = obj.author;
    }
    this.state = 0;
    this.score = 0;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
// //TODO
// let LocalContractStorage: any;
// let Blockchain: any;

class TankContract {
  // competitionTankMap;
  // tankCodeMap: any;
  // userTankMap: any;
  // numberMap: any;
  constructor() {
    //坦克名与对象映射
    LocalContractStorage.defineMapProperty(this, "tankCodeMap", {
      stringify: function(obj) {
        return JSON.stringify(obj);
      },
      parse: function(str) {
        return JSON.parse(str);
      }
    });

    //用户和坦克名映射
    LocalContractStorage.defineMapProperty(this, "userTankMap", {
      stringify: function(obj) {
        return JSON.stringify(obj);
      },
      parse: function(str) {
        return JSON.parse(str);
      }
    });

    //参赛坦克列表
    LocalContractStorage.defineMapProperty(this, "competitionTankMap", {
      stringify: function(obj) {
        return JSON.stringify(obj);
      },
      parse: function(str) {
        return JSON.parse(str);
      }
    });

    LocalContractStorage.defineProperty(this, "numberMap");
  }

  _attendCompetition(tankName: string) {
    let list = this.competitionTankMap.get("list");
    if (!(list.indexOf(tankName) > -1)) {
      list.push(tankName);
      this.competitionTankMap.set("list", list);
      return 0;
    }
    return 1;
  }

  _leaveCompetition(tankName: string) {
    let list = this.competitionTankMap.get("list");
    let index = list.indexOf(tankName);
    if (index > -1) {
      list.splice(index, 1);
      this.competitionTankMap.set("list", list);
      return { state: 0, mag: "退出成功" };
    }
  }

  _isExist(name: string) {
    if (name === "") {
      throw new Error("name is null");
    }
    var existTank = this.tankCodeMap.get(name);
    return existTank;
  }

  init() {
    this.numberMap = 0;
    this.competitionTankMap.set("list", []);
  }

  save(name: string, code: string) {
    var name = name.trim();
    var code = code.trim();

    if (name === "" || code === "")
      throw new Error("name or code is underfind");
    if (name.length > 64)
      throw new Error("name length more than 64 characters！");
    if (code.length > 4096)
      throw new Error("code length more than 4096 characters！");

    var from = Blockchain.transaction.from;
    var existInfo = this.tankCodeMap.get(name);
    if (existInfo) throw new Error("tank name have exist");

    var tank = new Tank("");
    tank.name = name;
    tank.code = code;
    tank.timestamp = new Date().getTime().toString();
    tank.author = from;
    this.tankCodeMap.set(name, tank);
    let list = this.userTankMap.get(from);
    if (!list) list = [];
    list.push(name);
    this.userTankMap.set(from, list);
  }

  queryAllCompetition() {
    let list = this.competitionTankMap.get("list");
    return list.map(item => this.tankCodeMap.get(item));
  }

  attendCompetition(tankName: string) {
    let author = Blockchain.transaction.from;
    let list = this.userTankMap.get(author);
    if (list.indexOf(tankName) > -1) {
      let tank = this.tankCodeMap.get(tankName);
      tank.state = 1;
      this.tankCodeMap.set(tankName, tank);
      let flag = this._attendCompetition(tankName);
      return { state: flag, msg: "参战成功！" };
    } else {
      return {
        state: 1,
        msg: "你没有这个坦克"
      };
    }
  }

  leaveCompetition(author: string, tankName: string) {
    let list = this.userTankMap.get(author);
    if (list.indexOf(tankName) > -1) {
      let tank = this.tankCodeMap.get(tankName);
      tank.state = 0;
      this.tankCodeMap.set(tankName, tank);
      this._leaveCompetition(tankName);
    } else {
      return { state: 1, msg: "你没有这个坦克" };
    }
  }

  queryByAccount(author: string) {
    if (author === "") {
      throw new Error("address is null");
    }
    if (!this.verifyAddress(author)) {
      throw new Error("address is not exist");
    }
    let list = this.userTankMap.get(author);
    if (!list) list = [];

    return list.map(item => this.tankCodeMap.get(item));
  }

  deleteTank(name: string) {
    name = name.trim();
    if (name === "") {
      throw new Error("name is null");
    }
    var author = Blockchain.transaction.from;
    let list = this.userTankMap.get(author.toString());
    if (!list) new Error("author is not exist");
    let index = list.indexOf(name);
    if (index < 0) new Error("name is not exist");
    this.tankCodeMap.del(name);
    list.splice(index, 1);
    this.userTankMap.set(author, list);
  }

  queryByName(name: string) {
    name = name.trim();
    if (name === "") {
      throw new Error("address is null");
    }
    if (!this.verifyAddress(name)) {
      throw new Error("address is not exist");
    }
    return this.tankCodeMap.get(name);
  }

  isNameExist(name: string) {
    if (name === "") {
      throw new Error("address is null");
    }
    var existInfo = this.tankCodeMap.get(name);
    return existInfo == "null";
  }

  verifyAddress(address) {
    // 1-valid, 0-invalid
    var result = Blockchain.verifyAddress(address);
    return {
      valid: result == 0 ? false : true
    };
  }
}

module.exports = TankContract;
