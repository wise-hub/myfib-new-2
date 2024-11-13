import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatNumber } from "@utils/formatNumber";
import { useApi } from "@hooks/useApi";
import styles from "@styles/accounts.module.css";
import navStyles from "@styles/main-layout.module.css";
import primaryAccountIcon from "@assets/ic-dflt-account.png";
import accountIcon from "@assets/Fib_icon.png";

interface Account {
  acDesc: string;
  iban: string;
  ccy: string;
  acyAvlBal: number;
  acyOpeningBal: number;
  acyCurrBalance: number;
  blockedAmount: number;
  description: string;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiCall = useApi();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await apiCall(
          "api/v1/sywsquery/sywsquery/GetCustBal?StmtType=T",
          { method: "GET" },
          "%2Fdashboard"
        );
        setAccounts(data.acc || []);
      } catch (error) {
        setError("Failed to fetch accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const isPrimaryAccount = (account: Account) => {
    return account.description === "Разплащателна сметка служители";
  };

  if (loading) return <p>Loading accounts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={navStyles.mainContentContainer}>
      <table className="table">
        <thead>
          <tr>
            <th>Сметка</th>
            <th>Валута</th>
            <th className="numberColumn">Разполагаемост</th>
            <th className="numberColumn">Начално салдо</th>
            <th className="numberColumn">Текущо салдо</th>
            <th className="numberColumn">Блокирани суми</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={index}>
              <td>
                <div className={styles.accountInfo}>
                  <img
                    src={
                      isPrimaryAccount(account)
                        ? primaryAccountIcon
                        : accountIcon
                    }
                    alt={
                      isPrimaryAccount(account)
                        ? "Primary Account Icon"
                        : "Account Icon"
                    }
                    width={24}
                    height={24}
                  />
                  <div>
                    <div>{account.acDesc}</div>
                    <div className={styles.iban}>{account.iban}</div>
                  </div>
                </div>
              </td>
              <td>{account.ccy}</td>
              <td className="numberColumn">
                {formatNumber(account.acyAvlBal)}
              </td>
              <td className="numberColumn">
                {formatNumber(account.acyOpeningBal)}
              </td>
              <td className="numberColumn">
                {formatNumber(account.acyCurrBalance)}
              </td>
              <td className="numberColumn">
                {formatNumber(account.blockedAmount)}
              </td>
              <td>
                <button className="actionButton">📋</button>
                <button className="actionButton">⚙️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Accounts;
