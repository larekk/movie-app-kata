import { Flex, Input } from 'antd'
import './search.css'

export default function Search({ searchUnratedFilms, setSearchLoading }) {
  return (
    <Flex wrap gap={36} className={'flexSearchContainer'}>
      <Input
        placeholder="Type to search..."
        className={'search'}
        onChange={(e) => {
          setSearchLoading()
          return searchUnratedFilms(e.target.value)
        }}
      />
    </Flex>
  )
}
