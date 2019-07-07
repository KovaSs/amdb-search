import React, { PureComponent } from "react";
import { Collapse, Icon, Spin, Descriptions, AutoComplete, Input, Button, Badge} from "antd";
import LeaderHeader from "../LeaderHeader";
import PropTypes from "prop-types";
import {region} from "../../../../../../store/mock";
import CroinformDrawer from "../../../DrawerContainer/CroinformDrawer";

export class ManagmentItem extends PureComponent {
  state = {
    showCroinformResponse: false,
    edited: false,
    error: false,
    parseAddress: {
      CityExp: '', // Нас. пункт
      StreetExp: '', // Улица
      HouseExp: '', // Номер дома
      BuildExp: '', // Корп
      BuildingExp: '', // Стр
      FlatExp: '', // Квар
      RegionExp: '', // Код региона
      RegionExpText: "" // Регион
    },
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

  componentDidCatch(err) {
    console.log('err', err)
    return this.setState({
      error: true
    })
  }

  toggleEdited = () => {
    this.setState(({ edited }) => ({ edited: !edited }));
  };

  getCroinformIdentifyRequest = e => {
    e.stopPropagation();
    const { userSelected, parseAddress } = this.state;
    const { item, actionGetUserCroinformInfo } = this.props;
    const user = {
      INN: userSelected.inn ? userSelected.inn : item.inn ,
      FirstName: userSelected.fio ? this.parsingSelectFio(userSelected.fio).FirstName : item.first_name, 
      FirstNameArch: userSelected.fio ? this.parsingSelectFio(userSelected.fio).FirstName : item.first_name,
      MiddleName: userSelected.fio ? this.parsingSelectFio(userSelected.fio).MiddleName : item.middle_name,
      SurName: userSelected.fio ? this.parsingSelectFio(userSelected.fio).SurName : item.last_name,
      DateOfBirth: userSelected.birthday, 
      Seria: this.parsingSelectPassport(userSelected.passport).Seria,
      Number: this.parsingSelectPassport(userSelected.passport).Number,

      RegionExp: parseAddress.RegionExp, 
      CityExp: parseAddress.CityExp, 
      StreetExp: parseAddress.StreetExp, 
      HouseExp: parseAddress.HouseExp, 
      BuildExp: parseAddress.BuildExp, 
      BuildingExp: parseAddress.BuildingExp, 
      FlatExp: parseAddress.FlatExp, 
    }
    console.log('user', user)
    actionGetUserCroinformInfo(user)
  }

  /* Отображение Drawer с данными из Croinform */
  showDrawer = e => {
    e.stopPropagation();
    this.setState({
      showCroinformResponse: new Date()
    });
  };

  onDoubleClickEvent = e => {
    console.log('onDoubleClickEvent', e)
    this.toggleEdited()
  }

  /* Рендеринг физического лица */
  renderFoulderFlItem = (item, key, id) => {
    const { Item: DescriptionsItem } = Descriptions;
    const { identifyUser, loading, companyName } = this.props;
    const { edited, userSelected } = this.state;
    const { Panel } = Collapse;

    const BtnExtra = ({ user }) => {
      const { identifyUser, croinformRes } = this.props;
      const { userSelected, parseAddress, edited } = this.state;
      const croinformDisabled = !userSelected.inn && !userSelected.fio && !userSelected.passport && !parseAddress.RegionExp && !parseAddress.CityExp && !parseAddress.StreetExp &&!parseAddress.HouseExp

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
          <Badge dot={croinformRes} offset={[-6,1]} status={croinformRes ? "success"  : ""}>
            <Button
              title="Показать ответ Croinform"
              size="small"
              style={{color: (croinformDisabled || edited || !croinformRes) ? "gray" : "rgba(14, 117, 253, 0.992)", marginRight: 5}}
              disabled={croinformDisabled || edited || !croinformRes}
              icon="solution"
              onClick={e => this.showDrawer(e)}
            />
          </Badge>
          <Button
            title="Проверить в Croinform"
            size="small"
            style={{color: (croinformDisabled || edited) ? "gray" : "#52c41a", marginRight: 5}}
            disabled={croinformDisabled || edited}
            icon="global"
            onClick={e => this.getCroinformIdentifyRequest(e)}
          />
          <Button
            title="Поиск информации"
            size="small"
            style={{color: "rgba(14, 117, 253, 0.992)", marginRight: 5}}
            // disabled={edited}
            icon="file-search"
            onClick={e => identifyUserInfo(e)}
          />
          <Button
            title="Редактировать"
            size="small"
            style={{color: this.state.edited ? "#52c41a" : "rgba(14, 117, 253, 0.992)", marginRight: 5}}
            icon={edited ? "check" : "form"}
            onClick={e => editUserInfo(e)}
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
        parseAddress: {CityExp, StreetExp, HouseExp, BuildExp, BuildingExp, FlatExp, RegionExpText},
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
          !edited && (passport !== "" || userSelected.passport) && descrArr.push(
            <DescriptionsItem  key={`${id}-${key}`} id={`${id}-${key}`} label="Паспорт" span={1} >
              <label onDoubleClick={e => this.onDoubleClickEvent(e)}>{ userSelected.passport  ? userSelected.passport : `${passport[0].seria} ${passport[0].number}` }</label>
            </DescriptionsItem>
          )
        } else if ( user.hasOwnProperty(key) && key === "birthday" ) {
          edited && descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Дата рождения" span={1} >
              { this._renderInut(birthday, "birthday") }
            </DescriptionsItem>
          )
          !edited && (birthday !== "" || userSelected.birthday) && descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Дата рождения" span={1} >
              <label onDoubleClick={e => this.onDoubleClickEvent(e)}>{ userSelected.birthday  ? userSelected.birthday : birthday[0] }</label>
            </DescriptionsItem>
          )
        } else if ( user.hasOwnProperty(key) && key === "address" ) {
          edited && descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Адрес" span={1} >
              { this._renderInut(address, "address") }
            </DescriptionsItem>
          );
          !edited && (address !== "" || (CityExp || StreetExp || HouseExp || BuildExp || BuildingExp || FlatExp || RegionExpText)) && descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Адрес" span={1} >
              <label onDoubleClick={e => this.onDoubleClickEvent(e)}>{ 
                (CityExp || StreetExp || HouseExp || BuildExp || BuildingExp || FlatExp || RegionExpText) ?
                `${RegionExpText.toUpperCase()} ${StreetExp.toUpperCase()} ${HouseExp.toUpperCase()} ${BuildExp.toUpperCase()} ${BuildingExp.toUpperCase()} ${FlatExp.toUpperCase()}` :
                address[0]
              }</label>
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
          {
            (item.identifyInfo || edited || userSelected.passport) && 
            <Descriptions
              size="small"
              bordered
              border
              column={{ md: 3, sm: 2, xs: 1 }}
            >
              {renderDescriptionItems()}
            </Descriptions>
          }
          {
            !item.identifyInfo && !edited && (!userSelected.passport)  && 
            <div style={{textAlign: "center", cursor: "pointer"}} >
              <label onDoubleClick={e => this.onDoubleClickEvent(e)}>
                Для ввода информации необходимой для проверки данного субъекта дважды кликните по этому сообщению или по кнопке
              </label>
              <Button
                title="Редактировать"
                size="small"
                style={{color: "rgba(14, 117, 253, 0.992)", margin: "0 5px"}}
                icon={"form"}
              />
              <label onDoubleClick={e => this.onDoubleClickEvent(e)}> 
                на панели редактирования, для идентификации и получения данных для автозаполнения кликните по кнопке
              </label>
              <Button
                title="Поиск информации"
                size="small"
                style={{color: "rgba(14, 117, 253, 0.992)", margin: "0 5px"}}
                icon="file-search"
              />
            </div>
          }
        </Spin>
      </Panel>
    );
  };

  /* Парсинг Паспорта */
  parsingSelectPassport = passport => {
    const passArr = passport.split(" ")
    const Number = passArr.pop()
    const Seria = passArr.pop()
    // console.log('Серия', Seria)
    // console.log('Номер', Number)
    // console.log('----------------------')
    return { Seria, Number }
  }

  /* Парсинг ФИО */
  parsingSelectFio = fio => {
    const fioArr = fio.split(" ")
    const MiddleName = fioArr.pop()
    const FirstName = fioArr.pop()
    const SurName = String(fioArr)
    // console.log('Имя', FirstName)
    // console.log('Отчество', MiddleName)
    // console.log('Фамилия', SurName)
    // console.log('----------------------')
    return { FirstName, MiddleName, SurName }
  }

  /* Парсинг адреса */
  parsingSelectAddress = address => {
    if(!address) return this.setState(({parseAddress}) => ({
      parseAddress: {
        CityExp: "", // Нас. пункт
        StreetExp: "", // Улица
        HouseExp: "", // Номер дома
        BuildExp: "", // Корп
        BuildingExp: "", // Стр
        FlatExp: "", // Квар
        RegionExp: "", // Регион
      }
    })) 

    let p = address.split(' ');
  
    let RegionExp = ''; // Регион
    let CityExp = ''; // Нас. пункт
    let StreetExp = ''; // Улица
    let HouseExp = ''; // Номер дома
    let BuildExp = ''; // Корп
    let BuildingExp = ''; // Стр
    let FlatExp = ''; // Квар
    let i = p.length - 1;
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
    if (p.length) {
      RegionExp = region.filter(item => item.title.toUpperCase().indexOf(p[0].toUpperCase()) !== -1)[0]
    }
    // console.log('Искодный адрес', address) // Регион
    // console.log('RegionExp', RegionExp ? RegionExp.value : RegionExp) // Регион
    // console.log('CityExp', CityExp) // Нас. пункт
    // console.log('StreetExp', StreetExp) // Улица
    // console.log('HouseExp', HouseExp) // Дом
    // console.log('BuildExp', BuildExp) // Корп
    // console.log('BuildingExp', BuildingExp) // Стр
    // console.log('FlatExp', FlatExp) // Квартира
    // console.log('----------------------')
    this.setState(({parseAddress}) => ({
      parseAddress: {
        CityExp, // Нас. пункт
        StreetExp, // Улица
        HouseExp, // Номер дома
        BuildExp, // Корп
        BuildingExp, // Стр
        FlatExp, // Квар
        RegionExp: RegionExp.value, // Регион
        RegionExpText: RegionExp.title// Регион
      }
    })) 
  }


  /* Рендеринг редактируемых инпутов  */
  _renderInut = (data, keyId) => {
    const { Option } = AutoComplete;
    const { user, userSelected, parseAddress } = this.state

    // Изменение state через onChange
    const handleChangeInn = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, inn: value } }))
    const handleChangeFio = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, fio: value } }))
    const handleChangeBirthday = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, birthday: value } }))
    const handleChangePassport = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, passport: value } }))
    // Изменение распарсенного адреса
    const handleChangeAddressRegionExp = value =>  this.setState(({ parseAddress }) => ( { parseAddress: { ...parseAddress, RegionExpText: value } }))
    const handleChangeAddressCityExp = e => { const value = e.target.value; return this.setState(({ parseAddress }) => ({ parseAddress: { ...parseAddress, CityExp: value} })) }
    const handleChangeAddressStreetExp = e => { const value = e.target.value; return this.setState(({ parseAddress }) => ({ parseAddress: { ...parseAddress, StreetExp: value} })) }
    const handleChangeAddressHouseExp = e => { const value = e.target.value; return this.setState(({ parseAddress }) => ({ parseAddress: { ...parseAddress, HouseExp: value} })) }
    const handleChangeAddressBuildExp = e => { const value = e.target.value; return this.setState(({ parseAddress }) => ({ parseAddress: { ...parseAddress, BuildExp: value} })) }
    const handleChangeAddressBuildingExp = e => { const value = e.target.value; return this.setState(({ parseAddress }) => ({ parseAddress: { ...parseAddress, BuildingExp: value} })) }
    const handleChangeAddressFlatExp = e => { const value = e.target.value; return this.setState(({ parseAddress }) => ({ parseAddress: { ...parseAddress, FlatExp: value} })) }
    // Изменение state через onSelect
    const handleSelectOption = (value, option) =>  this.setState(({ userSelected }) => {
      if(option.props.text === "address") this.parsingSelectAddress(value)
      if(option.props.text === "passport") this.parsingSelectPassport(value)
      if(option.props.text === "fio") this.parsingSelectFio(value)
      return { userSelected: { ...userSelected, [option.props.text]: value } }
    })
    const handleSelectAddressOption = value =>  {
      this.parsingSelectAddress(value)
    }
    // Изменение региона на onChange
    const handleSelectRegionOption = value => this.setState(({parseAddress}) => {
      return {
        parseAddress: {
          ...parseAddress, 
          RegionExpText: value, 
          RegionExp: region.filter(item => item.title.toUpperCase().indexOf(value.toUpperCase()) !== -1)[0].value
        }
      }
    })
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
        <Option key={item.value} text="RegionExpText" title={item.title} value={item.title}>
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
            key="region"
            style={{ width: 250 }}
            size="small"
            value={parseAddress.RegionExpText}
            dataSource={region.map(renderRegionOption)}
            onChange={handleChangeAddressRegionExp}
            onSelect={handleSelectRegionOption}
            placeholder="Регион"
            filterOption={(value, option) =>  option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1}
            allowClear
          />
          <Input value={parseAddress.CityExp} onChange={handleChangeAddressCityExp} placeholder="Населенный пункт" style={{ width: 150 }} size="small"/>
          <Input value={parseAddress.StreetExp} onChange={handleChangeAddressStreetExp} placeholder="Улица" style={{ width: 150 }} size="small"/>
          <Input value={parseAddress.HouseExp} onChange={handleChangeAddressHouseExp} placeholder="№ дома" style={{ width: 80 }} size="small"/>
          <Input value={parseAddress.BuildExp} onChange={handleChangeAddressBuildExp} placeholder="Корпус" style={{ width: 80 }} size="small"/>
          <Input value={parseAddress.BuildingExp} onChange={handleChangeAddressBuildingExp} placeholder="Строение" style={{ width: 80 }} size="small"/>
          <Input value={parseAddress.FlatExp} onChange={handleChangeAddressFlatExp} placeholder="Квартира" style={{ width: 80 }} size="small"/>
          {"  "}
          {user.address && <AutoComplete
            key={keyId}
            style={{ width: 200 }}
            size="small"
            dataSource={user.address ? data.map(renderOption) : false}
            onChange={handleSelectAddressOption}
            placeholder="Автозаполнения адреса"
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
  }

  render() {
    const { item, item: { inn }, activeKey, searchData, croinformRes } = this.props;
    const {error, showCroinformResponse} = this.state
    if(error) return <div>В компоненте произошла ошибка</div>

    return (
      <>
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
          {item.middle_name && this.renderFoulderFlItem(item, activeKey, searchData)}
        </Collapse>
        <CroinformDrawer toggleDrawer={showCroinformResponse} croinformRes={croinformRes} user={item}/>
      </>
    );
  }
}

export default ManagmentItem;

ManagmentItem.propTypes = {
  /** Данные о состоянии loaders */
  activeKey: PropTypes.string.isRequired,
  identifyUser: PropTypes.func.isRequired,
};
