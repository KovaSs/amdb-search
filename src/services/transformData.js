import * as _ from 'lodash';
import { fieldsArr } from "./fields";

class TransformData {
  _transformAllData = inputData => {
    const Field = (search, title, data) => ({ search, title, data })
    let clgData = {}
    const cloneFieldsArr = _.cloneDeep(fieldsArr);
    const fullOrganistionInfo = cloneFieldsArr.map( item => {      
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
          clgData[el] = new Field(item.search, item.title, newData)
          return _.assign(item, { "data" : newData})
        } else if(item.id === el && item.id === "heads") {
          let newData = _headersTransform(inputData[el])
          clgData[el] = new Field(item.search, item.title, newData)
          return _.assign(item, { "data" : newData})
        } else if(item.id === el ) {
          clgData[el] = new Field(item.search, item.title, inputData[el])
          return _.assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    console.table(clgData)
    return fullOrganistionInfo
  }

  _companySource = inputData => {
    const Field = (search, title, data) => ({ search, title, data })
    let clgData = {}
    const cloneFieldsArr = _.cloneDeep(fieldsArr);
    const fullOrganistionInfo = cloneFieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el ) {
          clgData[el] = new Field(item.search, item.title, inputData[el])
          return _.assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    console.table(clgData)
    return fullOrganistionInfo
  }

  _get_company_info_companySource = (prevData, newData) => {
    const clonePrevData = _.cloneDeep(prevData);
    fieldsArr.map(item => {
      for (const key in newData) {
        if(item.search === key && !item.func) return _.assign(clonePrevData, { [item.id] : newData[item.search]})
        else if(item.search === key && item.func)return _.assign(clonePrevData, { [item.id] : item.func(newData[item.search])})
      }
      return item
    })
    return clonePrevData
  }

  _managementSource = inputData => {
    const Field = (search, title, data) => ({ search, title, data })
    let clgData = {}
    const cloneFieldsArr = _.cloneDeep(fieldsArr);
    const fullOrganistionInfo = cloneFieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el ) {
          clgData[el] = new Field(item.search, item.title, inputData[el])
          return _.assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    console.table(clgData)
    const filteredManagementInfo = fullOrganistionInfo.filter(item => (item.id === "befenicials" || item.id === "founders_fl" || item.id === "founders_ul" || item.id === "heads"  || item.id === "management_companies"))
    return filteredManagementInfo
  }

  _riskSource = inputData => {
    const Risk = (search, title, data) => ({ search, title, data })
    let clgRiskData = {}
    const cloneFieldsArr = _.cloneDeep(fieldsArr);
    const riskOrganistionInfo = cloneFieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el ) {
          clgRiskData[el] = new Risk(item.search, item.title, inputData[el])
          return _.assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    console.table(clgRiskData)
    return riskOrganistionInfo
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
