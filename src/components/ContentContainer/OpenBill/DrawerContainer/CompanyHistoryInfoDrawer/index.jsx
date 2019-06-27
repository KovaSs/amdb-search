import React from 'react';
import { Drawer } from "antd";

const DrawerContainer = ({onClose, visible}) => {
  return (
    <div>
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        History Info about company
      </Drawer>
    </div>
  );
}

export default DrawerContainer