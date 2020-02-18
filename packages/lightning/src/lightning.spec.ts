import 'core-js'
import { lightning } from './lightning'
import { animate } from './timeline/animate'
import { set, delay, fromTo } from './timeline/operators'
import { val } from './values/val'

/* eslint-disable no-undef */

describe('lightning', () => {
    const values = { a: null, b: null }

    const frames = animate(frameValues => Object.assign(values, frameValues), [
        delay(100),
        set({ a: [0, 1] }),
        fromTo(
            {
                b: val(10, 100),
            },
            100,
        ),
    ])

    const anim = lightning(frames)

    test('initial', () => {
        expect(values.a).toBe(null)
        expect(values.b).toBe(null)
    })

    test('prepare', () => {
        anim.prepare()
        expect(values.a).toBe(0)
        expect(values.b).toBe(10)
    })

    test('seek', () => {
        anim.seek(anim.getStatus().total)
        expect(values.a).toBe(1)
        expect(values.b).toBe(100)
    })
})
