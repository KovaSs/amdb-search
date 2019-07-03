import React, { PureComponent } from "react";
import { Collapse, Icon, Spin, Descriptions, Input, Row, Col, Select } from "antd";
import LeaderHeader from "../LeaderHeader";
import PropTypes from "prop-types";

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
  };

  componentDidMount() {
    const { item: { inn, last_name, first_name, middle_name, identifyInfo = { inn: "", fio: "", passport: "", birthday: "", address: ""}}} = this.props;
    this.setState({
      user: {
        inn: [...new Set([inn, ...identifyInfo.inn])],
        fio: [ ...new Set( [`${last_name} ${first_name} ${middle_name}`], ...identifyInfo.fio ) ],
        passport: identifyInfo.passport,
        birthday: identifyInfo.birthday,
        address: identifyInfo.address
      }
    });
  }

  componentDidUpdate(prevProps) {
    const {
      item,
      item: {
        inn,
        last_name,
        first_name,
        middle_name,
        identifyInfo = {
          inn: "",
          fio: "",
          passport: "",
          birthday: "",
          address: ""
        }
      }
    } = this.props;
    if (item !== prevProps.item) {
      this.setState({
        user: {
          inn: [...new Set([inn, ...identifyInfo.inn])],
          fio: [ ...new Set( [`${last_name} ${first_name} ${middle_name}`], ...identifyInfo.fio ) ],
          passport: identifyInfo.passport,
          birthday: identifyInfo.birthday,
          address: identifyInfo.address
        }
      });
    }
  }

  toggleEdited = () => {
    this.setState(({ edited }) => ({ edited: !edited }));
  };

  renderFoulderFlItem = (item, key, id) => {
    const { Item: DescriptionsItem } = Descriptions;
    const { identifyUser, loading = false } = this.props;
    const { Panel } = Collapse;

    const BtnExtra = ({ user }) => {
      const { identifyUser } = this.props;

      const editUserInfo = e => {
        e.stopPropagation();
        this.toggleEdited();
      };

      const identifyUserInfo = e => {
        e.stopPropagation();
        identifyUser(user);
      };

      return (
        <span className="heads-search">
          <Icon
            title="Редактировать"
            className={`heads-search-btn${this.state.edited ? "-green" : ""}`}
            type={this.state.edited ? "check" : "form"}
            onClick={e => editUserInfo(e)}
          />
          <Icon
            title="Поиск информации"
            className="heads-search-btn"
            type="file-search"
            onClick={e => identifyUserInfo(e)}
          />
        </span>
      );
    };

    const renderDescriptionItems = () => {
      const {  user, user: { inn, fio, passport, birthday, address }, userSelected, edited } = this.state;
      const descrArr = [];
      const id = "heads";
      for (const key in user) {
        if (user.hasOwnProperty(key) && key === "inn") {
          descrArr.push(
            <DescriptionsItem
              key={`${id}-${key}`}
              id={`${id}-${key}`}
              label="ИНН"
              span={1}
            >
              {edited ? 
                this._renderInut("inn") : 
                userSelected.inn ? userSelected.inn : inn[0]
              }
            </DescriptionsItem>
          );
        } else if (user.hasOwnProperty(key) && key === "fio") {
          descrArr.push(
            <DescriptionsItem
              key={`${id}-${key}`}
              id={`${id}-${key}`}
              label="ФИО"
              span={1}
            >
              {edited ? 
                this._renderInut("fio") : 
                userSelected.fio ? userSelected.fio : fio[0]
              }
            </DescriptionsItem>
          );
        } else if (
          user.hasOwnProperty(key) &&
          key === "passport" &&
          passport !== ""
        ) {
          descrArr.push(
            <DescriptionsItem
              key={`${id}-${key}`}
              id={`${id}-${key}`}
              label="Паспорт"
              span={1}
            >
              {edited ? 
                this._renderInut("passport") : 
                userSelected.passport ? userSelected.passport : `${passport[0].seria} ${passport[0].number}`
              }
            </DescriptionsItem>
          );
        } else if (
          user.hasOwnProperty(key) &&
          key === "birthday" &&
          birthday !== ""
        ) {
          descrArr.push(
            <DescriptionsItem
              key={`${id}-${key}`}
              id={`${id}-${key}`}
              label="Дата рождения"
              span={1}
            >
              {edited ? 
                this._renderInut("birthday") : 
                userSelected.birthday ? userSelected.birthday : birthday[0]
              }
            </DescriptionsItem>
          );
        } else if (
          user.hasOwnProperty(key) &&
          key === "address" &&
          address !== ""
        ) {
          descrArr.push(
            <DescriptionsItem
              key={`${id}-${key}`}
              id={`${id}-${key}`}
              label="Адресс"
              span={1}
            >
              {edited ? 
                this._renderInut("address") : 
                userSelected.address ? userSelected.address : address[0]
              }
            </DescriptionsItem>
          );
        }
      }
      return descrArr;
    };

    return (
      <Panel
        key={String(key)}
        header={<LeaderHeader {...item} id={id} />}
        extra={<BtnExtra user={item} identifyUser={identifyUser} />}
      >
        <Row>
          <Col span={this.state.edited ? 18 : 24}>
            <Spin spinning={loading}>
              <Descriptions
                size="small"
                bordered
                border
                column={this.state.edited ? { md: 3, sm: 2, xs: 1 } : { md: 5, sm: 2, xs: 1 }}
              >
                {renderDescriptionItems()}
              </Descriptions>
            </Spin>
          </Col>
          <Col span={this.state.edited ? 6 : 0}>
            <Row className="edited-identify-info">
              {this._renderIdentifyinfoSelectors()}
            </Row>
          </Col>
        </Row>
      </Panel>
    );
  };

  _renderIdentifyinfoSelectors = () => {
    const {user} = this.state
    const { Option } = Select
    const identifyInfoArr = []
    for (const key in user) {
      if (user.hasOwnProperty(key) && user[key][0] && key !== "passport") {
        identifyInfoArr.push(
          <Col key={String(key)} span={12}>
            <Select 
              style={{ width: "100%" }}
              size="small"
              onChange={this.handleSelectOption}
              placeholder="Выберите значение"
            >
              {user[key].map((item, index) => <Option text={key} key={index} value={item} title={item}>{item}</Option>)}
            </Select>
          </Col>
        )
      } else if ( user[key][0] && key === "passport") {
        identifyInfoArr.push(
          <Col key={String(key)} span={12}>
            <Select 
              style={{ width: "100%" }}
              size="small"
              onChange={this.handleSelectOption}
              placeholder="Выберите значение"
            >
              {user[key].map((item, index) => <Option text={key} key={index} value={`${item.seria} ${item.number}`} title={`${item.seria} ${item.number}`}>{`${item.seria} ${item.number}`}</Option>)}
            </Select>
          </Col>
        )
      }
    }
    return identifyInfoArr
  }

  handleSelectOption = (value, option) => {
    console.log('select-value', value)
    console.log('select-option', option)

    this.setState(({ userSelected }) => ({
      userSelected: {
        ...userSelected,
        [option.props.text]: value
      }
    }));
  };


  // Рендеринг редактируемых инпутов
  _renderInut = keyId => {
    const {userSelected} = this.state
    // Изменение значения инпута при редактировании
    const changeOptionInput = e => {
      const target = e.target.value
      this.setState(({ userSelected }) => {
        return {
          userSelected: {
            ...userSelected,
            [keyId]: target
          }
        }
      });
    }

    return  <Input onChange={changeOptionInput} size="small" value={userSelected[keyId]} />
  };

  render() {
    const { item, item: { inn }, activeKey, searchData } = this.props;

    return (
      <Collapse
        key={inn}
        className="managment"
        defaultActiveKey={inn}
        onChange={this.callback}
        bordered={false}
        expandIcon={({ isActive }) => (
          <Icon type={!isActive ? "plus-square" : "minus-square"} />
        )}
      >
        {item.middle_name && this.renderFoulderFlItem(item, activeKey, searchData)}
        {item.name && this.renderFoulderUlItem(item, activeKey)}
      </Collapse>
    );
  }
}

export default ManagmentItem;

ManagmentItem.propTypes = {
  /** Данные о состоянии loaders */
  activeKey: PropTypes.string.isRequired,
  identifyUser: PropTypes.func.isRequired,
};
