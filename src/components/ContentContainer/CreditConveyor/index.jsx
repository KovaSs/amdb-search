import React, { Suspense, lazy } from "react";
const CreditConveyor = lazy(() => import("./CreditConveyor"))

const CreditConveyorContainer = () =>  <Suspense fallback={<div></div>}> <CreditConveyor /> </Suspense>

export default CreditConveyorContainer;


