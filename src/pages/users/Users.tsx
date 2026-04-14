import DashboardLayout from "../../layouts/dashboard-layout/DashboardLayout";
import styles from "./Users.module.scss";
import usersIcon from "./assets/icons/users2.svg";
import activeUserIcon from "./assets/icons/active-users.svg";
import usersWithLoansIcon from "./assets/icons/users-with-loans.svg";
import usersWithSavingsIcon from "./assets/icons/users-with-savings.svg";
import UsersTable from "../../components/users-table/UsersTable";


type MetricVariant = "users" | "activeUsers" | "loans" | "savings";

type Metrics = {
  title: string;
  metric: string;
  icon: string;
  variant: MetricVariant;
};

const metrics: Metrics[] = [
  { title: "Users", metric: "2,453", icon: usersIcon, variant: "users" },
  { title: "Active Users", metric: "2,453", icon: activeUserIcon, variant: "activeUsers" },
  { title: "Users with Loans", metric: "12,453", icon: usersWithLoansIcon, variant: "loans" },
  { title: "Users with Savings", metric: "102,453", icon: usersWithSavingsIcon, variant: "savings" },
];

const iconBgClassByVariant: Record<MetricVariant, string> = {
  users: styles.users_metric_icon_bg_users,
  activeUsers: styles.users_metric_icon_bg_active_users,
  loans: styles.users_metric_icon_bg_loans,
  savings: styles.users_metric_icon_bg_savings,
};

const Users = () => {
  return (
    <DashboardLayout>
      <h1>Users</h1>
      <div className={styles.users_metrics_grid_div}>
        {metrics && metrics.length > 0 && metrics.map((metric, index) => {
          return (
            <div className={styles.users_metric_card} key={index}>
              <div className={`${styles.users_metric_icon_bg} ${iconBgClassByVariant[metric.variant]}`}>
                <img src={metric.icon} alt={`${metric.title} icon`} />
              </div>
              <span>{metric.title}</span>
              <span>{metric.metric}</span>
            </div>
          )
        })}
      </div>
      
      <UsersTable />
    </DashboardLayout>
  )
}

export default Users