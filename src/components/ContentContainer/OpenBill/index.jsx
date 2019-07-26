import React, { Suspense, lazy } from "react";
const OpenBill = lazy(() => import("./OpenBill"))

const OpenBillContainer = props =>  <Suspense fallback={<div></div>}> <OpenBill {...props}/> </Suspense>

export default OpenBillContainer