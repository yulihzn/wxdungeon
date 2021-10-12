import Random from "../utils/Random";

export default class BaseData{
    genNonDuplicateID():string{
        return Number(Random.rand().toString().substr(3,16) + Date.now()).toString(36);
      }
}