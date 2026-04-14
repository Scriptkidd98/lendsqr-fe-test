import styles from "./User.module.scss";
import DashboardLayout from "../../layouts/dashboard-layout/DashboardLayout";
import backArrowIcon from "./assets/icons/back-arrow.svg";
import userIcon from "./assets/icons/user.svg";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

type StoredUser = {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
};

const SELECTED_USER_STORAGE_KEY = "selectedUserData";

const readStoredUser = (id?: string): StoredUser | null => {
  const selectedUser = localStorage.getItem(SELECTED_USER_STORAGE_KEY);
  if (!selectedUser) return null;

  try {
    const parsed = JSON.parse(selectedUser) as StoredUser;
    if (!parsed?.id) return null;
    if (id && parsed.id !== id) return null;
    return parsed;
  } catch {
    return null;
  }
};

const User = () => {
  const { id } = useParams();
  const [userDisplay, setUserDisplay] = useState<StoredUser | null>(() => readStoredUser(id));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (!id) {
        if (isMounted) {
          setError("User not found");
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/mock/users.json");
        if (!response.ok) throw new Error("Failed to load user details");

        const users = (await response.json()) as StoredUser[];
        const matchedUser = users.find((user) => user.id === id) ?? readStoredUser(id);

        if (!matchedUser) {
          throw new Error("User not found");
        }

        if (isMounted) {
          setUserDisplay(matchedUser);
          localStorage.setItem(SELECTED_USER_STORAGE_KEY, JSON.stringify(matchedUser));
        }
      } catch {
        const cachedUser = readStoredUser(id);

        if (isMounted && cachedUser) {
          setUserDisplay(cachedUser);
        } else if (isMounted) {
          setError("User not found");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const displayData = useMemo(() => {
    return {
      fullName: userDisplay?.username ?? "",
      userId: userDisplay?.id ?? id ?? "",
      phoneNumber: userDisplay?.phoneNumber ?? "",
      emailAddress: userDisplay?.email ?? "",
    };
  }, [id, userDisplay]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Link to="/dashboard/users" className={styles.back_to_users_link}>
          <img src={backArrowIcon} height={9.38} width={26.72}></img>
          <span>Back to Users</span>
        </Link>

        <div className={styles.heading_buttons_div}>
          <h1>User Details</h1>
          <div>
            <button className={styles.blacklist_user_button}>Blacklist User</button>
            <button className={styles.activate_user_button}>Activate User</button>
          </div>
        </div>

        <div className={styles.loading_user_details_div}>
          <p>Loading user details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p>{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Link to="/dashboard/users" className={styles.back_to_users_link}>
        <img src={backArrowIcon} height={9.38} width={26.72}></img>
        <span>Back to Users</span>
      </Link>

      <div className={styles.heading_buttons_div}>
        <h1>User Details</h1>
        <div>
          <button className={styles.blacklist_user_button}>Blacklist User</button>
          <button className={styles.activate_user_button}>Activate User</button>
        </div>
      </div>

      

      <div className={styles.user_detail_top_div}>
        <div className={styles.user_detail_top_info}>
          <div className={styles.user_identity_block}>
            <div className={styles.avatar_placeholder}>
              <img src={userIcon} width={27.9} height={29.2}></img>
            </div>
            <div>
                <h2>{displayData.fullName}</h2>
                <p>{displayData.userId}</p>
            </div>
          </div>

          <div className={styles.user_tier_block}>
            <p>User&apos;s Tier</p>
            <div className={styles.tier_stars}>
              <span className={styles.active_star}>★</span>
              <span>★</span>
              <span>★</span>
            </div>
          </div>

          <div className={styles.user_balance_block}>
            <h2>₦200,000.00</h2>
            <p>9912345678/Providus Bank</p>
          </div>
        </div>

        <div className={styles.user_details_tabs} role='tablist'>
          <button role='tab' className={styles.active_tab}>General Details</button>
          <button role='tab'>Documents</button>
          <button role='tab'>Bank Details</button>
          <button role='tab'>Loans</button>
          <button role='tab'>Savings</button>
          <button role='tab'>App and System</button>
        </div>
      </div>

      <div className={styles.personal_info_div} role="tabpanel">
        <section className={styles.info_section}>
          <h3>Personal Information</h3>
          <div className={styles.info_grid_five}>
            <div className={styles.info_item}>
              <h4>FULL NAME</h4>
              <p>{displayData.fullName}</p>
            </div>
            <div className={styles.info_item}>
              <h4>PHONE NUMBER</h4>
              <p>{displayData.phoneNumber}</p>
            </div>
            <div className={styles.info_item}>
              <h4>EMAIL ADDRESS</h4>
              <p>{displayData.emailAddress}</p>
            </div>
            <div className={styles.info_item}>
              <h4>BVN</h4>
              <p>07060780922</p>
            </div>
            <div className={styles.info_item}>
              <h4>GENDER</h4>
              <p>Female</p>
            </div>
            <div className={styles.info_item}>
              <h4>MARITAL STATUS</h4>
              <p>Single</p>
            </div>
            <div className={styles.info_item}>
              <h4>CHILDREN</h4>
              <p>None</p>
            </div>
            <div className={styles.info_item}>
              <h4>TYPE OF RESIDENCE</h4>
              <p>Parent&apos;s Apartment</p>
            </div>
          </div>
        </section>

        <section className={styles.info_section}>
          <h3>Education and Employment</h3>
          <div className={styles.info_grid_four}>
            <div className={styles.info_item}>
              <h4>LEVEL OF EDUCATION</h4>
              <p>B.Sc</p>
            </div>
            <div className={styles.info_item}>
              <h4>EMPLOYMENT STATUS</h4>
              <p>Employed</p>
            </div>
            <div className={styles.info_item}>
              <h4>SECTOR OF EMPLOYMENT</h4>
              <p>FinTech</p>
            </div>
            <div className={styles.info_item}>
              <h4>DURATION OF EMPLOYMENT</h4>
              <p>2 years</p>
            </div>
            <div className={styles.info_item}>
              <h4>OFFICE EMAIL</h4>
              <p>grace@lendsqr.com</p>
            </div>
            <div className={styles.info_item}>
              <h4>MONTHLY INCOME</h4>
              <p>₦200,000.00 - ₦400,000.00</p>
            </div>
            <div className={styles.info_item}>
              <h4>LOAN REPAYMENT</h4>
              <p>40,000</p>
            </div>
          </div>
        </section>

        <section className={styles.info_section}>
          <h3>Socials</h3>
          <div className={styles.info_grid_three}>
            <div className={styles.info_item}>
              <h4>TWITTER</h4>
              <p>@grace_effiom</p>
            </div>
            <div className={styles.info_item}>
              <h4>FACEBOOK</h4>
              <p>Grace Effiom</p>
            </div>
            <div className={styles.info_item}>
              <h4>INSTAGRAM</h4>
              <p>@grace_effiom</p>
            </div>
          </div>
        </section>

        <section className={styles.info_section}>
          <h3>Guarantor</h3>
          <div className={styles.info_grid_four}>
            <div className={styles.info_item}>
              <h4>FULL NAME</h4>
              <p>Debby Ogana</p>
            </div>
            <div className={styles.info_item}>
              <h4>PHONE NUMBER</h4>
              <p>07060780922</p>
            </div>
            <div className={styles.info_item}>
              <h4>EMAIL ADDRESS</h4>
              <p>debby@gmail.com</p>
            </div>
            <div className={styles.info_item}>
              <h4>RELATIONSHIP</h4>
              <p>Sister</p>
            </div>
          </div>
        </section>

        <section className={styles.info_section_last}>
          <div className={styles.info_grid_four}>
            <div className={styles.info_item}>
              <h4>FULL NAME</h4>
              <p>Debby Ogana</p>
            </div>
            <div className={styles.info_item}>
              <h4>PHONE NUMBER</h4>
              <p>07060780922</p>
            </div>
            <div className={styles.info_item}>
              <h4>EMAIL ADDRESS</h4>
              <p>debby@gmail.com</p>
            </div>
            <div className={styles.info_item}>
              <h4>RELATIONSHIP</h4>
              <p>Sister</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default User