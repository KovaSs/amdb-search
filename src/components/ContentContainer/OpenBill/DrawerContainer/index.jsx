import React, { PureComponent } from 'react'

export default OriginalComponent =>
class DrawerContainer extends PureComponent {
  state = {
    showDrawer: false
  }

  showDrawer =  () =>  this.setState({ showDrawer: true })
  onClose =  () =>  this.setState({ showDrawer: false })

  componentDidUpdate(prevProps) {
    const { toggleDrawer } = this.props
    if(toggleDrawer !== prevProps.toggleDrawer )  return this.showDrawer()
  }

  render() {
    const {showDrawer} = this.state
    return  (
      <OriginalComponent 
        visible={showDrawer}
        onClose={this.onClose}
        showDrawer={this.showDrawer}
        {...this.props}
      /> 
    )
  }
}

