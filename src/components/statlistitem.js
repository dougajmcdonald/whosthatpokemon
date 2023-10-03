import React from 'react'

const StatListItem = ({ label, value }) => (
  <li className="bg-slate-700 flex flex-row rounded-md text-slate-50 mb-1 text-sm">
    <dt className="pl-4 text-left w-32">{label}</dt>
    <dd className="pr-4 text-right font-bold w-32">{value}</dd>
  </li>
)

export default StatListItem
