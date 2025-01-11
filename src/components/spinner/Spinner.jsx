import { Flex, Spin } from 'antd'
import './spinner.css'

export default function Spinner() {
  return (
    <Flex justify="center" align="center" className={'spinner'}>
      <Spin />
    </Flex>
  )
}
