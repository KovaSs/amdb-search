import React, { PureComponent } from "react"
import { 
  Collapse, 
  Icon, 
  Spin, 
  Descriptions, 
  AutoComplete, 
  Input, 
  Button, 
  Badge, 
  notification, 
  DatePicker, 
  Select 
} from "antd"
import PropTypes from "prop-types"
import { union, concat, compact } from "lodash"
import LeaderHeader from "../LeaderHeader"
import LeaderEditedHeader from "../LeaderEditedHeader"
import { region, parsingFio, parsingPassport, getDatePickerValue, parsingAddress } from "../../../../../../../services/utils"
import CroinformDrawer from "../../../DrawerContainer/CroinformDrawer"

export class ManagmentItem extends PureComponent {
  state = {
    openDatePicker: false,
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
      birthday: [],
      address: ""
    },
    userSelected: {
      inn: "",
      fio: "",
      Seria: "",
      Number: "",
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
    const { 
      item: { 
        inn, 
        last_name, 
        first_name,  
        middle_name, 
      },
      identifyInfo = { 
        inn: [], 
        fio: [], 
        passport: "", 
        birthday: [], 
        address: ""
      },
      selectedInfo = {
        INN: "",
        FirstName: "", 
        MiddleName: "",
        SurName: "",
        DateOfBirth: "", 
        Seria: "",
        Number: "",
        RegionExp: "", 
        CityExp: "", 
        StreetExp: "", 
        HouseExp: "", 
        BuildExp: "", 
        BuildingExp: "", 
        FlatExp: "",
      }
    } = this.props

    this.setState({
      user: {
        inn: union([inn], identifyInfo.inn).length >= 1  && identifyInfo.inn ?
          union([inn], identifyInfo.inn).filter(item => item !== "Не найден") :
          union([inn], identifyInfo.inn), 
        fio: union( [`${last_name} ${first_name} ${middle_name}`], identifyInfo.fio ), 
        passport: identifyInfo.passport,
        birthday: identifyInfo.birthday,
        address: identifyInfo.address
      },
      userSelected: {
        inn: selectedInfo.INN ? selectedInfo.INN :
          union([inn], identifyInfo.inn).length >= 1 && identifyInfo.inn ?
            union([inn], identifyInfo.inn).filter(item => item !== "Не найден")[0] :
            union([inn], identifyInfo.inn)[0],
        FirstName: selectedInfo.FirstName ? selectedInfo.FirstName : first_name,
        MiddleName: selectedInfo.MiddleName ? selectedInfo.MiddleName : middle_name,
        SurName: selectedInfo.SurName ? selectedInfo.SurName : last_name,
        Seria: selectedInfo.Seria ? selectedInfo.Seria : "",
        Number: selectedInfo.Number ? selectedInfo.Number : "",
        passport: selectedInfo.Seria && selectedInfo.Number ? `${selectedInfo.Seria} ${selectedInfo.Number}` : "",
        birthday: selectedInfo.DateOfBirth ? selectedInfo.DateOfBirth : "",
      },
      parseAddress: {
        CityExp: selectedInfo.CityExp ? selectedInfo.CityExp : "",
        StreetExp: selectedInfo.StreetExp ? selectedInfo.StreetExp : "",
        HouseExp: selectedInfo.HouseExp ? selectedInfo.HouseExp : "",
        BuildExp: selectedInfo.BuildExp ? selectedInfo.BuildExp : "", 
        BuildingExp: selectedInfo.BuildingExp ? selectedInfo.BuildingExp : "",
        FlatExp: selectedInfo.FlatExp ? selectedInfo.FlatExp : "", 
        RegionExp: selectedInfo.RegionExp ? selectedInfo.RegionExp : "",
        RegionExpText: selectedInfo.RegionExp ? region.filter(region => region.value === selectedInfo.RegionExp)[0].title : ""
      },
    });
  }

