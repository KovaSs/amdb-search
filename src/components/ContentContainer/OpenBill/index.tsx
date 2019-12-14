import React from "react";
const OpenBill = React.lazy(() => import("./OpenBill"))

const OpenBillContainer: React.FC = props =>  <React.Suspense fallback={<div></div>}> <OpenBill {...props}/> </React.Suspense>

export default OpenBillContainer