/* eslint-disable no-console */
import { easeOutElastic } from './helpers'
import { lightning } from './lightning'
import { animate } from './timeline/animate'
import { fromTo, set, delay, pause } from './timeline/operators'
import { sequence, parallel, cascade } from './timeline/timeline'
import { val } from './values/val'
import { color } from './values/color'
import { transform } from './values/transform'
import { inspector } from './inspector'

const animationA = animate('#a', [
    fromTo(
        {
            paddingTop: val(0, 100, 'px'),
            transform: transform({
                y: val(-300, 0, 'px'),
                scale: val(0.9, 1),
                rotate: val(10, 0, 'deg'),
            }),
        },
        1000,
        easeOutElastic,
    ),
    pause(),
    set({ backgroundColor: ['black', 'navy'] }),
    pause(),
    delay(500),
    fromTo({ paddingBottom: val(0, 100, 'px') }, 1000),
])

const animationB = animate('#b', [
    fromTo({ paddingBottom: val(0, 100, 'px') }, 1000, easeOutElastic),
    set({ fontWeight: ['bold', 'normal'] }),
    fromTo(
        {
            paddingTop: val(0, 100, 'px'),
            paddingBottom: val(100, 0, 'px'),
        },
        1000,
    ),
])

const mainFadeIn = animate('main', [fromTo({ opacity: val(0, 1) }, 500)])
const mainFadeOut = animate('main', [fromTo({ opacity: val(1, 0) }, 500)])

const psychoBG = animate('#b', [
    fromTo({ backgroundColor: color('#FF0000', '#00FF00') }, 1500),
    pause(),
    fromTo({ backgroundColor: color('#00FF00', '#0000FF') }, 1500),
    pause(),
    fromTo({ backgroundColor: color('#0000FF', '#FF0000') }, 1500),
])

const fadeInAnim = (selector: string) =>
    animate(selector, [fromTo({ opacity: val(0, 1) }, 500)])

const cascadeAnim = cascade(
    [
        fadeInAnim('#e1'),
        fadeInAnim('#e2'),
        fadeInAnim('#e3'),
        fadeInAnim('#e4'),
        fadeInAnim('#e5'),
    ],
    { offset: i => i * 100 },
)

const animation = sequence([
    mainFadeIn,
    cascadeAnim,
    parallel([psychoBG, animationA, animationB]),
    mainFadeOut,
])

const anim = lightning(animation, {
    onPlay() {
        console.log('onPlay')
    },
    onComplete() {
        console.log('onComplete')
    },
    onPause() {
        console.log('onPause')
    },
    onUpdate() {
        const { currentTime } = anim.getStatus()
        document.title = currentTime.toString()
        seekEl.value = currentTime.toString()
    },
})

inspector(anim)

setTimeout(() => {
    anim.prepare()
}, 400)

setTimeout(() => {
    anim.play()
}, 800)

const seekEl = document.getElementById('seek') as HTMLInputElement

seekEl.setAttribute('max', anim.total.toString())

seekEl.addEventListener(
    'input',
    event => {
        // @ts-ignore
        const value = +event.target!.value
        anim.seek(value)
    },
    false,
)

document.getElementById('play')!.addEventListener('click', () => {
    anim.play()
})

document.getElementById('pause')!.addEventListener('click', () => {
    anim.pause()
})

document.getElementById('reset')!.addEventListener('click', () => {
    anim.pause()
    anim.seek(0)
    seekEl.value = '0'
})