  /* Обновление данных state при идентификации физического лица */
  componentDidUpdate(prevProps) {
    const { 
      item: { 
        id, 
        inn, 
        last_name, 
        first_name,  
        middle_name,
      },
      identifyInfo,
      selectedInfo,
      errors
    } = this.props;
    if (identifyInfo && identifyInfo !== prevProps.identifyInfo) {
      this.setState({
        user: {
          inn: union([inn], identifyInfo.inn).length >= 1 && identifyInfo.inn ?
            union([inn], identifyInfo.inn).filter(item => item !== "Не найден") :
            union([inn], identifyInfo.inn), 
          fio: union( [`${last_name} ${first_name} ${middle_name}`], identifyInfo.fio ), 
          passport: identifyInfo.passport,
          birthday: identifyInfo.birthday,
          address: identifyInfo.address
        }
      });
    }

    if(selectedInfo && selectedInfo !== prevProps.selectedInfo) {
      this.setState({
        userSelected: {
          inn: selectedInfo.INN,
          FirstName: selectedInfo.FirstName ? selectedInfo.FirstName : first_name,
          MiddleName: selectedInfo.MiddleName ? selectedInfo.MiddleName : middle_name,
          SurName: selectedInfo.SurName ? selectedInfo.SurName : last_name,
          Seria: selectedInfo.Seria ? selectedInfo.Seria : "",
          Number: selectedInfo.Number ? selectedInfo.Number : "",
          passport: selectedInfo.Seria && selectedInfo.Number ? `${selectedInfo.Seria} ${selectedInfo.Number}` : "",
          birthday: selectedInfo.DateOfBirth ? selectedInfo.DateOfBirth : "",
        },
        parseAddress: {
          CityExp: selectedInfo.CityExp ? selectedInfo.CityExp : "",
          StreetExp: selectedInfo.StreetExp ? selectedInfo.StreetExp : "",
          HouseExp: selectedInfo.HouseExp ? selectedInfo.HouseExp : "",
          BuildExp: selectedInfo.BuildExp ? selectedInfo.BuildExp : "", 
          BuildingExp: selectedInfo.BuildingExp ? selectedInfo.BuildingExp : "",
          FlatExp: selectedInfo.FlatExp ? selectedInfo.FlatExp : "", 
          RegionExp: selectedInfo.RegionExp ? selectedInfo.RegionExp : "",
          RegionExpText: selectedInfo.RegionExp ? region.filter(region => region.value === selectedInfo.RegionExp)[0].title : ""
        },
      })
    }

    if(
      (identifyInfo && !identifyInfo.passport.length)  ||
      (identifyInfo && !identifyInfo.birthday.length) ||
      (identifyInfo && !identifyInfo.address.length) ||
      (identifyInfo && !identifyInfo.inn.length)    
    ) { this.showNoEnoughData(prevProps) }

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
    const {
      timeRequest,
      item: {identifyInfo : response, id, fio}, 
    } = this.props
    if(!response) return
    else if (response === prevProps) return
    else if (timeRequest === prevProps.timeRequest) return

    const errMessage = `Данные ${!response.passport.length ? "паспорта, " : ""}${!response.birthday.length ? 'даты рождения, ' : ""}${!response.address.length ? 'адреса ' : ""} отсутствуют`

    const showMessage = () => {
      const key = id;
      const errStatus = !response.passport.length || !response.birthday.length || !response.address.length
      const _close = () => console.log( `Notification was closed. Either the close button was clicked or duration time elapsed.`)
      errStatus && 
      notification.warning({
        key,
        message: `${fio} недостаточно данных для проверки`,
        description: errMessage,
        duration: 4,
        onClose: _close,
      });
    }

    showMessage()
  }

