import { render } from "react-dom";
import DropdownTreeSelect from "react-dropdown-tree-select";
import './dropdowntree.css';
import React, { useState, useEffect } from 'react'
import { arrayOf, bool, func, shape, string } from 'prop-types'
// import { MinWidth } from './MinWidth'

const onChange = (currentNode, selectedNodes) => {
  console.log("path::", currentNode.path);
};

const assignObjectPaths = (obj, stack) => {
  Object.keys(obj).forEach(k => {
    const node = obj[k];
    if (typeof node === "object") {
      node.path = stack ? `${stack}.${k}` : k;
      assignObjectPaths(node, node.path);
    }
  });
};

export const DropdownTreeSelectInput = props => {
    var data = props.data;
console.log("DATA WE ARE GETTING :",data)
  assignObjectPaths(data);

  return (
    <DropdownTreeSelect data={data} onChange={onChange} className="mdl-demo" />
  );
};

