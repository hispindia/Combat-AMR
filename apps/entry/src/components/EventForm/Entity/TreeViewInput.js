import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './treeview.css';
import { Cascader } from 'antd';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hanzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];


export const TreeViewInput = (props) => {

    const [value, setValue] = useState(props.value)

    useEffect(() => {

        if (props.value != value)
            setValue(props.value)
    }, props.value)

    const onChange = event => {
    const value = event.slice(-1)[0]
    setValue(value)
    props.onChange(props.name, value)
    }

  var optionsNew = [];
  var defaultValue = []
  optionsNew.push(props.data)
    if (value) {
      defaultValue.push(value)
    }
    var placeholder = props.placeholder;

    return (
      <Cascader options={optionsNew} onChange={onChange} changeOnSelect
        placeholder={placeholder}
        bordered={true}
        defaultValue={defaultValue}
        disabled={props.disabled}
      />
    );
}
