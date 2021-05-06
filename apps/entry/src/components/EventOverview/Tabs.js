import React, { useEffect, useState } from "react";
import TabPane from "./Tab-Pane";

const Tabs = (props) => {
    const { children } = props;
    const [tabHeader, setTabHeader] = useState([]);
    const [childContent, setChildConent] = useState({});
    const [active, setActive] = useState("");
    
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
        setActive(headers[0][0]);
        setChildConent({ ...childCnt });
    }, [props, children]);

    const changeTab = (returnValue) => {
        setActive(returnValue[0]);
        children[0].props.onClick(returnValue)
    };

  return (
    <div className="tabs">
      <ul className="tab-header">
        {tabHeader.map((item) => (
          <li
            onClick={() => changeTab(item)}
            key={item[1]}
            className={item[0] === active ? "active" : ""}
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
