import styles from "./DashboardLayout.module.scss";
import logo from "../../assets/images/logo.svg";
import searchIcon from "./assets/icons/search.svg";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import bellIcon from "./assets/icons/bell.svg";
import avatar from "./assets/images/avatar.svg";
import chevronDownFilledIcon from "./assets/icons/chevron-down-filled.svg";
import briefcaseIcon from "./assets/icons/briefcase.svg";
import chevronDownIcon from "./assets/icons/chevron-down.svg";
import homeIcon from "./assets/icons/home.svg";
import sackIcon from "./assets/icons/sack.svg";
import userCheckIcon from "./assets/icons/user-check.svg";
import userTimesIcon from "./assets/icons/user-times.svg";
import usersIcon from "./assets/icons/users.svg";
import userFriendsIcon from "./assets/icons/user-friends.svg";
import handshakeIcon from "./assets/icons/handshake.svg";
import piggyBankIcon from "./assets/icons/piggy-bank.svg";
import handWithSackIcon from "./assets/icons/hand-with-sack.svg";
import clipboardIcon from "./assets/icons/clipboard.svg";
import slidersIcon from "./assets/icons/sliders.svg";
import badgePercentIcon from "./assets/icons/badge-percent.svg";
import galaxyIcon from "./assets/icons/galaxy.svg";
import userCogIcon from "./assets/icons/user-cog.svg";
import scrollIcon from "./assets/icons/scroll.svg";
import barChartIcon from "./assets/icons/bar-chart.svg";
import transactionIcon from "./assets/icons/phone-in-and-out.svg";
import mobileLogo from "./assets/images/mobile-logo.svg";
import tireIcon from "./assets/icons/tire.svg";
import signoutIcon from "./assets/icons/sign-out.svg";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const[isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const[isSideNavOpen, setIsSideNavOpen] = useState<boolean>(false);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsUserMenuOpen(false);
    setIsSideNavOpen(false);
    navigate("/login", { replace: true });
  };

  const handleSideNavClick: React.MouseEventHandler<HTMLElement> = (event) => {
    const target = event.target as HTMLElement;
    if (target.closest("a")) {
      setIsSideNavOpen(false);
    }
  };

  useEffect(() => {
    const handleCmdKPress = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        const searchInput = document.querySelector(`.${styles.dashboard_layout_header_search_input_div} input`) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener("keydown", handleCmdKPress);

    return () => {
      document.removeEventListener("keydown", handleCmdKPress);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userMenu = document.getElementById("dashboard_layout_top_nav_user_menu");
      const userMenuButton = document.getElementById("dashboard_layout_top_nav_user_menu_button");
      if (userMenu && !userMenu.contains(event.target as Node) && userMenuButton && !userMenuButton.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") {
        setIsUserMenuOpen(false);
      }
    };

    if(isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyPress);
    } 

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isUserMenuOpen]);

  return (
    <div>
      <header className={styles.dashboard_layout_header}>
        <nav className={styles.dashboard_layout_top_nav}>
          <button
            className={styles.dashboard_layout_top_nav_hamburger_button}
            onClick={() => setIsSideNavOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            data-testid="dashboard-hamburger-button"
          >
            ☰
          </button>

          <img src={logo} alt="logo" height={30} width={144.8} className={styles.desktop_logo} />
          <img src={mobileLogo} alt="logo" height={32} width={32} className={styles.mobile_logo} />

          <div className={styles.dashboard_layout_top_nav_right}>
            <div className={styles.dashboard_layout_header_search_div}>
              <div className={styles.dashboard_layout_header_search_input_div}>
                <input type="text" placeholder="Search for anything" data-testid="dashboard-search-input"></input>
              </div>
              <button>
                <img src={searchIcon} height={14} width={13.97}></img>
              </button>
            </div>
            
            <div className={styles.dashboard_layout_top_nav_far_right}>
              <Link to="#" className={styles.dashboard_layout_top_nav_docs_link}>Docs</Link>
              <button className={styles.dashboard_layout_top_nav_notification_icon_button}>
                <img src={bellIcon} width={19.674962997436523} height={22.736698150634766}></img>
              </button>
              <div className={styles.dashboard_layout_top_nav_user_div}>
                <button 
                  id="dashboard_layout_top_nav_user_menu_button"
                  className={styles.dashboard_layout_top_nav_user_menu_button} 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  data-testid="dashboard_user_menu_button"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="menu"
                >
                  <img src={avatar} height={48} width={48}></img>
                  <span className={styles.dashboard_layout_top_nav_user_name}>Adedeji</span>
                  <img src={chevronDownFilledIcon} height={4.15} width={7.34}></img>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {isUserMenuOpen && (
        <div 
          className={styles.dashboard_layout_top_nav_user_menu} 
          id="dashboard_layout_top_nav_user_menu"
          data-testid="dashboard-user-menu"
        >
          <div>
            <div className={styles.dashboard_layout_top_nav_user_menu_profile_div}>
              <div className={styles.dashboard_layout_top_nav_user_menu_profile_grid_div}>
                <img src={avatar} height={28} width={28}></img>
                <span>Adedeji</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.3332 1L3.99984 8.33333L0.666504 5" stroke="#303030" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>

            <a href="#" className={styles.dashboard_layout_top_nav_user_menu_org_link}>
              <img src={homeIcon} width={16} height={16}></img>
              <span>Organization</span>
            </a>
          </div>

          <hr/>

          <div>
            <a href="#" className={styles.dashboard_layout_top_nav_user_menu_link}>Help Center</a>     
          </div>

          <hr/>

          <div>
            <a href="#" className={styles.dashboard_layout_top_nav_user_name_email_link}>
              <span>Adedeji</span>
              <span>adedeji@gmail.com</span>
            </a>
            <a href="#" className={styles.dashboard_layout_top_nav_user_menu_link}>Manage account</a>
            <button
              type="button"
              className={styles.dashboard_layout_top_nav_user_menu_link}
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      )}

      <div
        className={`${styles.dashboard_layout_backdrop} ${isSideNavOpen ? styles.dashboard_layout_backdrop_open : ""}`}
        onClick={() => setIsSideNavOpen(false)}
        data-testid="dashboard-backdrop"
      />

      <main className={styles.dashboard_layout_main}>
        <nav 
          className={`${styles.dashboard_layout_side_nav} ${isSideNavOpen ? styles.dashboard_layout_side_nav_open : ""}`} 
          onClick={handleSideNavClick}
          data-testid="dashboard-side-nav"
          data-state={isSideNavOpen ? "open" : "closed"}
        >
          <button className={styles.switch_organization_button}>
            <img src={briefcaseIcon} height={16} width={16}></img>
            <span>Switch Organization</span>
            <img src={chevronDownIcon} height={11.21} width={6.57}></img>
          </button>

          <Link to="#">
            <img src={homeIcon} width={16} height={14.22}></img>
            <span>Dashboard</span>
          </Link>

          <div className={styles.dashboard_layout_side_nav_links_section}>
            <span className={styles.dashboard_layout_side_nav_links_section_heading}>CUSTOMERS</span>
            <Link to="/dashboard/users" className={`${location.pathname === "/dashboard/users" ? styles.active : ""}`}>
              <img src={usersIcon} width={16} height={12.8}></img>
              <span>Users</span>
            </Link>

            <Link to="#">
              <img src={userFriendsIcon} width={16} height={12.8}></img>
              <span>Guarantors</span>
            </Link>

            <Link to="#">
              <img src={sackIcon} width={16} height={16}></img>
              <span>Loans</span>
            </Link>

            <Link to="#">
              <img src={handshakeIcon} width={19} height={15.2}></img>
              <span>Decision Models</span>
            </Link>

            <Link to="#">
              <img src={piggyBankIcon} width={16} height={14.22}></img>
              <span>Savings</span>
            </Link>

            <Link to="#">
              <img src={handWithSackIcon} width={18} height={22}></img>
              <span>Loan Requests</span>
            </Link>

            <Link to="#">
              <img src={userCheckIcon} width={16} height={12.8}></img>
              <span>Whitelist</span>
            </Link>

            <Link to="#">
              <img src={userTimesIcon} width={16} height={12.8}></img>
              <span>Karma</span>
            </Link>
          </div>

          <div className={styles.dashboard_layout_side_nav_links_section}>
            <span className={styles.dashboard_layout_side_nav_links_section_heading}>BUSINESSES</span>
            <Link to="#">
              <img src={briefcaseIcon} width={16} height={16}></img>
              <span>Organization</span>
            </Link>

            <Link to="#">
              <img src={handWithSackIcon} width={18} height={22}></img>
              <span>Loan Products</span>
            </Link>

            <Link to="#">
              <img src={sackIcon} width={16} height={16}></img>
              <span>Savings Products</span>
            </Link>

            <Link to="#">
              <img src={handshakeIcon} width={16} height={16}></img>
              <span>Fees and Charges</span>
            </Link>

            <Link to="#">
              <img src={transactionIcon} width={16} height={18}></img>
              <span>Transactions</span>
            </Link>

            <Link to="#">
              <img src={galaxyIcon} width={16} height={16}></img>
              <span>Services</span>
            </Link>

            <Link to="#">
              <img src={userCogIcon} width={16} height={12.8}></img>
              <span>Service Account</span>
            </Link>

            <Link to="#">
              <img src={scrollIcon} width={16} height={12.8}></img>
              <span>Settlements</span>
            </Link>

            <Link to="#">
              <img src={barChartIcon} width={16} height={16}></img>
              <span>Reports</span>
            </Link>
          </div>

          <div className={styles.dashboard_layout_side_nav_links_section}>
            <span className={styles.dashboard_layout_side_nav_links_section_heading}>SETTINGS</span>
            <Link to="#">
              <img src={slidersIcon} width={16} height={16}></img>
              <span>Preferences</span>
            </Link>

            <Link to="#">
              <img src={badgePercentIcon} width={16} height={16}></img>
              <span>Fees and Pricing</span>
            </Link>

            <Link to="#">
              <img src={clipboardIcon} width={16} height={21.33}></img>
              <span>Audit Logs</span>
            </Link>

            <Link to="#">
              <img src={tireIcon} width={16} height={16}></img>
              <span>Systems Messages</span>
            </Link>
          </div>

          <div>
            <button type="button" onClick={handleLogout}>
              <img src={signoutIcon} width={16} height={16}></img>
              <span>Logout</span>
            </button>
            <span className={styles.dashboard_layout_side_nav_version}>v1.2.0</span>
          </div>
        </nav>
        <section className={styles.dashboard_layout_content_section}>{children}</section>
      </main>
    </div>
  )
}

export default DashboardLayout