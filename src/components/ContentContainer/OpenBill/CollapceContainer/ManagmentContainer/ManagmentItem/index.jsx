import React, { PureComponent } from "react";
import { Collapse, Icon, Spin, Descriptions, AutoComplete, Input, Button, Badge, notification } from "antd";
import PropTypes from "prop-types";
import { union } from "lodash";
import LeaderHeader from "../LeaderHeader";
import LeaderEditedHeader from "../LeaderEditedHeader";
import {region, parsingFio, parsingPassport} from "../../../../../../services/utils";
import CroinformDrawer from "../../../DrawerContainer/CroinformDrawer";

export class ManagmentItem extends PureComponent {
  state = {
    showCroinformResponse: false,
    edited: false,
    error: false,
    openPanel: false,
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
      FirstName: "",
      MiddleName: "",
      SurName: "",
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
        inn: union([inn], identifyInfo.inn), 
        fio: union( [`${last_name} ${first_name} ${middle_name}`], identifyInfo.fio ), 
        passport: identifyInfo.passport,
        birthday: identifyInfo.birthday,
        address: identifyInfo.address
      },
      userSelected: {
        inn: inn,
        FirstName: first_name,
        MiddleName: middle_name,
        SurName: last_name,
      }
    });
  }

  /* Обновление данных state при идентификации физического лица */
  componentDidUpdate(prevProps, prevState) {
    const { 
      item,
      errors,
      item: { id, inn, last_name, first_name,  middle_name, identifyInfo = { inn: "", fio: "", passport: "", birthday: "", address: ""}}
    } = this.props;
    if (item !== prevProps.item) {
      this.setState({
        user: {
          inn: union([inn], identifyInfo.inn), 
          fio: union( [`${last_name} ${first_name} ${middle_name}`], identifyInfo.fio ), 
          passport: identifyInfo.passport,
          birthday: identifyInfo.birthday,
          address: identifyInfo.address
        },
        userSelected: {
          inn: inn,
          FirstName: first_name,
          MiddleName: middle_name,
          SurName: last_name,
        }
      });
    }

    if(
      (identifyInfo && !identifyInfo.passport.length)  ||
      (identifyInfo && !identifyInfo.birthday.length) ||
      (identifyInfo && !identifyInfo.address.length) ||
      (identifyInfo && !identifyInfo.inn.length)    
    ) { this.showNoEnoughData(prevProps, prevState) }

    if(errors.getIn(["identifyUser", id]) && errors.getIn(["identifyUser", id]).time !== prevProps.errors.getIn(["identifyUser", id]).time) this.openNotification(errors)
    if(errors.getIn(["croinformRequest", id]) && errors.getIn(["croinformRequest", id]).time !== prevProps.errors.getIn(["croinformRequest", id]).time) this.openNotification(errors)
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

  showNoEnoughData = prevProps => {
    const { item, item: {identifyInfo : response, id, fio} } = this.props
    if(!response) return
    else if (response === prevProps) return
    else if (item.timeRequest === prevProps.item.timeRequest) return

    const errMessage = `Данные ${!response.passport.length ? "паспорта, " : ""}${!response.birthday.length ? 'даты рождения, ' : ""}${!response.address.length ? 'адреса ' : ""} отсутствуют`

    const _showMessage = () => {
      const key = id;
      const errStatus = response.passport.length || response.birthday.length || response.address.length
      const _close = () => console.log( `Notification was closed. Either the close button was clicked or duration time elapsed.`)
      !errStatus && 
      notification['error']({
        key,
        message: `${fio} недостаточно данных для проверки`,
        description: errMessage,
        duration: 4,
        onClose: _close,
      });
    }

    _showMessage()
  }

  openNotification = err => {
    const { item: { id } } = this.props
    const _showMessage = err => {
      const key = err ? err.time : Date.now();
      const _close = () => console.log( `Notification was closed. Either the close button was clicked or duration time elapsed.`)
      notification['error']({
        key,
        message: `Ресурс не отвечает`,
        description: err.message,
        duration: 4,
        onClose: _close,
      });
    }

    if(err.getIn(["identifyUser", id]) && err.getIn(["identifyUser", id]).status) _showMessage(err.getIn(["identifyUser", id]))
    if(err.getIn(["croinformRequest", id]) && err.getIn(["croinformRequest", id]).status) _showMessage(err.getIn(["croinformRequest", id]))
  };

  getCroinformIdentifyRequest = e => {
    e.stopPropagation();
    const { userSelected, parseAddress, user: userState } = this.state;
    const { item, actionGetUserCroinformInfo } = this.props;
    const user = {
      INN: userSelected.inn ? userSelected.inn : item.inn,
      FirstName: userSelected.fio ? parsingFio(userSelected.fio).FirstName : item.first_name, 
      FirstNameArch: userSelected.fio ? parsingFio(userSelected.fio).FirstName : item.first_name,
      MiddleName: userSelected.fio ? parsingFio(userSelected.fio).MiddleName : item.middle_name,
      SurName: userSelected.fio ? parsingFio(userSelected.fio).SurName : item.last_name,
      DateOfBirth: userSelected.birthday, 
      Seria: parsingPassport(userSelected.passport).Seria,
      Number: parsingPassport(userSelected.passport).Number,
      RegionExp: parseAddress.RegionExp, 
      CityExp: parseAddress.CityExp, 
      StreetExp: parseAddress.StreetExp, 
      HouseExp: parseAddress.HouseExp, 
      BuildExp: parseAddress.BuildExp, 
      BuildingExp: parseAddress.BuildingExp, 
      FlatExp: parseAddress.FlatExp,
      DateOfBirthArr: userState.birthday
    }
    actionGetUserCroinformInfo(user, item.id)
  }

  /* Отображение Drawer с данными из Croinform */
  showDrawer = e => {
    e.stopPropagation();
    this.setState({
      showCroinformResponse: new Date()
    });
  };

  onDoubleClickEvent = e => {
    this.toggleEdited()
  }

  /* Рендеринг физического лица */
  renderFoulderFlItem = (item, key, id) => {
    const { Item: DescriptionsItem } = Descriptions;
    const { identifyUser, identifyUserloading, croinformRequestloading, companyName, croinformRes } = this.props;
    const { edited, userSelected, openPanel, user } = this.state;
    const { Panel } = Collapse;

    const BtnExtra = ({ user }) => {
      const { identifyUser, croinformRes, item: propsItem } = this.props;
      const { userSelected, parseAddress, edited } = this.state;
      const croinformDisabled = !userSelected.inn && !userSelected.fio && !userSelected.passport && !parseAddress.RegionExp && !parseAddress.CityExp && !parseAddress.StreetExp &&!parseAddress.HouseExp
      const showBtn = propsItem.hasOwnProperty('identifyInfo')

      const editUserInfo = e => {
        if(openPanel) {
          e.stopPropagation();
        }
        this.toggleEdited();
      };

      const identifyUserInfo = e => {
        if(openPanel) {
          e.stopPropagation();
        }
        identifyUser({
          ...user,
          first_name: userSelected.FirstName ? userSelected.FirstName : user.first_name,
          middle_name: userSelected.MiddleName ? userSelected.MiddleName : user.middle_name,
          last_name: userSelected.SurName ? userSelected.SurName : user.last_name,
          inn: userSelected.inn ? userSelected.inn : user.inn,
        });
        this.setState({edited: true})
      };

      return (
        <span className="heads-search" style={{width: showBtn ? 150 : 120}}>
          <Button
            title="Проверить все"
            size="small"
            style={{color: (croinformDisabled || edited || parseAddress.RegionExp === "") ? "gray" : "#52c41a", marginRight: 5}}
            disabled={croinformDisabled || edited || parseAddress.RegionExp === ""}
            icon={croinformRequestloading ? "loading" : "global"}
            onClick={e => this.getCroinformIdentifyRequest(e)}
          />
          <Badge dot={croinformRes ? true : false} offset={[-6,1]} status={croinformRes ? "success"  : ""} >
            <Button
              title="Показать результаты проверки"
              size="small"
              style={{
                color: ( edited || !showBtn) ? "gray" : "rgba(14, 117, 253, 0.992)", 
                marginRight: 5,
                display: showBtn ? "block" : "none"
              }}
              disabled={edited || !showBtn }
              icon="solution"
              onClick={e => this.showDrawer(e)}
            />
          </Badge>
          <Button
            title="Поиск информации"
            size="small"
            style={{color: "rgba(14, 117, 253, 0.992)", marginRight: 5}}
            // disabled={edited}
            icon={identifyUserloading ? "loading" : "file-search"}
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
        user: { passport, birthday, address },
        userSelected,
        parseAddress: {CityExp, StreetExp, HouseExp, BuildExp, BuildingExp, FlatExp, RegionExpText},
        edited
      } = this.state;
      const descrArr = [];
      const id = "heads";
      for (const key in user) {
        if ( user.hasOwnProperty(key) && key === "passport" ) {
          edited && descrArr.push(
            <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Паспорт" span={1} >
              { this._renderInut(passport, "passport") }
            </DescriptionsItem>
          )
          !edited && (passport !== "" || userSelected.passport) && descrArr.push(
            <DescriptionsItem  key={`${id}-${key}`} id={`${id}-${key}`} label="Паспорт" span={1} >
              <label onDoubleClick={e => this.onDoubleClickEvent(e)}>{ userSelected.passport  ? userSelected.passport : passport.length ? `${passport[0].seria} ${passport[0].number}` : "" }</label>
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
                `${
                  RegionExpText ? RegionExpText.toUpperCase() : ""
                } ${
                  CityExp ? CityExp.toUpperCase(): ""
                } ${
                  StreetExp ? StreetExp.toUpperCase(): ""
                } ${
                  HouseExp ? HouseExp.toUpperCase() : ""
                } ${
                  BuildExp ? BuildExp.toUpperCase() : ""
                } ${
                  BuildingExp ? BuildingExp.toUpperCase() : ""
                } ${
                  FlatExp ? FlatExp.toUpperCase() : ""
                }` : address[0]
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
        header={ edited ? 
          <LeaderEditedHeader 
            user={user}
            userSelected={userSelected}
            item={item}
            identifyUserloading={identifyUserloading}
            companyName={companyName}
            croinformRes={croinformRes}
            onAction = {{
              handleSelectOption: this._handleSelectOption,
              handleChangeInn: this._handleChangeInn,
              handleChangeSurName: this._handleChangeSurName,
              handleChangeMiddleName: this._handleChangeMiddleName,
              handleChangeFirstName: this._handleChangeFirstName,
            }}
          /> :
          <LeaderHeader 
            item={item}
            croinformRes={croinformRes}
            userSelected={userSelected}
            companyName={companyName} 
          />
        }
        extra={<BtnExtra user={item} identifyUser={identifyUser} />}
      >
        <Spin spinning={identifyUserloading || croinformRequestloading ? true : false}>
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
            <div style={{textAlign: "center", cursor: "default", color: "gray"}} >
              <label onDoubleClick={e => this.onDoubleClickEvent(e)}>
                Для ввода информации необходимой для проверки данного субъекта дважды кликните по этому сообщению или по кнопке
              </label>
              <Icon
                size="small"
                style={{
                  color: "rgba(14, 117, 253, 0.992)", 
                  margin: "0 5px",
                  cursor: "default"
                }}
                type={"form"}
                />
              <label onDoubleClick={e => this.onDoubleClickEvent(e)}> 
                на панели редактирования, для идентификации и получения данных для автозаполнения кликните по кнопке
              </label>
              <Icon
                size="small"
                style={{
                  color: "rgba(14, 117, 253, 0.992)", 
                  margin: "0 5px",
                  cursor: "default"
                }}
                type="file-search"
              />
            </div>
          }
        </Spin>
      </Panel>
    );
  };

  // Измененение данных в RenderEditedHeader на onChange
  _handleChangeInn = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, inn: value } }))
  _handleChangeFirstName = ({target: {value}}) => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, FirstName: value } }))
  _handleChangeMiddleName = ({target: {value}}) => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, MiddleName: value } }))
  _handleChangeSurName = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, SurName: value } }))

  // Измененение данных в RenderEditedHeader по onSelect
  _handleSelectOption = (value, option) =>  this.setState(({ userSelected }) => {
    if(option.props.text === "SurName") {
      const FIO = parsingFio(option.props.title)
      return { 
        userSelected: 
        { ...userSelected, 
          FirstName: FIO.FirstName,
          MiddleName: FIO.MiddleName,
          SurName: FIO.SurName,
        } 
      }
    } else {
      return { userSelected: { ...userSelected, inn: value } }
    }
  })

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
    if (p.length) RegionExp = region.filter(item => item.title.toUpperCase().indexOf(p[0].toUpperCase()) !== -1)[0]
    if(!RegionExp) RegionExp = {value: "", title: ""}
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

    const passportMask = str =>  str.replace(/^([0-9]{4})([0-9]{6,10})/g, '$1 $2')

    // Изменение state через onChange
    const handleChangeBirthday = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, birthday: value } }))
    const handleChangePassport = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, passport: value ? passportMask(value) : value } }))
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
      return { userSelected: { ...userSelected, [option.props.text]: value } }
    })

    const handleSelectAddressOption = value =>  this.parsingSelectAddress(value)

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

    if ( keyId === "birthday") {
      return (
        <Badge count={data.length}>
          <AutoComplete
            key={keyId}
            style={{ width: 200 }}
            size="small"
            value={userSelected[keyId]}
            dataSource={user.birthday ? data.map(renderOption) : false}
            onSelect={handleSelectOption}
            onChange={handleChangeBirthday}
            placeholder="Введите дату рождения"
            filterOption={(value, option) =>  option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1}
            allowClear
          />
        </Badge>
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
          { user.address &&
            <Badge count={data.length}>
              <AutoComplete
                key={keyId}
                style={{ width: 200 }}
                size="small"
                dataSource={user.address ? data.map(renderOption) : false}
                onChange={handleSelectAddressOption}
                placeholder="Автозаполнения адреса"
                filterOption={(value, option) =>  option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1}
                allowClear
              />
            </Badge>
          }
        </>
      );
    } else if ( keyId === "passport") {
      return (
        <Badge count={data.length}>
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
        </Badge>
      );
    }
  }

  callback = key => {
    key.length ?  this.setState({ openPanel : true }) : this.setState({ openPanel : false })
  }

  render() {
    const { 
      item, 
      item: { id }, 
      fssploading, 
      searchData, 
      croinformRes, 
      croinformRequestloading, 
      fsspInfo 
    } = this.props;
    const {error, showCroinformResponse, userSelected, parseAddress} = this.state
    if(error) return <div>В компоненте произошла ошибка</div>
    return (
      <>
        <Collapse
          key={item.id}
          className="managment"
          onChange={this.callback}
          bordered={false}
          expandIcon={({ isActive }) => (
            <Icon type={!isActive ? "plus-square" : "minus-square"} />
          )}
        >
          {item.name && this.renderFoulderUlItem(item, id)}
          {item.middle_name && this.renderFoulderFlItem(item, id, searchData)}
        </Collapse>
        <CroinformDrawer 
          user={item}
          userSelected={{...userSelected, ...parseAddress}}
          fsspInfo={fsspInfo}
          fssploading={fssploading}
          loading={croinformRequestloading} 
          toggleDrawer={showCroinformResponse} 
          croinformRes={croinformRes} 
        />
      </>
    );
  }
}

export default ManagmentItem;

ManagmentItem.propTypes = {
  /** Данные о состоянии loaders */
  identifyUser: PropTypes.func.isRequired,
};
