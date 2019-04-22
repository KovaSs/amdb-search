import React, { Component } from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
import TabsContainer from "./TabsContainer";
import SearchCompanyInput from "./SearchCompanyInput";
import "./сredit-сonveyor.scss"

//key render item
import idGenerator from 'react-id-generator';
const data = [
  { title: 'Иванов', age: 25, id: 'id1' },
  { title: 'Петров', age: 34, id: 'id2' },
  { title: 'Сидоров', age: 23, id: 'id3' },
  { title: 'Лебедев', age: 14, id: 'id4' },
  { title: 'Мокин', age: 6, id: 'id5' },
  { title: 'Исаев', age: 23, id: 'id6' },
  { title: 'Ванюшин', age: 83, id: 'id7' },
]

class AddTable extends Component {
  state = {
    people : data
  };

  sort = field => {
    const { people } = this.state
    // debugger;
    // let field = 'title';
    for (let i = 0; i < people.length; i ++){
      for (let j = i + 1; j < people.length; j ++){
        if (people[j][field] > people[i][field]){

          let tmp = people[i];
          people[i] = people[j];
          people[j] = tmp;
        }
      }
    }

    this.setState ({people})
    //people.sort((a,b) => a.title - b.title)
  }

  addNewPeople = () => {
    const {people} = this.state
    // console.log('people', people)
    people.push({
      title: 'Семенов', 
      age: 33,
      id: idGenerator('id-')
    })
    console.log('people', people)
    this.setState( {
      people
    })
  }

  render() {
    const {people} = this.state
    const addLinks = people.map(el => {
      return (
        <div key = {el.id}>
          <span
            onClick={e => this.sort(e.target.id)}
            id="title"
          > 
            {`${el.title}   `}
          </span>
          <span
            onClick={e => this.sort(e.target.id)}
            id="age"
          > 
            {el.age}
          </span>
          <br/>
        </div>
      )
    })
    return (
      <div>
        {addLinks}
        <button onClick={this.addNewPeople}>Добавить</button>
      </div>
    )
  }
}

export { AddTable }



class CreditConveyor extends Component {
  state = {
    showTabs : false,
    loading : false
  }  

  componentWillReceiveProps(nextProps) {
    const { companyResponse } = this.props
    if(nextProps.searchLoading === true) {
      this.setState({
        loading: true
      })
    } else {
      this.setState({
        loading: false
      })
    }
    if(nextProps.companyResponse !== companyResponse) {
      this.setState({
        showTabs: true
      })
    }
  }

  render() {
    const { showTabs, loading } = this.state

    return (
      <div className="credit-conveyor">
        <SearchCompanyInput />
        { showTabs ?
          <TabsContainer /> : 
          <div className="search-result-table">
            { loading ?
              <Spin size="large" /> :
              <div>Для поиска информации об организации введите ИНН или ОГРН в поисковую строку</div>
            }
          </div>
        }
      </div>
    );
  }
}

const putStateToProps = state => {
  const {creditConveyor : { companyResponse, searchLoading }} = state
  return {
    companyResponse,
    searchLoading
  }
}

export default connect(putStateToProps)(CreditConveyor);
