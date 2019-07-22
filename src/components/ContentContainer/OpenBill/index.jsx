import React, { Suspense, lazy } from "react";
const OpenBill = lazy(() => import("./OpenBill"))

const OpenBillContainer = () =>  <Suspense fallback={<div></div>}> <OpenBill /> </Suspense>

export default OpenBillContainer