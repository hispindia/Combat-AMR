import React, { useEffect, useState } from "react";
import TabPane from "./Tab-Pane";

const Tabs = (props) => {
    const { children } = props;
    const [tabHeader, setTabHeader] = useState([]);
    const [childContent, setChildConent] = useState({});
    const [active, setActive] = useState(0);
    
    useEffect(() => {
        const headers = [];
        const childCnt = {};
        React.Children.forEach(children, (element) => {
            if (!React.isValidElement(element)) return;
            var name  = element.props.name;
            var tabvalue = element.props.tabvalue;
            var code = element.props.code;
            headers.push([name,tabvalue,code]);
            childCnt[name] = element.props.children;
        });
        setTabHeader(headers);
        setChildConent({ ...childCnt });
    }, [props, children]);

  const changeTab = (returnValue,index) => {
      children[0].props.onClick(returnValue)
    };
  
  const changeActive = (returnValue,index) => {
    setActive(index);
    }

  return (
    <div className="tabs">
      <ul className="tab-header">
        {tabHeader.map((item,index) => (
          <li
            onClick={() => changeTab(item,index)}
            key={item[1]}
            index={index}
            onMouseDown = {()=> changeActive(item,index)}
            className={index == active ? "active" : ""}
          >
            {item[0]}
          </li>
        ))}
      </ul>
      {/* <div className="tab-content">
        {Object.keys(childContent).map((key) => {
          if (key === active) {
            return <div class="tab-child">{childContent[key]}</div>;
          } else {
            return null;
          }
        })}
      </div> */}
    </div>
  );
};

Tabs.propTypes = {
    children: function (props, propName, componentName) {
    const prop = props[propName];

    let error = null;
        React.Children.forEach(prop, function (child) {
        
      if (child.type !== TabPane) {
        error = new Error(
          "`" + componentName + "` children should be of type `TabPane`."
        );
      }
    });
    return error;
  }
};

export default Tabs;
