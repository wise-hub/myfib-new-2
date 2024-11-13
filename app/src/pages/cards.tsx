import { useEffect, useState } from "react";
import { useApi } from "@hooks/useApi";
import { formatNumber } from "@utils/formatNumber";
import navStyles from "@styles/main-layout.module.css";
import styles from "@styles/cards.module.css";
import visaIcon from "@assets/img_logo_visa_blue.png";

interface CardInfo {
  pseudonym: string;
  cardMask: string;
  accountCcy: string;
  minBal?: number;
  totalOutstanding?: number;
  paidAmount?: number;
  cardStateDesc: string;
}

const Cards: React.FC = () => {
  const [cardsInfo, setCardsInfo] = useState<CardInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiCall = useApi();

  useEffect(() => {
    const fetchCardsInfo = async () => {
      try {
        const data = await apiCall(
          "api/v1/sywsquery/sywsquery/getCardsInfo",
          { method: "GET" },
          "%2Fdashboard"
        );
        setCardsInfo(data || []);
      } catch (error) {
        setError("Failed to fetch cards info");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardsInfo();
  }, []);

  if (loading) return <p>Loading cards info...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={navStyles.mainContentContainer}>
      <table className="table">
        <thead>
          <tr>
            <th>Карта</th>
            <th>Валута</th>
            <th className={styles.numberColumn}>Наличност</th>
            <th className={styles.numberColumn}>Дължима сума</th>
            <th className={styles.numberColumn}>Мин. вноска</th>
            <th>Погасяване до</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {cardsInfo.map((card, index) => (
            <tr key={index}>
              <td>
                <div className={styles.cardInfo}>
                  <img
                    src={visaIcon}
                    alt="Visa Logo"
                    width={30}
                    height={20}
                    className={styles.cardLogo}
                  />
                  <div>
                    <div>{card.pseudonym}</div>
                    <div className={styles.cardMask}>{card.cardMask}</div>
                  </div>
                </div>
              </td>
              <td>{card.accountCcy}</td>
              <td className={styles.numberColumn}>
                {card.minBal ? formatNumber(card.minBal) : "N / A"}
              </td>
              <td className={styles.numberColumn}>
                {card.totalOutstanding
                  ? formatNumber(card.totalOutstanding)
                  : "N / A"}
              </td>
              <td className={styles.numberColumn}>
                {card.paidAmount ? formatNumber(card.paidAmount) : "N / A"}
              </td>
              <td>{card.cardStateDesc === "Active" ? "Платена" : "N / A"}</td>
              <td>
                <button className={styles.actionButton}>👁️</button>
                <button className={styles.actionButton}>❄️</button>
                <button className={styles.actionButton}>🚫</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cards;
