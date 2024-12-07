import { Flex, Spin } from 'antd'

export default function Spinner() {
  return (
    <Flex justify="center" align="center" style={{ height: '95vh' }}>
      <Spin />
    </Flex>
  )
}
