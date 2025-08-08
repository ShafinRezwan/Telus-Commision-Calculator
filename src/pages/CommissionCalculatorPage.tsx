import "../css/commissionCalculatorPage.css";
import TabMenu from "../components/TabMenu";
import { type Tab } from "../types/types";
import { useState } from "react";
import Calculate from "../components/Calculate";
import Orders from "../components/Orders";
const CommissionCalculatorPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("calculate");
  return (
    <div className="overall-container">
      <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="calculator-container">
        {activeTab === "calculate" && <Calculate />}
        {activeTab === "orders" && <Orders />}
      </div>
    </div>
  );
};

export default CommissionCalculatorPage;
