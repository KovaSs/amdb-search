import React, { Suspense, lazy } from "react";
const ElectronicBankGarantees = lazy(() => import("./ElectronicBankGarantees"))

const ElectronicBankGaranteesContainer = () =>  <Suspense fallback={<div></div>}> <ElectronicBankGarantees /> </Suspense>

export default ElectronicBankGaranteesContainer