import { Pagination } from 'antd'

export default function PaginationList({ pages, current, onChangePage }) {
  return (
    <Pagination
      total={pages}
      align="center"
      style={{ marginTop: '40px' }}
      onChange={onChangePage}
      current={current}
      pageSize="1"
      showSizeChanger={false}
    />
  )
}
