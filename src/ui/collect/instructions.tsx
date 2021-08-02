import * as React from 'react'
import Markdown from '../markdown'
import { majorScale } from '@treygriffith/evergreen-ui'

interface InstructionProps {
  text?: string
}

const Instructions: React.FC<InstructionProps> = ({ text }) => {
  if (!text) return null

  return (
    <Markdown marginBottom={majorScale(3)} copyableCode newWindow text={text} />
  )
}

export default Instructions
