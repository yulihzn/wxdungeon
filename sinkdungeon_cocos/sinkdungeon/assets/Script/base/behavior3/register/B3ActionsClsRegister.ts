import { B3Error } from '../actions/B3Error'
import { B3Failer } from '../actions/B3Failer'
import { B3Runner } from '../actions/B3Runner'
import { B3Succeeder } from '../actions/B3Succeeder'
import { B3Wait } from '../actions/B3Wait'

export let B3ActionsCls = {
    ['B3Error']: B3Error,
    ['B3Failer']: B3Failer,
    ['B3Runner']: B3Runner,
    ['B3Succeeder']: B3Succeeder,
    ['B3Wait']: B3Wait
}
