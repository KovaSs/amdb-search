import React, { Component } from 'react'

export default OriginalComponent =>
class DrawerContainer extends Component {
  state = {
    showRisk: true,
    showHistory: false
  }

  showDrawer = drawer =>  this.setState({ [drawer]: true });
  onClose = drawer =>  this.setState({ [drawer]: false });

  render() {
    return  (
      <OriginalComponent 
        visible={true}
        {...this.props}
        onClose={this.onClose}
        showDrawer={this.showDrawer}
      /> 
    )
  }
}

