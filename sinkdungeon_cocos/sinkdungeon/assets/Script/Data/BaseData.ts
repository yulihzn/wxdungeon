export default class BaseData{
    genNonDuplicateID():string{
        return Number(Math.random().toString().substr(3,16) + Date.now()).toString(36);
      }
}