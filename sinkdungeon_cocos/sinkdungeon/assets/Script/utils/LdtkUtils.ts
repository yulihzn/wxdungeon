import { Convert } from './Ldtk'

export default class LdtkUtils {
    load() {
        cc.resources.load('Data/world/map/chapter00', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                let ldtk = Convert.ldtkToJson(resource.json)
                cc.log(ldtk)
            }
        })
    }
}
