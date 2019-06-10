import { 
  actionChangeInn,
  loadCompanyInfo,
  clearCompanyInfo
} from "./creditConveyor/actions"

import { 
  actionChangeOpenBillInn,
  actionChangeOpenBillOgrn,
  loadCompanyOpenBillInfo,
  clearCompanyOpenBillInfo,
  loadingCompanyOpenBillInfo 
} from "./openBill/actions"

import { 
  actionChangeEBGInn,
  loadCompanyEBGInfo,
  clearCompanyEBGInfo,
  loadingCompanyEBGInfo 
} from "./electronicBankGarantees/actions"

import { actionChangeNumberPage } from "./stateApp/actions"


export { 
  actionChangeInn,
  actionChangeNumberPage,
  loadCompanyInfo,
  clearCompanyInfo,
  actionChangeOpenBillInn,
  actionChangeOpenBillOgrn,
  loadCompanyOpenBillInfo,
  clearCompanyOpenBillInfo,
  loadingCompanyOpenBillInfo,
  actionChangeEBGInn,
  loadCompanyEBGInfo,
  clearCompanyEBGInfo,
  loadingCompanyEBGInfo 
}