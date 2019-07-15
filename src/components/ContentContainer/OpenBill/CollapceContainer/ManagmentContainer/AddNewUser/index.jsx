import React, {Component} from 'react'
import { Collapse, Icon, Descriptions, Button, Input} from "antd"
import { getDate } from "../../../../../../services/utils";

class AddNewUser extends Component {
  state = {
    error: false,
    user: {
      inn: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      position: "",
      organisation: ""
    }
  };

  componentDidCatch(err) {
    console.log('err', err)
    return this.setState({
      error: true
    })
  }

  renderFoulderFlItem = () => {
    const { Item: DescriptionsItem } = Descriptions;
    const { onSave, addUser} = this.props
    const { user } = this.state
    const { Panel } = Collapse;
    const id = "add-new-descr-items";
    const key = "add-user";

    const BtnExtra = ({user}) => {
      const isUserTrue = user.first_name && user.inn && user.first_name && user.last_name && user.middle_name && user.position && user.organisation
      const addUserInCheckList = e => {
        e.stopPropagation();
        addUser({...user, ActualDate: getDate(Date.now())})
        onSave(false)
      };

      return (
        <span className="heads-search" style={{width: 48}}>
          <Button
            size="small"
            title="Добавить в проверку"
            icon="usergroup-add"
            style={{color: isUserTrue ? "#52c41a" : "gray", marginRight: 5}}
            onClick={e => addUserInCheckList(e)}
            disabled={!isUserTrue}
          />
        </span>
      );
    };

    const handleChangeInn = e => { const value = e.target.value; return this.setState(({ user }) => ({user: { ...user, inn: value}})) }
    const handleChangeLastName = e => { const value = e.target.value; return this.setState(({ user }) => ({user: { ...user, last_name: value}})) }
    const handleChangeFirstName = e => { const value = e.target.value; return this.setState(({ user }) => ({user: { ...user, first_name: value}})) }
    const handleChangeMiddletName = e => { const value = e.target.value; return this.setState(({ user }) => ({user: { ...user, middle_name: value}})) }
    const handleChangePosition = e => { const value = e.target.value; return this.setState(({ user }) => ({user: { ...user, position: value}})) }
    const handleChangeOrganisation = e => { const value = e.target.value; return this.setState(({ user }) => ({user: { ...user, organisation: value}})) }

    return (
      <Panel
        key={"1"}
        header="Добавление нового объекта проверки"
        extra={<BtnExtra user={user}/>}
      >
        <Descriptions
          className="description-border"
          size="small"
          bordered
          border
          column={{ md: 4, sm: 2, xs: 1 }}
        >
          <DescriptionsItem key={`${id}-${key}-1`} id={`${id}-${key}`} label="ФИО" span={1} >
            <>
              <Input onChange={handleChangeLastName} placeholder="Фамилия" style={{ width: 150 }} size="small"/>
              <Input onChange={handleChangeFirstName} placeholder="Имя" style={{ width: 150 }} size="small"/>
              <Input onChange={handleChangeMiddletName} placeholder="Отчество" style={{ width: 150 }} size="small"/>
            </>
          </DescriptionsItem>
          <DescriptionsItem  key={`${id}-${key}-2`} id={`${id}-${key}`} label="ИНН" span={1} >
            <Input onChange={handleChangeInn} placeholder="ИНН" style={{ width: 200 }} size="small"/>
          </DescriptionsItem>
          <DescriptionsItem key={`${id}-${key}-3`} id={`${id}-${key}`} label="Должность" span={1} >
            <Input onChange={handleChangePosition} placeholder="Должность" style={{ width: 200 }} size="small"/>
          </DescriptionsItem>
          <DescriptionsItem key={`${id}-${key}-4`} id={`${id}-${key}`} label="Организация" span={1} >
            <Input onChange={handleChangeOrganisation} placeholder="Название ограцизации" style={{ width: 200 }} size="small"/>
          </DescriptionsItem>
        </Descriptions>
      </Panel>
    );
  };

  render() {
    const { error } = this.state

    if(error) return <div>В компоненте AddNew User произошла ошибка</div>
    return (
      <Collapse
        key="add-new-user"
        className="managment"
        defaultActiveKey={["1"]}
        bordered={false}
        expandIcon={({ isActive }) => (
          <Icon type={!isActive ? "plus-square" : "minus-square"} />
        )}
      >
        { this.renderFoulderFlItem()}
      </Collapse>
    );
  }
}

export default AddNewUser
