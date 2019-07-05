import React, { PureComponent } from "react";
import { Collapse, Icon, Spin, Descriptions, AutoComplete, Input} from "antd";
import LeaderHeader from "../LeaderHeader";
import PropTypes from "prop-types";
import {region} from "../../../../../../store/mock";

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

  /* Обновление данных state при первой загрузке страницы */
  componentDidMount() {
    const { item: { inn, last_name, first_name,  middle_name, identifyInfo = { inn: "", fio: "", passport: "", birthday: "", address: ""}}} = this.props;
    this.setState({
      user: {
        inn: [...new Set([inn, ...identifyInfo.inn])],
        fio: [
          ...new Set(
            [`${last_name} ${first_name} ${middle_name}`],
            ...identifyInfo.fio
          )
        ],
        passport: identifyInfo.passport,
        birthday: identifyInfo.birthday,
        address: identifyInfo.address
      }
    });
  }

  /* Обновление данных state при идентификации физического лица */
  componentDidUpdate(prevProps) {
    const { item, item: { inn, last_name, first_name,  middle_name, identifyInfo = { inn: "", fio: "", passport: "", birthday: "", address: ""}}} = this.props;
    if (item !== prevProps.item) {
      this.setState({
        user: {
          inn: [...new Set([inn, ...identifyInfo.inn])],
          fio: [
            ...new Set(
              [`${last_name} ${first_name} ${middle_name}`],
              ...identifyInfo.fio
            )
          ],
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

  /* Рендеринг физического лица */
  renderFoulderFlItem = (item, key, id) => {
    const { Item: DescriptionsItem } = Descriptions;
    const { identifyUser, loading, companyName } = this.props;
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

    /* Рендеринг информации DescriptionItem */
    const renderDescriptionItems = () => {
      const {
        user,
        user: { inn, fio, passport, birthday, address },
        userSelected,
        edited
      } = this.state;
      const descrArr = [];
      const id = "heads";
      for (const key in user) {
        if (user.hasOwnProperty(key) && key === "inn") {
          inn.length > 1 && edited && descrArr.push(
            <DescriptionsItem  key={`${id}-${key}`} id={`${id}-${key}`} label="ИНН" span={1} >
              { this._renderInut(inn, "inn") }
            </DescriptionsItem>
          )
        } else if (user.hasOwnProperty(key) && key === "fio") {
          fio.length > 1 && edited && descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="ФИО" span={1} >
              { this._renderInut(fio, "fio") }
            </DescriptionsItem>
          )
        } else if ( user.hasOwnProperty(key) && key === "passport" ) {
          edited && descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Паспорт" span={1} >
              { this._renderInut(passport, "passport") }
            </DescriptionsItem>
          )
          !edited && passport !== "" && descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Паспорт" span={1} >
              { userSelected.passport  ? userSelected.passport : `${passport[0].seria} ${passport[0].number}` }
            </DescriptionsItem>
          )
        } else if ( user.hasOwnProperty(key) && key === "birthday" ) {
          edited && descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Дата рождения" span={1} >
              { this._renderInut(birthday, "birthday") }
            </DescriptionsItem>
          )
          !edited && birthday !== "" && descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Дата рождения" span={1} >
              { userSelected.birthday  ? userSelected.birthday : birthday[0] }
            </DescriptionsItem>
          )
        } else if ( user.hasOwnProperty(key) && key === "address" ) {
          edited && descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Адрес" span={1} >
              { this._renderInut(address, "address") }
            </DescriptionsItem>
          );
          !edited && address !== "" && descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Адрес" span={1} >
              { userSelected.address  ? userSelected.address : address[0] }
            </DescriptionsItem>
          );
        }
      }
      return descrArr
    }

    return (
      <Panel
        key={String(key)}
        header={<LeaderHeader {...item} companyName={companyName} id={id} />}
        extra={<BtnExtra user={item} identifyUser={identifyUser} />}
      >
        <Spin spinning={loading.identifyUser[item.inn] ? true : false}>
          <Descriptions
            size="small"
            bordered
            border
            column={{ md: 3, sm: 2, xs: 1 }}
          >
            {renderDescriptionItems()}
          </Descriptions>
        </Spin>
      </Panel>
    );
  };

  /* Парсинг Паспорта */
  parsingSelectPassport = passport => {
    const passArr = passport.split(" ")
    const number = passArr.pop()
    const seria = passArr.pop()
    console.log('Серия', seria)
    console.log('Номер', number)
    console.log('----------------------')
  }

  /* Парсинг ФИО */
  parsingSelectFio = fio => {
    const fioArr = fio.split(" ")
    const middle_name = fioArr.pop()
    const first_name = fioArr.pop()
    const last_name = String(fioArr)
    console.log('Имя', first_name)
    console.log('Отчество', middle_name)
    console.log('Фамилия', last_name)
    console.log('----------------------')
  }

  /* Парсинг адреса */
  parsingSelectAddress = address => {
    var p = address.split(' ');
  
    var CityExp = ''; // Нас. пункт
    var StreetExp = ''; // Улица
    var HouseExp = ''; // Номер дома
    var BuildExp = ''; // Корп
    var BuildingExp = ''; // Стр
    var FlatExp = ''; // Квар
    var i = p.length - 1;
    if (parseInt(p[i - 3])) {
      FlatExp = p.pop();
      BuildingExp = p.pop();
      BuildExp = p.pop();
      HouseExp = p.pop();
    } else if (parseInt(p[i - 2])) {
      FlatExp = p.pop();
      BuildExp = p.pop();
      HouseExp = p.pop();
    } else if (parseInt(p[i - 1])) {
      FlatExp = p.pop();
      HouseExp = p.pop();
    } else {
      HouseExp = p.pop();
    }
    StreetExp = p.pop();
    if (p.length) CityExp = p.pop();
    console.log('CityExp', CityExp)
    console.log('StreetExp', StreetExp)
    console.log('HouseExp', HouseExp)
    console.log('BuildExp', BuildExp)
    console.log('BuildingExp', BuildingExp)
    console.log('FlatExp', FlatExp)
    console.log('----------------------')
  }


  /* Рендеринг редактируемых инпутов  */
  _renderInut = (data, keyId) => {
    const { Option } = AutoComplete;
    const { user, userSelected } = this.state

    // Изменение state через onChange
    const handleChangeInn = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, inn: value } }))
    const handleChangeFio = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, fio: value } }))
    const handleChangeBirthday = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, birthday: value } }))
    const handleChangeAddress = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, address: value } }))
    const handleChangePassport = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, passport: value } }))
    // Изменение state через onSelect
    const handleSelectOption = (value, option) =>  this.setState(({ userSelected }) => {
      if(option.props.text === "address") this.parsingSelectAddress(value)
      if(option.props.text === "passport") this.parsingSelectPassport(value)
      if(option.props.text === "fio") this.parsingSelectFio(value)
      return { userSelected: { ...userSelected, [option.props.text]: value } }
    })
    const handleSelectRegionOption = (value, option) => {
      console.log('value', value)
      console.log('option', option)
    }
    // Рендеринг опций выпадающего меню
    const renderOption = item => {
      return (
        <Option key={item} text={keyId} title={item}>
          {item}
        </Option>
      );
    };
    // Рендеринг опций выпадающего меню
    const renderRegionOption = item => {
      return (
        <Option key={item.value} text={keyId} title={item.title} value={item.value}>
          {item.title}
        </Option>
      );
    };

    if ( keyId === "inn") {
      return (
        <AutoComplete
          key={keyId}
          style={{ width: 250 }}
          size="small"
          value={userSelected[keyId]}
          dataSource={user.inn ? data.map(renderOption) : false}
          onSelect={handleSelectOption}
          onChange={handleChangeInn}
          placeholder="Введите ИНН"
          filterOption={(value, option) =>  option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1}
          allowClear
        />
      );
    } else if ( keyId === "fio") {
      return (
        <AutoComplete
          key={keyId}
          style={{ width: 250 }}
          size="small"
          value={userSelected[keyId]}
          dataSource={user.fio ? data.map(renderOption) : false}
          onSelect={handleSelectOption}
          onChange={handleChangeFio}
          placeholder="Введите ФИО"
          filterOption={(value, option) =>  option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1}
          allowClear
        />
      );
    } else if ( keyId === "birthday") {
      return (
        <AutoComplete
          key={keyId}
          style={{ width: 250 }}
          size="small"
          value={userSelected[keyId]}
          dataSource={user.birthday ? data.map(renderOption) : false}
          onSelect={handleSelectOption}
          onChange={handleChangeBirthday}
          placeholder="Введите дату рождения"
          filterOption={(value, option) =>  option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1}
          allowClear
        />
      );
    } else if ( keyId === "address") {
      return (
        <>
          <AutoComplete
            key={region}
            style={{ width: 250 }}
            size="small"
            dataSource={region.map(renderRegionOption)}
            onSelect={handleSelectRegionOption}
            placeholder="Регион"
            filterOption={(value, option) =>  option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1}
            allowClear
          />
          <Input placeholder="Населенный пункт" style={{ width: 150 }} size="small"/>
          <Input placeholder="Улица" style={{ width: 150 }} size="small"/>
          <Input placeholder="№ дома" style={{ width: 80 }} size="small"/>
          <Input placeholder="Корпус" style={{ width: 80 }} size="small"/>
          <Input placeholder="Строение" style={{ width: 80 }} size="small"/>
          <Input placeholder="Квартира" style={{ width: 80 }} size="small"/>
          {"  "}
          {user.address && <AutoComplete
            key={keyId}
            style={{ width: 200 }}
            size="small"
            value={userSelected[keyId]}
            dataSource={user.address ? data.map(renderOption) : false}
            onSelect={handleSelectOption}
            onChange={handleChangeAddress}
            placeholder="Выберите адрес для автозаполнения"
            filterOption={(value, option) =>  option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1}
            allowClear
          />}
        </>
      );
    } else if ( keyId === "passport") {
      return (
        <AutoComplete
          key={keyId}
          style={{ width: 250 }}
          size="small"
          value={userSelected[keyId]}
          dataSource={user.passport ? data.map(item => `${item.seria} ${item.number}`).map(renderOption) : false}
          placeholder="Введите паспортные данные"
          onSelect={handleSelectOption}
          onChange={handleChangePassport}
          filterOption={(value, option) =>  option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1}
          allowClear
        />
      );
    }
  };

  render() {
    const {
      item,
      item: { inn },
      activeKey,
      searchData
    } = this.props;

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
        {item.name && this.renderFoulderUlItem(item, activeKey)}
        {item.middle_name &&
          this.renderFoulderFlItem(item, activeKey, searchData)}
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
