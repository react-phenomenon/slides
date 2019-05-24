import React, { ReactNode, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useSlides } from '../../hooks/useSlides'
import { SubSteps } from '../SubSteps'
import { findFragments } from './lib/findFragments'
import { stringReplace } from './lib/stringReplace'
import { stripIndent } from './lib/stripIndent'

type CodeProps = {
    code: string
    in: number
    out?: number
    children?: ReactNode
}

const ID_REGEXP = /\n?\$([A-Z0-9_]*)\n?/g // $SOME

export const Code = (props: CodeProps) => {
    const fragments = findFragments(props.children)
    const code = stripIndent(props.code)
    const out = stringReplace(code, ID_REGEXP, id => fragments[id])
    const outTrimmed = out.map(item => (typeof item === 'string' ? item.trim() : item))

    const ref = useRef(null)
    const { addStep } = useSlides()

    useEffect(() => {
        addStep(props.in, () => ({
            targets: ref.current,
            opacity: [0, 1],
            translateX: [250, 0],
        }))

        if (props.out) {
            addStep(-props.out, () => ({
                targets: ref.current,
                keyframes: [
                    { opacity: 0 },
                    {
                        height: 0,
                        margin: 0,
                        padding: 0,
                    },
                ],
            }))
        }
    }, [])

    return (
        <SubSteps id={[props.in]}>
            <Pre ref={ref}>{outTrimmed}</Pre>
        </SubSteps>
    )
}

const Pre = styled.pre`
    overflow: hidden;
    background-color: #20242b;
    padding: 2em;
    margin: 2em auto;
    border-radius: 0.5em;
`