  openNotification = err => {
    const { item: { id } } = this.props
    const _showMessage = err => {
      const key = err ? err.time : Date.now();
      const _close = () => console.log( `Notification was closed. Either the close button was clicked or duration time elapsed.`)
      notification.error({
        key,
        message: `Нет ответа от ресурса`,
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
      INN: userSelected.inn ? 
        (userSelected.inn !== "Не найден" ? userSelected.inn : "") : 
        (item.inn !== "Не найден" ? item.inn : ""),
      FirstName: userSelected.FirstName ? userSelected.FirstName : item.first_name, 
      FirstNameArch: userSelected.FirstName ? userSelected.FirstName : item.first_name,
      MiddleName: userSelected.MiddleName ? 
        userSelected.MiddleName !== " " ? userSelected.MiddleName : "" 
        : item.middle_name !== " " ? item.middle_name : "",
      SurName: userSelected.SurName ? userSelected.SurName : item.last_name,
      DateOfBirth: userSelected.birthday,
      Seria: userSelected.Seria,
      Number: userSelected.Number,
      RegionExp: parseAddress.RegionExp,
      CityExp: parseAddress.CityExp,
      StreetExp: parseAddress.StreetExp,
      HouseExp: parseAddress.HouseExp,
      BuildExp: parseAddress.BuildExp,
      BuildingExp: parseAddress.BuildingExp,
      FlatExp: parseAddress.FlatExp,
      INNArr: Array.isArray(userState.inn) && userState.inn.filter(item => item === userSelected.inn).length ? 
          userState.inn : compact(concat(userState.inn, userSelected.inn)),
      DateOfBirthArr: Array.isArray(userState.birthday) && userState.birthday.filter(item => item === userSelected.birthday).length ? 
        userState.birthday : compact(concat(userState.birthday, userSelected.birthday))
    }
    console.log('INNArr',  userState.inn, userSelected.inn, user)
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
    const { 
      identifyUser, 
      identifyUserloading, 
      croinformRequestloading, 
      companyName,
      identifyInfo,
      croinformInfo: croinformRes,
      updateUserSelectedInfo,
      fsspInfo,
      stopLists,
      digets
    } = this.props
    const { edited, userSelected, openPanel, user } = this.state;
    const { Panel } = Collapse;

    const BtnExtra = ({ user }) => {
      const { userSelected, parseAddress, edited } = this.state;
      const croinformDisabled = !userSelected.inn && !userSelected.fio && !userSelected.passport && !parseAddress.RegionExp && !parseAddress.CityExp && !parseAddress.StreetExp &&!parseAddress.HouseExp
      const showBtn = identifyInfo || croinformRes || digets

      const editUserInfo = e => {
        if(openPanel) {
          e.stopPropagation();
        }
        if(edited) {
          updateUserSelectedInfo({
            user: {
              INN: userSelected.inn ? 
                userSelected.inn !== "Не найден" ? userSelected.inn : "" 
                : user.inn !== "Не найден" ? user.inn : "",
              FirstName: userSelected.FirstName ? userSelected.FirstName : item.first_name, 
              SurName: userSelected.SurName ? userSelected.SurName : item.last_name,
              MiddleName: userSelected.MiddleName ? 
                userSelected.MiddleName !== " " ? userSelected.MiddleName : "" 
                : item.middle_name !== " " ? item.middle_name : "",
              DateOfBirth: userSelected.birthday, 
              Seria: userSelected.Seria,
              Number: userSelected.Number,
              RegionExp: parseAddress.RegionExp, 
              CityExp: parseAddress.CityExp,
              StreetExp: parseAddress.StreetExp, 
              HouseExp: parseAddress.HouseExp, 
              BuildExp: parseAddress.BuildExp, 
              BuildingExp: parseAddress.BuildingExp, 
              FlatExp: parseAddress.FlatExp,
              ogrn: user.organisation.ogrn ? user.organisation.ogrn : "",
            },
            id: user.id
          })
        }
        this.toggleEdited();
      };

      const identifyUserInfo = e => {
        if(openPanel) {
          e.stopPropagation();
        }
        identifyUser({
          user: {
            INN: userSelected.inn ? 
              userSelected.inn !== "Не найден" ? userSelected.inn : "" 
              : user.inn !== "Не найден" ? user.inn : "",
            FirstName: userSelected.FirstName ? userSelected.FirstName : item.first_name, 
            SurName: userSelected.SurName ? userSelected.SurName : item.last_name,
            MiddleName: userSelected.MiddleName ? 
              userSelected.MiddleName !== " " ? userSelected.MiddleName : "" 
              : item.middle_name !== " " ? item.middle_name : "",
            DateOfBirth: userSelected.birthday, 
            Seria: userSelected.Seria,
            Number: userSelected.Number,
            RegionExp: parseAddress.RegionExp, 
            CityExp: parseAddress.CityExp,
            StreetExp: parseAddress.StreetExp, 
            HouseExp: parseAddress.HouseExp, 
            BuildExp: parseAddress.BuildExp, 
            BuildingExp: parseAddress.BuildingExp, 
            FlatExp: parseAddress.FlatExp,
            ogrn: user.organisation.ogrn ? user.organisation.ogrn : "",
          },
          id: user.id
        });
        this.setState({edited: true})
      };

      return (
        <span className="heads-search-panel" style={{width: showBtn ? 158 : 120}}>
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
                color: ( edited || !showBtn) ? "gray" : croinformRes ? "#52c41a" : "rgba(14, 117, 253, 0.992)", 
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
            icon={identifyUserloading ? "loading" : "user"}
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
        userSelected: {
          CityExp: selCityExp, 
          StreetExp: selStreetExp, 
          HouseExp: selHouseExp, 
          BuildExp: selBuildExp, 
          BuildingExp: selBuildingExp, 
          FlatExp: selFlatExp, 
          RegionExpText: selRegionExpText
        },
        parseAddress: {CityExp, StreetExp, HouseExp, BuildExp, BuildingExp, FlatExp, RegionExpText},
        edited
      } = this.state;
      const { item : { selectedInfo } } = this.props
      const descrArr = [];
      const id = "heads";
      for (const key in user) {
        if ( user.hasOwnProperty(key) && key === "passport" ) {
          if(edited) {
            descrArr.push(
              <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Паспорт" span={1} >
                { this._renderInut(passport, "passport") }
              </DescriptionsItem>
            )
          } else if( selectedInfo && selectedInfo.Seria && selectedInfo.Number ) {
            /** Рендеринг данных паспорта из сохраненных данных */
            descrArr.push(
              <DescriptionsItem  key={`${id}-${key}`} id={`${id}-${key}`} label="Паспорт" span={1} >
                <label onDoubleClick={e => this.onDoubleClickEvent(e)}>
                  { `${selectedInfo.Seria} ${selectedInfo.Number}` }
                </label>
              </DescriptionsItem>
            )
          } else if( userSelected.Seria && userSelected.Number ) {
            /** Рендеринг данных паспорта из выбранных данных */
            descrArr.push(
              <DescriptionsItem  key={`${id}-${key}`} id={`${id}-${key}`} label="Паспорт" span={1} >
                <label onDoubleClick={e => this.onDoubleClickEvent(e)}>
                  { `${userSelected.Seria} ${userSelected.Number}` }
                </label>
              </DescriptionsItem> 
            ) 
          } else if(passport !== "") {
            /** Рендеринг данных паспорта из пришедших данных с сервера */
            descrArr.push(
              <DescriptionsItem  key={`${id}-${key}`} id={`${id}-${key}`} label="Паспорт" span={1} >
                <label onDoubleClick={e => this.onDoubleClickEvent(e)}>
                  {  passport.length ? `${passport[0].seria} ${passport[0].number}` : "" }
                </label>
              </DescriptionsItem> 
            )
          }
        } else if ( user.hasOwnProperty(key) && key === "birthday" ) {
          if(edited) {
            descrArr.push(
              <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Дата рождения" span={1} >
                { this._renderInut(birthday, "birthday") }
              </DescriptionsItem>
            )
          } else if ( selectedInfo && selectedInfo.birthday ) {
            /** Рендеринг данных даты рождения из сохраненных данных */
            descrArr.push(
              <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Дата рождения" span={1} >
                <label onDoubleClick={e => this.onDoubleClickEvent(e)}>{ selectedInfo.birthday }</label>
              </DescriptionsItem>
            )
          } else if (userSelected.birthday) {
            /** Рендеринг данных даты рождения из выбранных данных */
            descrArr.push(
              <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Дата рождения" span={1} >
                <label onDoubleClick={e => this.onDoubleClickEvent(e)}>{ userSelected.birthday }</label>
              </DescriptionsItem>
            )
          } else if (birthday !== "") {
            /** Рендеринг данных даты рождения из пришедших данных с сервера */
            descrArr.push(
              <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Дата рождения" span={1} >
                <label onDoubleClick={e => this.onDoubleClickEvent(e)}>{ birthday[0] }</label>
              </DescriptionsItem>
            )
          }
        } else if ( user.hasOwnProperty(key) && key === "address" ) {
          if(edited) {
            descrArr.push(
              <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Адрес" span={1} >
                { this._renderInut(address, "address") }
              </DescriptionsItem>
            );
          } else if (selCityExp || selStreetExp || selHouseExp || selBuildExp || selBuildingExp || selFlatExp || selRegionExpText) {
            descrArr.push(
              <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Адрес" span={1} >
                <label onDoubleClick={e => this.onDoubleClickEvent(e)}>{ 
                  `${ 
                    selRegionExpText ? selRegionExpText.toUpperCase() : "" } ${
                    selCityExp ? selCityExp.toUpperCase(): "" } ${
                    selStreetExp ? selStreetExp.toUpperCase(): "" } ${
                    selHouseExp ? selHouseExp.toUpperCase() : "" } ${
                    selBuildExp ? selBuildExp.toUpperCase() : "" } ${
                    selBuildingExp ? selBuildingExp.toUpperCase() : "" } ${
                    selFlatExp ? selFlatExp.toUpperCase() : "" }`
                }</label>
              </DescriptionsItem>
            );
          } else if (CityExp || StreetExp || HouseExp || BuildExp || BuildingExp || FlatExp || RegionExpText) {
            descrArr.push(
              <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Адрес" span={1} >
                <label onDoubleClick={e => this.onDoubleClickEvent(e)}>{ 
                  `${ 
                    RegionExpText ? RegionExpText.toUpperCase() : "" } ${
                    CityExp ? CityExp.toUpperCase(): "" } ${
                    StreetExp ? StreetExp.toUpperCase(): "" } ${
                    HouseExp ? HouseExp.toUpperCase() : "" } ${
                    BuildExp ? BuildExp.toUpperCase() : "" } ${
                    BuildingExp ? BuildingExp.toUpperCase() : "" } ${
                    FlatExp ? FlatExp.toUpperCase() : "" }`
                }</label>
              </DescriptionsItem>
            );
          } else if (address !== "") {
            descrArr.push(
              <DescriptionsItem key={`${id}-${key}`} id={`${id}-${key}`} label="Адрес" span={1} >
                <label onDoubleClick={e => this.onDoubleClickEvent(e)}> address[0] </label>
              </DescriptionsItem>
            );
          }
        }
      }
      return descrArr
    }

    return (
      <Panel
        key={String(key)}
        header={ edited ? 
          <LeaderEditedHeader 
            key={item.id}
            keyId={item.id}
            user={user}
            userSelected={userSelected}
            item={item}
            fssp={fsspInfo}
            digets={digets}
            stopLists={stopLists}
            identifyUserloading={identifyUserloading}
            companyName={companyName}
            croinformRes={croinformRes}
            onAction = {{
              handleSelectOption: this._handleSelectOption,
              handleChangeInn: this._handleChangeInn,
              handleChangeSurName: this._handleChangeSurName,
              handleChangeMiddleName: this._handleChangeMiddleName,
              handleChangeFirstName: this._handleChangeFirstName,
              showDrawer: this.showDrawer
            }}
          /> :
          <LeaderHeader
            key={item.id}
            keyId={item.id}
            item={item}
            digets={digets}
            stopLists={stopLists}
            companyName={companyName}
            fssp={fsspInfo}
            croinformRes={croinformRes}
            userSelected={userSelected}
            onAction = {{
              showDrawer: this.showDrawer
            }}
          />
        }
        extra={<BtnExtra user={item} identifyUser={identifyUser} />}
      >
        <Spin spinning={identifyUserloading || croinformRequestloading ? true : false}>
          { ( item.identifyInfo || edited || ( (userSelected.Seria && userSelected.Number) || userSelected.birthday )) ? 
            <Descriptions
              size="small"
              bordered
              border
              column={{ md: 3, sm: 2, xs: 1 }}
            >
              {renderDescriptionItems()}
            </Descriptions> : 
            <div style={{textAlign: "center", cursor: "default", color: "#5a5a5a"}} >
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

    const parsed = parsingAddress(address)

    this.setState(({parseAddress}) => ({
      parseAddress: {
        CityExp: parsed.CityExp, // Нас. пункт
        StreetExp: parsed.StreetExp, // Улица
        HouseExp: parsed.HouseExp, // Номер дома
        BuildExp: parsed.BuildExp, // Корп
        BuildingExp: parsed.BuildingExp, // Стр
        FlatExp: parsed.FlatExp, // Квар
        RegionExp: parsed.RegionExp, // Регион
        RegionExpText: parsed.RegionExpText// Регион
      }
    })) 
  }

  /* Рендеринг редактируемых инпутов  */
  _renderInut = (data, keyId) => {
    const { Option } = AutoComplete;
    const { user, userSelected, parseAddress } = this.state

    // Изменение state через onChange
    const handleChangeBirthday = (dateObj, dateStr) => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, birthday: dateStr } }))
    // Изменение распарсенного адреса
    const handleChangeAddressRegionExp = value =>  this.setState(({ parseAddress }) => ( { parseAddress: { ...parseAddress, RegionExpText: value } }))
    const handleChangeAddressCityExp = ({target: {value}}) => this.setState(({ parseAddress }) => ({ parseAddress: { ...parseAddress, CityExp: value} }))
    const handleChangeAddressStreetExp = ({target: {value}}) => this.setState(({ parseAddress }) => ({ parseAddress: { ...parseAddress, StreetExp: value} }))
    const handleChangeAddressHouseExp = ({target: {value}}) => this.setState(({ parseAddress }) => ({ parseAddress: { ...parseAddress, HouseExp: value} }))
    const handleChangeAddressBuildExp = ({target: {value}}) => this.setState(({ parseAddress }) => ({ parseAddress: { ...parseAddress, BuildExp: value} })) 
    const handleChangeAddressBuildingExp = ({target: {value}}) => this.setState(({ parseAddress }) => ({ parseAddress: { ...parseAddress, BuildingExp: value} }))
    const handleChangeAddressFlatExp = ({target: {value}}) => this.setState(({ parseAddress }) => ({ parseAddress: { ...parseAddress, FlatExp: value} }))
    // Изменение данных паспорта
    const handleChangeSeriaPassport = ({target: {value}}) => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, Seria: value } }))
    const handleChangeNumberPassport = (value, option) => {
      if (!value) return this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, Number: "", Seria: "" } }))
      else if(option.props.title)  return this.setState(({ userSelected }) => 
        ({ userSelected: { ...userSelected, Seria: parsingPassport(option.props.title).Seria, Number: value } }))
      else return this.setState(({ userSelected }) => 
        ({ userSelected: { ...userSelected, Number: parsingPassport(value).Number } }))
    }
    const filterSeriaPassport = (value, option) => option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1
    // Изменение state через onSelect
    const handleSelectPassportOption = (value, option) => {
      if (!value) return this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, Seria: "", Number: "" } }))
      return this.setState(({ userSelected }) => 
        ({ userSelected: { ...userSelected, Seria: parsingPassport(value).Seria, Number: parsingPassport(value).Number } }))
    }

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
    const renderPassportOption = passport => (
      <Option key={`${passport.seria} ${passport.number}`} text={keyId} value={`${passport.seria} ${passport.number}`} title={`${passport.seria} ${passport.number}`}>
        {`${passport.seria} ${passport.number}`}
      </Option>
    )
    // Рендеринг опций выпадающего меню
    const renderRegionOption = item => {
      return (
        <Option key={item.value} text="RegionExpText" title={item.title} value={item.title}>
          {item.title}
        </Option>
      );
    };

    if ( keyId === "birthday") {
      const { openDatePicker } = this.state
      const openStatus = status => this.setState({openDatePicker: status})
      const renderFooter = () => {
        const { user : {birthday = []} } = this.state
        if( !birthday.length ) return
        const { Option } = Select
        const handleSelectChange = value => this.setState(({ userSelected }) => ({ userSelected: { ...userSelected, birthday: value }, openDatePicker: false}))
        const dateOption = date => <Option key={date} value={date}>{date}</Option>
        return (
          <div style={{textAlign: "center"}}>
            <label style={{marginRight: 10}}>Дата: </label>
            <Badge count={data.length}>
              <Select 
                size="small" 
                style={{width: 150}}
                placeholder="Выберите дату"
                onChange={handleSelectChange} 
              >
                {birthday.map(dateOption)}
              </Select>
            </Badge>
          </div>
        )
      }

      return (
        <Badge count={data.length}>
          <DatePicker
            open={openDatePicker}
            key={keyId}
            placeholder="Дата рождения"
            size="small"
            format="DD.MM.YYYY"
            showToday={false}
            style={{ width: 200 }}
            value={userSelected["birthday"] ? getDatePickerValue(userSelected["birthday"]) : null}
            onOpenChange={openStatus}
            onChange={handleChangeBirthday}
            renderExtraFooter={renderFooter}
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
          { user.address.length ?
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
            </Badge> : null
          }
        </>
      );
    } else if ( keyId === "passport") {
      return (
        <div style={{ minWidth: 250, display: "inline-block" }} >
          <Input
            size="small"
            placeholder="Серия"
            style={{ width: 100 }} 
            onChange={handleChangeSeriaPassport}
            value={userSelected["Seria"]}
          />
          <Badge count={data.length}>
            <AutoComplete
              key={keyId}
              style={{ width: 150 }}
              size="small"
              value={userSelected.Number}
              dataSource={user.passport ? data.map(renderPassportOption) : false}
              placeholder="Номер"
              onSelect={handleSelectPassportOption}
              onChange={handleChangeNumberPassport}
              filterOption={filterSeriaPassport}
              allowClear
            />
          </Badge>
        </div>
      );
    }
  }

  callback = key => {
    key.length ?  this.setState({ openPanel : true }) : this.setState({ openPanel : false })
  }

  render() {
    const { 
      item,
      croinformInfo,
      fsspInfo,
      // digets,
      // risks,
      stopLists,
      fssploading, 
      searchData,
      identifyInfo,
      downloadReport,
      croinformRequestloading,
    } = this.props
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
          {item.name && this.renderFoulderUlItem(item, item.id)}
          {item.middle_name && this.renderFoulderFlItem(item, item.id, searchData)}
        </Collapse>
        <CroinformDrawer 
          user={item}
          identifyInfo={identifyInfo}
          userSelected={{...userSelected, ...parseAddress}}
          fsspInfo={fsspInfo}
          stopLists={stopLists}
          fssploading={fssploading}
          loading={croinformRequestloading} 
          toggleDrawer={showCroinformResponse} 
          croinformRes={croinformInfo}  
          downloadReport={downloadReport}
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
