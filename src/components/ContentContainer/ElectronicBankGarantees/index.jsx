import React, { Suspense, lazy } from "react";
const TableContainer = lazy(() => import("./TableContainer"))

const ElectronicBankGaranteesContainer = () =>  <Suspense fallback={<div></div>}> <TableContainer /> </Suspense>

export default ElectronicBankGaranteesContainer