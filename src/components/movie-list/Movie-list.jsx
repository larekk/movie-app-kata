import { Flex } from 'antd'

export default function MoviesList({ children }) {
  return (
    <Flex wrap gap={36} style={{ maxWidth: '1000px', margin: '35px auto 0 auto' }}>
      {children}
    </Flex>
  )
}
