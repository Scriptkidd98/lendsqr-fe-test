import { useMemo, useState, useEffect, useRef, useLayoutEffect } from "react";
import styles from "./UsersTable.module.scss";
import threeDotsIcon from "../../assets/icons/user-table-three-dots.svg";
import filterIcon from "../../assets/icons/filter-users-result.svg";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import eyeIcon from "../../assets/icons/eye.svg";
import userXIcon from "../../assets/icons/user-x.svg";
import userCheckIcon from "../../assets/icons/user-with-check.svg";


type UserStatus = "Active" | "Inactive" | "Pending" | "Blacklisted";

type PageToken = number | "left-ellipsis" | "right-ellipsis";

type UserRow = {
  id: string;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: UserStatus;
};

type MenuState = {
  isOpen: boolean,
  rowId: string | null,
  anchorEl: HTMLElement | null
}

const pageSizeOptions = [10, 20, 50, 100];

const getStatusClass = (status: UserStatus) => {
  switch (status) {
    case "Active":
      return styles.statusActive;
    case "Pending":
      return styles.statusPending;
    case "Blacklisted":
      return styles.statusBlacklisted;
    case "Inactive":
    default:
      return styles.statusInactive;
  }
};

const getPageNumbers = (currentPage: number, totalPages: number): PageToken[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - 1, 1);
  const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

  const showLeftDots = leftSiblingIndex > 3;
  const showRightDots = rightSiblingIndex < totalPages - 2;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 5;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "right-ellipsis", totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = 5;
    const rightRange = Array.from({ length: rightItemCount },(_, i) => totalPages - rightItemCount + i + 1);
    return [1, "left-ellipsis", ...rightRange];
  }

  if (showLeftDots && showRightDots) {
    const middleRange = [leftSiblingIndex, currentPage, rightSiblingIndex];
    return [1, "left-ellipsis", ...middleRange, "right-ellipsis", totalPages];
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

type RowMenu = {
  anchorEl: HTMLElement | null, 
  onClose: () => void, 
  rowId: string | null
}

const RowMenu = ({ anchorEl, onClose, rowId }: RowMenu) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const[menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!anchorEl) return;

    const updatePosition = () => {
      const rect = anchorEl.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true); // captures nested scroll containers
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [anchorEl]);

  useEffect(() => {
    if (!anchorEl) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [anchorEl, onClose]);

  if (!anchorEl) return null;

  return createPortal(
    <div
      role="menu"
      style={{
        position: "fixed",
        top: menuPosition.top - 30,
        
        right: 50
      }}
      ref={menuRef}
      className={styles.row_menu}
    >
      <Link to={`/dashboard/users/${rowId}`} className={styles.row_menu_action_div} onClick={onClose}>
        <img src={eyeIcon} width={15.1} height={9.73}></img>
        <span>View Details</span>
      </Link>
      <button className={styles.row_menu_action_div} onClick={onClose}>
        <img src={userXIcon} width={11} height={13.13}></img>
        <span>Blacklist User</span>
      </button>
      <button className={styles.row_menu_action_div} onClick={onClose}>
        <img src={userCheckIcon} width={12.567739486694336} height={12.590010643005371}></img>
        <span>Activate User</span>
      </button>
    </div>, document.body
  )
}

