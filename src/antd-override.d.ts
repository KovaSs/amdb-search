declare module 'antd' {
  import React from 'react'
  type AnyComp = React.ComponentType<any>
  export const Layout: AnyComp & {
    Content: AnyComp
    Sider: AnyComp
    Footer: AnyComp
  }
  export const Menu: AnyComp & {
    Item: AnyComp
    SubMenu: AnyComp
  }
  export const Icon: AnyComp
  export const Tooltip: AnyComp
  export const Button: AnyComp
  export const Popconfirm: AnyComp
  export const Badge: AnyComp
  export const Collapse: AnyComp & {
    Panel: AnyComp
  }
  export const Row: AnyComp
  export const Col: AnyComp
  export const Spin: AnyComp
  export const Table: AnyComp
  export const Input: AnyComp & {
    Search: AnyComp
    TextArea: AnyComp
    Group: AnyComp
  }
  export const AutoComplete: AnyComp & {
    Option: AnyComp
  }
  export const Typography: AnyComp & {
    Paragraph: AnyComp
  }
  export const Tabs: AnyComp & {
    TabPane: AnyComp
  }
  export const ConfigProvider: AnyComp
  export const Empty: AnyComp & {
    PRESENTED_IMAGE_SIMPLE: any
  }
  export const Progress: AnyComp
  export const Tag: AnyComp
  export const Descriptions: AnyComp & {
    Item: AnyComp
  }
  export const Select: AnyComp & {
    Option: AnyComp
  }
  export const Checkbox: AnyComp
  export const Popover: AnyComp
  export const Drawer: AnyComp
  export const PageHeader: AnyComp
  export const Avatar: AnyComp
  export const Switch: AnyComp
  export const Breadcrumb: AnyComp & {
    Item: AnyComp
  }
  export const Form: AnyComp & {
    Item: AnyComp
    create: any
  }
  export const Divider: AnyComp
  export const Alert: AnyComp
  export const notification: any
  export const CopyToClipboard: any
  export const message: {
    success(msg: string, duration?: number): void
    loading(msg: string, duration?: number): void
    destroy(): void
  }
}
