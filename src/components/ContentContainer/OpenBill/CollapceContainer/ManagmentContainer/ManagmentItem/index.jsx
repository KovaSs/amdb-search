import React, { PureComponent } from 'react'
import { Collapse, Icon, Spin, Descriptions, AutoComplete } from 'antd'
import LeaderHeader from '../LeaderHeader'
import PropTypes from 'prop-types'

export class ManagmentItem extends PureComponent {
  state = {
    edited: false,
    user: {
      inn: "",
      fio: "",
      passport: "",
      birthday: "",
      address: ""
    }
  }

  componentDidMount() {
    const {item : {inn, last_name, first_name, middle_name, identifyInfo = {inn: "", fio: "", passport: "", birthday: "", address: ""}}} = this.props
    this.setState({
      user: {
        inn: [inn, identifyInfo.inn],
        fio: [`${last_name} ${first_name} ${middle_name}`, identifyInfo.fio],
        passport: identifyInfo.passport,
        birthday: identifyInfo.birthday,
        address: identifyInfo.address
      }
    })
  }

  toggleEdited = () => {
    this.setState(({edited}) => ({edited: !edited }))
  }

  renderFoulderFlItem = (item, key, id) => {
    const { Item : DescriptionsItem} = Descriptions
    const { identifyUser, loading = false } = this.props
    const { edited } = this.state
    const { Panel } = Collapse;

    const BtnExtra = ({user}) => {
      const { identifyUser } = this.props

      const editUserInfo = e => {
        e.stopPropagation()
        this.toggleEdited()
      }

      const identifyUserInfo = e => {
        e.preventDefault()
        identifyUser(user)
      }

      return (
        <span className='heads-search'>
          <Icon 
            title="Редактировать" 
            className={`heads-search-btn${this.state.edited ? "-green" : ""}`} 
            type={this.state.edited ? "check" : "form"} 
            onClick={ e => editUserInfo(e) }
          />
          <Icon 
            title="Поиск информации" 
            className='heads-search-btn' 
            type="file-search" 
            onClick={ e => identifyUserInfo(e) }
          />
        </span>
      )
    }

    const renderDescriptionItems = (item, id, edited) => {
      const { user, user : {inn, fio, passport, birthday, address} } = this.state
      const descrArr = []
      for (const key in user) {
        console.log(`${key} |`, item[key])
        if (user.hasOwnProperty(key) && key === "inn" ) {
          descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={ `${id}-${key}` } label="ИНН" span={1}>
              { edited ? this._renderInut(inn) : inn[0] }
            </DescriptionsItem>
          )
        } else if(user.hasOwnProperty(key) && key === "fio") {
          descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={ `${id}-${key}` } label="ФИО" span={1}>
              { edited ? this._renderInut(fio) : fio[0] } 
            </DescriptionsItem>
          )
        } else if(user.hasOwnProperty(key) && key === "passport" && passport !== "") {
          descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={ `${id}-${key}` } label="Паспорт" span={1}>
              { edited ? this._renderInut(passport) : passport[0] } 
            </DescriptionsItem>
          )
        } else if(user.hasOwnProperty(key) && key === "birthday" && birthday !== "") {
          descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={ `${id}-${key}` } label="Дата рождения" span={1}>
              { edited ? this._renderInut(birthday) : birthday[0] } 
            </DescriptionsItem>
          )
        } else if(user.hasOwnProperty(key) && key === "address" && address !== "") {
          descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={ `${id}-${key}` } label="Адресс" span={1}>
              { edited ? this._renderInut(address) : address[0] } 
            </DescriptionsItem>
          )
        } 
      }

      console.log('descrArr |', descrArr)
      return descrArr
    }

    return (
      <Panel 
        key={String(key)}
        header={ <LeaderHeader {...item} id={id}/> } 
        extra={<BtnExtra user={item} identifyUser={identifyUser}/>}
      >
        <Spin spinning={loading}>
          <Descriptions size="small" bordered border column={{md:5, sm:2, xs:1}}>
            { renderDescriptionItems(item, id, edited) }
          </Descriptions>
        </Spin>
      </Panel>
    )
  }

  _renderInut = data => {
    if(Array.isArray(data)) {
      return (
        <AutoComplete
          style={{ width: 250 }}
          size="small"
          dataSource={data}
          placeholder="Введите значение"
          filterOption={(inputValue, option) =>  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 }
          allowClear
        />
      )
    } else {
      return (
        <AutoComplete
          style={{ width: "100%" }}
          size="small"
          dataSource={[data]}
          placeholder="Введите значение"
          filterOption={(inputValue, option) =>  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 }
          allowClear
        />
      )
    }
  }

  render() {
    const { item, item: {inn}, activeKey, searchData} = this.props
    console.log('this.props', this.props)

    return (
      <Collapse 
        key={inn}
        className="managment"
        activeKey={inn} 
        onChange={this.callback}
        bordered={false}
        expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"} />}
      >
        { item.name && this.renderFoulderUlItem(item, activeKey) }
        { item.middle_name && this.renderFoulderFlItem(item, activeKey, searchData) }
      </Collapse> 
    )
  }
}

export default ManagmentItem

ManagmentItem.propTypes = {
  /** Данные о состоянии loaders */
  activeKey: PropTypes.string
}