import * as _ from 'lodash';
import { fieldsArr } from "./fields";

class TransformData {
  _transformAllData = inputData => {
    const Field = (title, data) => ({ title, data })
    let clgData = {}
    const fullOrganistionInfo = fieldsArr.map( item => {      
      const _arbiterTransform = item => {
        return item = [{
          key: '1',
          name: 'Истец',
          year: item.istec.year,
          year3: item.istec.year3,
        }, {
          key: '2',
          name: 'Ответчик',
          year: item.otvet.year,
          year3: item.otvet.year,
        }]
      };
  
      const _headersTransform = item => {
        let i=0, newArr =[]
        item.map( elem => {
          newArr.push({
            key: i,
            fio: `${elem.sur_name} ${elem.first_name} ${elem.last_name}`,
            inn: elem.inn,
          })
          i++
          return newArr
        })
        return newArr
      };
  
      for (const el in inputData) {
        if(item.id === el && item.id === "arbiter") {
          let newData = _arbiterTransform(inputData[el])
          clgData[el] = new Field(item.title, newData)
          return _.assign(item, { "data" : newData})
        } else if(item.id === el && item.id === "heads") {
          let newData = _headersTransform(inputData[el])
          clgData[el] = new Field(item.title, newData)
          return _.assign(item, { "data" : newData})
        } else if(item.id === el ) {
          clgData[el] = new Field(item.title, inputData[el])
          return _.assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    console.table(clgData)
    return fullOrganistionInfo
  }

  _companySource = inputData => {
    const Field = (title, data) => ({ title, data })
    let clgData = {}
    const fullOrganistionInfo = fieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el ) {
          clgData[el] = new Field(item.title, inputData[el])
          return _.assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    console.table(clgData)
    return fullOrganistionInfo
  }

  _managementSource = inputData => {
    const Field = (title, data) => ({ title, data })
    let clgData = {}
    const fullOrganistionInfo = fieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el ) {
          clgData[el] = new Field(item.title, inputData[el])
          return _.assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    console.table(clgData)
    return fullOrganistionInfo
  }



  _headersTransform = item => {
    let i=0, newArr =[]
    item.map( elem => {
      newArr.push({
        key: i,
        fio: `${elem.sur_name} ${elem.first_name} ${elem.last_name}`,
        inn: elem.inn,
      })
      i++
      return newArr
    })
    return newArr
  };

  _arbiterTransform = item => {
    return item = [{
      key: '1',
      name: 'Истец',
      year: item.istec.year,
      year3: item.istec.year3,
    }, {
      key: '2',
      name: 'Ответчик',
      year: item.otvet.year,
      year3: item.otvet.year,
    }]
  };
}

export const trasform = new TransformData();
export default TransformData;
