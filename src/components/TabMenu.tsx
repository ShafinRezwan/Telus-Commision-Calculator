import React from "react";
import "../css/tabmenu.css";
import { type Tab } from "../types/types";

interface TabMenuProps {
  // which tab is currently selected
  activeTab: Tab;
  // function that is called when a tab is clicked
  onTabChange: (tab: Tab) => void;
}
const TABS: { id: Tab; label: string }[] = [
  { id: "calculate", label: "Calculate" },
  { id: "orders", label: "Orders" },
];

const TabMenu: React.FC<TabMenuProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-menu">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${
            activeTab === tab.id ? `active ${tab.id}` : ""
          }`}
          onClick={() => {
            //console.log("Clicked tab:", tab.id);
            onTabChange(tab.id);
            console.log(tab.id);
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabMenu;
