import React, { Suspense, lazy } from "react";
const StopListSearch = lazy(() => import("./StopListSearch"))

const StopListSearchContainer = props =>  <Suspense fallback={<div></div>}> <StopListSearch {...props}/> </Suspense>

export default StopListSearchContainer