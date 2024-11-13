import { ReactNode, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import styles from "@styles/main-layout.module.css";
import fibLogo from "@assets/fibank-logo.png";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [customerData, setCustomerData] = useState<any>({});

  useEffect(() => {
    const storedData = sessionStorage.getItem("customerData");
    let parsedData = {};

    if (storedData) {
      try {
        parsedData = JSON.parse(storedData);
      } catch (error) {
        console.error("Error parsing customerData:", error);
        parsedData = {}; // Fallback to an empty object in case of parse error
      }
    }

    setCustomerData(parsedData);
  }, []);

  const fullNameCyrillic =
    customerData?.customer?.[0]?.fullNameCyrillic || "Гост";
  const defaultAccount = customerData?.customer?.[0]?.account?.find(
    (acc: any) => acc.defaultAccount === "Y"
  );
  const accountDescription = defaultAccount
    ? defaultAccount.acDesc
    : "No default account";

  return (
    <div className={styles.mainWrapper}>
      {/* Top Navbar */}
      <header className={styles.topNavbar}>
        <div className={styles.topNavbarContent}>
          <div className={styles.logoWrapper}>
            <img src={fibLogo} alt="Fibank Logo" className={styles.logo} />
          </div>
          <div className={styles.topNavbarRight}>
            <Link to="/en" className={styles.topNavLink}>
              ENGLISH
            </Link>
            <Link to="/help" className={styles.topNavLink}>
              ПОМОЩ
            </Link>
            <Link to="/messages" className={styles.topNavLink}>
              СЪОБЩЕНИЯ
            </Link>
            <Link to="/notifications" className={styles.topNavLink}>
              ИЗВЕСТИЯ
            </Link>
            <Link to="/settings" className={styles.topNavLink}>
              НАСТРОЙКИ
            </Link>
            <button
              className={styles.logoutButton}
              onClick={() => {
                sessionStorage.clear();
                document.cookie =
                  "logged=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                window.location.href = "/";
              }}
            >
              ИЗХОД
            </button>
          </div>
        </div>
      </header>

      {/* Left Navbar and Main Content */}
      <div className={styles.mainContainer}>
        <nav className={styles.leftNavbar}>
          <div className={styles.userInfo}>
            <p>
              <span>Потребител</span> {fullNameCyrillic}
            </p>
            <p>
              <span>Клиент</span> {fullNameCyrillic}
            </p>
          </div>

          <button className={styles.primaryButton}>НОВ ПРЕВОД</button>
          <Link to="/dashboard" className={styles.navLink}>
            Начало
          </Link>
          <Link to="/accounts" className={styles.navLink}>
            Сметки
          </Link>
          <Link to="/cards" className={styles.navLink}>
            Карти
          </Link>
        </nav>

        <div className={styles.contentWrapper}>
          {/* HOME Link with Bottom Border */}
          <div className={styles.homeLinkContainer}>
            <Link to="/" className={styles.homeLink}>
              Начало
            </Link>
          </div>

          {/* Main Content Container */}
          <div className={styles.contentContainer}>
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
