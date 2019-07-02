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
    },
    userSelected: {
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
        inn: [...new Set([inn, ...identifyInfo.inn])],
        fio: [...new Set([`${last_name} ${first_name} ${middle_name}`], ...identifyInfo.fio)],
        passport: identifyInfo.passport,
        birthday: identifyInfo.birthday,
        address: identifyInfo.address
      }
    })
  }

  componentDidUpdate(prevProps) {
    const {item, item : {inn, last_name, first_name, middle_name, identifyInfo = {inn: "", fio: "", passport: "", birthday: "", address: ""} }} = this.props
    if(item !== prevProps.item) {
      this.setState({
        user: {
          inn: [...new Set([inn, ...identifyInfo.inn])],
          fio: [...new Set([`${last_name} ${first_name} ${middle_name}`], ...identifyInfo.fio)],
          passport: identifyInfo.passport,
          birthday: identifyInfo.birthday,
          address: identifyInfo.address
        }
      })
    }
  }

  toggleEdited = () => {
    this.setState(({edited}) => ({edited: !edited }))
  }

  renderFoulderFlItem = (item, key, id) => {
    const { Item : DescriptionsItem} = Descriptions
    const { identifyUser, loading = false } = this.props
    const { Panel } = Collapse;

    const BtnExtra = ({user}) => {
      const { identifyUser } = this.props

      const editUserInfo = e => {
        e.stopPropagation()
        this.toggleEdited()
      }

      const identifyUserInfo = e => {
        e.stopPropagation()
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

    const renderDescriptionItems = () => {
      const { user, user : {inn, fio, passport, birthday, address}, edited } = this.state
      const descrArr = []
      const id = "heads"
      for (const key in user) {
        if (user.hasOwnProperty(key) && key === "inn" ) {
          descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={ `${id}-${key}` } label="ИНН" span={1}>
              { edited ? this._renderInut(inn, "inn") : inn[0] }
            </DescriptionsItem>
          )
        } else if(user.hasOwnProperty(key) && key === "fio") {
          descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={ `${id}-${key}` } label="ФИО" span={1}>
              { edited ? this._renderInut(fio, "fio") : fio[0] } 
            </DescriptionsItem>
          )
        } else if(user.hasOwnProperty(key) && key === "passport" && passport !== "") {
          descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={ `${id}-${key}` } label="Паспорт" span={1}>
              { edited ? this._renderInut(passport, "passport") : `${passport[0].seria} ${passport[0].number}` } 
            </DescriptionsItem>
          )
        } else if(user.hasOwnProperty(key) && key === "birthday" && birthday !== "") {
          descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={ `${id}-${key}` } label="Дата рождения" span={1}>
              { edited ? this._renderInut(birthday, "birthday") : birthday[0] } 
            </DescriptionsItem>
          )
        } else if(user.hasOwnProperty(key) && key === "address" && address !== "") {
          descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={ `${id}-${key}` } label="Адресс" span={1}>
              { edited ? this._renderInut(address, "adress") : address[0] } 
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
            { renderDescriptionItems() }
          </Descriptions>
        </Spin>
      </Panel>
    )
  }

  handleSelectOption = (value, option) => {
    console.log('value', value)
    console.log('option', option)
  }

  _renderInut = (data, keyId) => {
    if(Array.isArray(data) && data[0].number){
      const newData = data.map(item => `${item.seria} ${item.number}`)
      console.log('PASSPORT |', newData)
      return (
        <AutoComplete
          key={keyId}
          style={{ width: 250 }}
          size="small"
          dataSource={newData}
          placeholder="Введите значение"
          onSelect={this.handleSelectOption}
          filterOption={(inputValue, option) =>  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 }
          allowClear
        />
      )
    } else if(Array.isArray(data) && !data[0].number) {
      return (
        <AutoComplete
          key={keyId}
          style={{ width: 250 }}
          size="small"
          dataSource={data}
          onSelect={this.handleSelectOption}
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
        defaultActiveKey={inn} 
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