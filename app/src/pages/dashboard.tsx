import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "@hooks/useApi";
import { formatNumber } from "@utils/formatNumber";
import dashboardStyles from "@styles/dashboard.module.css";

interface BalanceCategory {
  bal: number;
  category: string;
}

const Dashboard = () => {
  const [customerData, setCustomerData] = useState<any>(null);
  const [balanceData, setBalanceData] = useState<BalanceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useApi();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const token = sessionStorage.getItem("token") || "";
        if (!token) throw new Error("Token is missing. Please log in again.");

        const storedCustomerData = sessionStorage.getItem("customerData");
        if (storedCustomerData) {
          const parsedCustomerData = JSON.parse(storedCustomerData);
          setCustomerData(parsedCustomerData);
          const customerId = parsedCustomerData.customer[0]?.ibCustomerId;
          sessionStorage.setItem("customer", customerId);

          if (customerId) {
            await fetchBalanceData(customerId);
          } else {
            throw new Error("Invalid customer data in session storage");
          }
        } else {
          const customerData = await apiCall(
            "api/v1/sywsquery/sywsquery/getCustQuery",
            { method: "GET" },
            "%2Fdashboard"
          );

          setCustomerData(customerData);
          sessionStorage.setItem("customerData", JSON.stringify(customerData));
          sessionStorage.setItem(
            "customer",
            customerData.customer[0]?.ibCustomerId
          );
          const customerId = customerData.customer[0]?.ibCustomerId;
          if (customerId) {
            await fetchBalanceData(customerId);
          } else {
            throw new Error("Invalid customer data");
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchBalanceData = async (customerId: string) => {
      try {
        const balanceData = await apiCall(
          "api/v1/sywsquery/sywsquery/GetCustBal?StmtType=T",
          { method: "GET" },
          "%2Fdashboard"
        );
        setBalanceData(balanceData.categoryBal || []);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCustomerData();
  }, []);

  const getBalanceByCategory = (category: string): number | undefined => {
    const categoryBalance = balanceData.find(
      (item) => item.category === category
    );
    return categoryBalance ? categoryBalance.bal : undefined;
  };

  const availableCardBalance = getBalanceByCategory("AVL_CARD_ACC");
  const currentAccountBalance = getBalanceByCategory("CURR_CACC");
  const availableCurrentBalance = getBalanceByCategory("AVL_CACC");

  if (loading) return <p>Loading customer data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className={dashboardStyles.infoBlock}>
        Нетна разполагаема наличност по сметки и депозити:
        <span>{formatNumber(availableCardBalance, "bg-BG")} BGN</span>
      </div>
      <div className={dashboardStyles.infoBlock}>
        Общо текущо салдо по сметки и депозити:
        <span>{formatNumber(currentAccountBalance, "bg-BG")} BGN</span>
      </div>
      <div className={dashboardStyles.infoBlock}>
        Обща нетна разполагаема наличност по картови сметки:
        <span>{formatNumber(availableCurrentBalance, "bg-BG")} BGN</span>
      </div>
    </div>
  );
};

export default Dashboard;
