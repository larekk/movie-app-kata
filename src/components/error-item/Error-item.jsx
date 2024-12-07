import React from 'react'
import { Alert } from 'antd'
import { Offline, Online } from 'react-detect-offline'

export default function ErrorItem() {
  return (
    <>
      <Offline>You are offline right now. Check your connection.</Offline>
      <Online>
        <Alert message="Error" description="Something is wrong, try to refresh this page" type="error" showIcon />
      </Online>
    </>
  )
}
