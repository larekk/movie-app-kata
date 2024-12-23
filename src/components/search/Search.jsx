import { Flex, Input } from 'antd'

export default function Search({ searchUnratedFilms, setSearchLoading }) {
  return (
    <Flex wrap gap={36} style={{ maxWidth: '944px', margin: '0 auto' }}>
      <Input
        placeholder="Type to search..."
        style={{ maxWidth: '944px' }}
        onKeyUp={(e) => {
          setSearchLoading()
          return searchUnratedFilms(e.target.value)
        }}
      />
    </Flex>
  )
}
