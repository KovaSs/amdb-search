import React, { Suspense, lazy } from "react";
const EBG = lazy(() => import("./EBG"))

const EBGContainer = props =>  <Suspense fallback={<div></div>}> <EBG {...props}/> </Suspense>

export default EBGContainer