import { Flex } from 'antd'
import './movie-list.css'

export default function MoviesList({ children }) {
  return (
    <Flex wrap gap={36} className={'movieList'}>
      {children}
    </Flex>
  )
}
