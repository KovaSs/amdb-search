import { 
  actionChangeInn,
  loadCompanyInfo,
  clearCompanyInfo
} from "./creditConveyor/actions"

import { 
  actionChangeInn as actionChangeOpenBillInn,
  loadCompanyInfo as loadCompanyOpenBillInfo,
  clearCompanyInfo as clearCompanyOpenBillInfo
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
  loadCompanyOpenBillInfo,
  clearCompanyOpenBillInfo,
  actionChangeEBGInn,
  loadCompanyEBGInfo,
  clearCompanyEBGInfo,
  loadingCompanyEBGInfo 
}