const UsersTable = () => {
  const[pageSize, setPageSize] = useState<number>(10);
  const[currentPage, setCurrentPage] = useState<number>(1);
  const[users, setUsers] = useState<UserRow[]>([]);
  const[error, setError] = useState<string>("");
  const[loading, setLoading] = useState<boolean>(true);
  const[showPageSizeOptions, setShowPageSizeOptions] = useState<boolean>(false);
  const[menu, setMenu] = useState<MenuState>({
    isOpen: false,
    rowId: null,
    anchorEl: null
  });

  const totalItems = users.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const visibleRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, currentPage, pageSize]);

  const pageNumbers = useMemo(() => {
    return getPageNumbers(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/mock/users.json");
        if (!res.ok) throw new Error("Failed to load users");
        const data = (await res.json()) as UserRow[];
        setUsers(data);
      } catch(error) {
        setError("Could not load users");
        return error;
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const pageSizeDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showPageSizeOptions) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (pageSizeDropdownRef.current && !pageSizeDropdownRef.current.contains(target)) {
        setShowPageSizeOptions(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") {
        setShowPageSizeOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPageSizeOptions]);

  const openMenu = (event: React.MouseEvent, rowId: string) => {
    setMenu({
      isOpen: true,
      rowId,
      anchorEl: event.currentTarget as HTMLElement
    })
  }

  if (loading) return <p>Loading users...</p>;
  if (error) return (
    <div className={styles.users_not_found_div}>
      <div>
        <p>Could not load users</p>
        <div>
          <button>Retry</button>
          <button> Add User</button>
        </div>
      </div>
    </div>
  );

  return (
    <section className={styles.usersTableSection}>
      <div className={styles.tableWrap}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>
                <div>
                  <span>Organization</span>
                  <button>
                    <img src={filterIcon} height={10.67} width={16}></img>
                  </button>
                </div>
              </th>
              <th>
                <div>
                  <span>Username</span>
                  <button>
                    <img src={filterIcon} height={10.67} width={16}></img>
                  </button>
                </div>
              </th>
              <th>
                <div>
                  <span>Email</span>
                  <button>
                    <img src={filterIcon} height={10.67} width={16}></img>
                  </button>
                </div>
              </th>
              <th>
                <div>
                  <span>Phone Number</span>
                  <button>
                    <img src={filterIcon} height={10.67} width={16}></img>
                  </button>
                </div>
              </th>
              <th>
                <div>
                  <span>Date Joined</span>
                  <button>
                    <img src={filterIcon} height={10.67} width={16}></img>
                  </button>
                </div>
              </th>
              <th>
                <div>
                  <span>Status</span>
                  <button>
                    <img src={filterIcon} height={10.67} width={16}></img>
                  </button>
                </div>
              </th>
              <th aria-label="Actions" />
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((user) => (
              <tr key={user.id}>
                <td>{user.organization}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.dateJoined}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button 
                    className={styles.actionsButton} 
                    aria-label={`Open actions for ${user.username}`} 
                    onClick={(e) => openMenu(e, user.id)}
                    aria-expanded={menu.isOpen}
                    aria-haspopup="menu"
                    data-testid="users-action-menu-button"
                  >
                    <img src={threeDotsIcon} height={14.44} width={3.33}></img>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationBar}>
        <div className={styles.showingControl}>
          <span>Showing</span>
          <div className={styles.users_table_page_size_select_div} ref={pageSizeDropdownRef}>
            <button 
              className={styles.users_table_page_size_select_button} 
              onClick={() => setShowPageSizeOptions(!showPageSizeOptions)}
              aria-haspopup="listbox"
              aria-expanded={showPageSizeOptions}
              aria-label="Toggle page size options"
              data-testid="toggle-users-page-size"
            >
              <span>{pageSize}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="6.57" height="12.21" viewBox="0 0 16 10.67" fill="none"><path d="M1 1L8 9L15 1" stroke="#545F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </button>
            {showPageSizeOptions && (
              <ul className={styles.users_table_page_size_options_listbox} role="listbox">
                {pageSizeOptions.map((option) => (
                  <li key={option} role="option" onClick={() => {handlePageSizeChange(option); setShowPageSizeOptions(false);}}>
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span>out of {totalItems}</span>
        </div>

        <div className={styles.paginationControls}>
          <button
            className={styles.pageArrowButton}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.previousPageArrowIcon}><path d="m9 18 6-6-6-6"></path></svg>
          </button>

          {pageNumbers?.map((page, index) => {
            if (page === "left-ellipsis") {
              return (
                <button
                  key={`left-ellipsis-${index}`}
                  className={styles.pageEllipsis}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 5))}
                  aria-label="Jump back 5 pages"
                >
                  ...
                </button>
              );
            }

            if (page === "right-ellipsis") {
              return (
                <button
                  key={`right-ellipsis-${index}`}
                  className={styles.pageEllipsis}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 5))}
                  aria-label="Jump forward 5 pages"
                >
                  ...
                </button>
              );
            }
    
            return (
              <button
                key={`${page}-${index}`}
                onClick={() => setCurrentPage(page)}
                className={`${styles.pageButton} ${page === currentPage ? styles.pageButtonActive : ""}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}

          <button
            className={styles.pageArrowButton}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
          </button>
        </div>
      </div>
      {menu.isOpen && (
        <RowMenu
          anchorEl={menu.anchorEl}
          rowId={menu.rowId}
          onClose={() => setMenu({ isOpen: false, rowId: null, anchorEl: null })}
        />
      )}
    </section>
  );
};

export default UsersTable;