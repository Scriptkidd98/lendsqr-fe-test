import DashboardLayout from "../../layouts/dashboard-layout/DashboardLayout";
import styles from "./Dashboard.module.scss";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h1 className={styles.title}>Dashboard</h1>
    </DashboardLayout>
  )
}

export default Dashboard