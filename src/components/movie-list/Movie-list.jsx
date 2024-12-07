import { Flex } from 'antd'

export default function MoviesList({ children }) {
  return (
    <Flex wrap gap={36} style={{ maxWidth: '944px', margin: '0 auto' }}>
      {children}
    </Flex>
  )
}
