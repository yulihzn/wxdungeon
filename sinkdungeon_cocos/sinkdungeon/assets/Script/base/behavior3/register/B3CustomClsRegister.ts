import Log from '../custom/actions/CustomAction'
import CustomAction from '../custom/actions/CustomAction'
import DisCondition from '../custom/condtion/DisCondition'
import TargetCondition from '../custom/condtion/TargetCondition'

export let B3CustomClsRegister = {
    ['CustomAction']: CustomAction,
    ['Log']: Log,
    ['TargetCondition']: TargetCondition,
    ['DisCondition']: DisCondition
}
