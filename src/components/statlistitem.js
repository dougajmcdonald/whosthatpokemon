import React from "react";

export default ({ label, value }) => (
  <li className="bg-slate-700 flex flex-row rounded-md text-slate-50 mx-4 mb-1 text-sm">
    <dt className="pl-4 text-left flex-grow">{label}</dt>
    <dd className="pr-4 text-right font-bold">{value}</dd>
  </li>
);
