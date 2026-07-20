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
  export const Collapse: AnyComp
  export const Row: AnyComp
  export const Col: AnyComp
  export const Spin: AnyComp
  export const Table: AnyComp
  export const Input: AnyComp
  export const ConfigProvider: AnyComp
  export const Empty: AnyComp
  export const Progress: AnyComp
  export const Tag: AnyComp
  export const Descriptions: AnyComp
  export const Select: AnyComp
  export const Checkbox: AnyComp
  export const Popover: AnyComp
  export const Drawer: AnyComp
  export const PageHeader: AnyComp
  export const Avatar: AnyComp
  export const Switch: AnyComp
  export const Breadcrumb: AnyComp
  export const CopyToClipboard: any
  export const message: {
    success(msg: string, duration?: number): void
    loading(msg: string, duration?: number): void
    destroy(): void
  }
}
