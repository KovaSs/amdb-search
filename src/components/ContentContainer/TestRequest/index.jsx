import React, { Suspense, lazy } from "react";
const TestRequest = lazy(() => import("./TestRequest"))

const TestRequestContainer = () =>  <Suspense fallback={<div></div>}> <TestRequest /> </Suspense>

export default TestRequestContainer