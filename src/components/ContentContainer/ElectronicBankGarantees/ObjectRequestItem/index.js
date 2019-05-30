import React, { Component } from 'react'
import { request_fl, request_ul } from '../../../../store/mock'

export class ObjectRequestItem extends Component {
  
  render() {
    const { objectInn } = this.props
    console.log('objectInn', request_fl)
    return (
      <div style={{ padding : '1rem'}}>
        { objectInn === request_fl.client.selfEmployed.inn ? <pre>{JSON.stringify(request_fl, undefined, 2)}</pre> : null }
        { objectInn === request_ul.client.company.inn ? <pre>{JSON.stringify(request_ul, null, 2)}</pre> : null }
      </div>
    )
  }
}

export default ObjectRequestItem
