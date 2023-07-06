import { B3Inverter } from '../decorators/B3Inverter';
import { B3Limiter } from '../decorators/B3Limiter';
import { B3MaxTime } from '../decorators/B3MaxTime';
import { B3Repeater } from '../decorators/B3Repeater';
import { B3RepeatUntilFailure } from '../decorators/B3RepeatUntilFailure';
import { B3RepeatUntilSuccess } from '../decorators/B3RepeatUntilSuccess';

export let B3DecoratorsCls = {
    ["B3Inverter"]: B3Inverter,
    ["B3Limiter"]: B3Limiter,
    ["B3MaxTime"]: B3MaxTime,
    ["B3Repeater"]: B3Repeater,
    ["B3RepeatUntilFailure"]: B3RepeatUntilFailure,
    ["B3RepeatUntilSuccess"]: B3RepeatUntilSuccess,
}