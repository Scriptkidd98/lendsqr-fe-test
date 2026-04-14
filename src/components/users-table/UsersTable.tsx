import { useMemo, useState, useEffect, useRef, useLayoutEffect } from "react";
import styles from "./UsersTable.module.scss";
import threeDotsIcon from "./assets/icons/user-table-three-dots.svg";
import filterIcon from "./assets/icons/filter-users-result.svg";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import eyeIcon from "./assets/icons/eye.svg";
import userXIcon from "./assets/icons/user-x.svg";
import userCheckIcon from "./assets/icons/user-with-check.svg";


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
  anchorEl: HTMLElement | null,
  selectedUser: UserRow | null
}

type FilterValues = {
  organization: string;
  username: string;
  email: string;
  dateJoined: string;
  phoneNumber: string;
  status: string;
};

const initialFilterValues: FilterValues = {
  organization: "",
  username: "",
  email: "",
  dateJoined: "",
  phoneNumber: "",
  status: "",
};

const SELECTED_USER_STORAGE_KEY = "selectedUserData";

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
  rowId: string | null,
  selectedUser: UserRow | null
}

type FilterMenuProps = {
  anchorEl: HTMLElement | null;
  containerEl: HTMLElement | null;
  onClose: () => void;
  draftFilters: FilterValues;
  organizationOptions: string[];
  onChange: (field: keyof FilterValues, value: string) => void;
  onReset: () => void;
  onApply: () => void;
};

const FilterMenu = ({
  anchorEl,
  containerEl,
  onClose,
  draftFilters,
  organizationOptions,
  onChange,
  onReset,
  onApply,
}: FilterMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!anchorEl || !containerEl) return;

    const updatePosition = () => {
      const rect = anchorEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      const preferredLeft = rect.left - 6;

      setMenuPosition({
        top: rect.bottom - containerRect.top + 12,
        left: Math.max(16, preferredLeft - containerRect.left),
      });
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [anchorEl, containerEl]);

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

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-label="Filter users"
      className={styles.filter_menu}
      style={{ top: menuPosition.top, left: menuPosition.left }}
    >
      <div className={styles.filter_field}>
        <label htmlFor="organization-filter">Organization</label>
        <div className={styles.filter_select_wrap}>
          <select
            id="organization-filter"
            value={draftFilters.organization}
            onChange={(event) => onChange("organization", event.target.value)}
          >
            <option value="">Select</option>
            {organizationOptions.map((organization) => (
              <option key={organization} value={organization}>
                {organization}
              </option>
            ))}
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1L6 6L11 1" stroke="#545F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      <div className={styles.filter_field}>
        <label htmlFor="username-filter">Username</label>
        <input
          id="username-filter"
          value={draftFilters.username}
          onChange={(event) => onChange("username", event.target.value)}
          placeholder="User"
        />
      </div>

      <div className={styles.filter_field}>
        <label htmlFor="email-filter">Email</label>
        <input
          id="email-filter"
          value={draftFilters.email}
          onChange={(event) => onChange("email", event.target.value)}
          placeholder="Email"
        />
      </div>

      <div className={styles.filter_field}>
        <label htmlFor="date-filter">Date</label>
        <div className={styles.filter_input_with_icon}>
          <input
            id="date-filter"
            value={draftFilters.dateJoined}
            onChange={(event) => onChange("dateJoined", event.target.value)}
            placeholder="Date"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M13.5 2.25V4.5M4.5 2.25V4.5M2.25 7.5H15.75M3.75 3.75H14.25C15.0784 3.75 15.75 4.42157 15.75 5.25V14.25C15.75 15.0784 15.0784 15.75 14.25 15.75H3.75C2.92157 15.75 2.25 15.0784 2.25 14.25V5.25C2.25 4.42157 2.92157 3.75 3.75 3.75Z" stroke="#545F7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      <div className={styles.filter_field}>
        <label htmlFor="phone-filter">Phone Number</label>
        <input
          id="phone-filter"
          value={draftFilters.phoneNumber}
          onChange={(event) => onChange("phoneNumber", event.target.value)}
          placeholder="Phone Number"
        />
      </div>

      <div className={styles.filter_field}>
        <label htmlFor="status-filter">Status</label>
        <div className={styles.filter_select_wrap}>
          <select
            id="status-filter"
            value={draftFilters.status}
            onChange={(event) => onChange("status", event.target.value)}
          >
            <option value="">Select</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
            <option value="Blacklisted">Blacklisted</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1L6 6L11 1" stroke="#545F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      <div className={styles.filter_actions}>
        <button type="button" className={styles.filter_reset_button} onClick={onReset}>
          Reset
        </button>
        <button type="button" className={styles.filter_apply_button} onClick={onApply}>
          Filter
        </button>
      </div>
    </div>
  );
};

const RowMenu = ({ anchorEl, onClose, rowId, selectedUser }: RowMenu) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const[menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleViewDetails = () => {
    if (selectedUser) {
      localStorage.setItem(SELECTED_USER_STORAGE_KEY, JSON.stringify(selectedUser));
    }
    onClose();
  };

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
      <Link to={`/dashboard/users/${rowId}`} className={styles.row_menu_action_div} onClick={handleViewDetails}>
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
  const usersTableShellRef = useRef<HTMLDivElement | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [filterMenuContainerEl, setFilterMenuContainerEl] = useState<HTMLElement | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterValues>(initialFilterValues);
  const [draftFilters, setDraftFilters] = useState<FilterValues>(initialFilterValues);
  const[menu, setMenu] = useState<MenuState>({
    isOpen: false,
    rowId: null,
    anchorEl: null,
    selectedUser: null
  });

  const organizationOptions = useMemo(() => {
    return Array.from(new Set(users.map((user) => user.organization))).sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    const normalize = (value: string) => value.trim().toLowerCase();

    return users.filter((user) => {
      const matchesOrganization = !activeFilters.organization || user.organization === activeFilters.organization;
      const matchesUsername = !activeFilters.username || user.username.toLowerCase().includes(normalize(activeFilters.username));
      const matchesEmail = !activeFilters.email || user.email.toLowerCase().includes(normalize(activeFilters.email));
      const matchesDate = !activeFilters.dateJoined || user.dateJoined.toLowerCase().includes(normalize(activeFilters.dateJoined));
      const matchesPhone = !activeFilters.phoneNumber || String(user.phoneNumber).includes(normalize(activeFilters.phoneNumber));
      const matchesStatus = !activeFilters.status || user.status === activeFilters.status;

      return (
        matchesOrganization &&
        matchesUsername &&
        matchesEmail &&
        matchesDate &&
        matchesPhone &&
        matchesStatus
      );
    });
  }, [users, activeFilters]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const visibleRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const pageNumbers = useMemo(() => {
    return getPageNumbers(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const openFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setDraftFilters(activeFilters);
    setFilterAnchorEl(event.currentTarget);
    setFilterMenuContainerEl(usersTableShellRef.current);
  };

  const closeFilterMenu = () => {
    setFilterAnchorEl(null);
  };

  const handleDraftFilterChange = (field: keyof FilterValues, value: string) => {
    setDraftFilters((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setDraftFilters(initialFilterValues);
    setActiveFilters(initialFilterValues);
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setActiveFilters(draftFilters);
    setCurrentPage(1);
    closeFilterMenu();
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const openMenu = (event: React.MouseEvent, user: UserRow) => {
    setMenu({
      isOpen: true,
      rowId: user.id,
      anchorEl: event.currentTarget as HTMLElement,
      selectedUser: user
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
      <div className={styles.users_table_shell} ref={usersTableShellRef}>
        <div className={styles.tableWrap}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>
                <div>
                  <span>Organization</span>
                  <button type="button" onClick={openFilterMenu} aria-label="Filter by organization">
                    <img src={filterIcon} height={10.67} width={16}></img>
                  </button>
                </div>
              </th>
              <th>
                <div>
                  <span>Username</span>
                  <button type="button" onClick={openFilterMenu} aria-label="Filter by username">
                    <img src={filterIcon} height={10.67} width={16}></img>
                  </button>
                </div>
              </th>
              <th>
                <div>
                  <span>Email</span>
                  <button type="button" onClick={openFilterMenu} aria-label="Filter by email">
                    <img src={filterIcon} height={10.67} width={16}></img>
                  </button>
                </div>
              </th>
              <th>
                <div>
                  <span>Phone Number</span>
                  <button type="button" onClick={openFilterMenu} aria-label="Filter by phone number">
                    <img src={filterIcon} height={10.67} width={16}></img>
                  </button>
                </div>
              </th>
              <th>
                <div>
                  <span>Date Joined</span>
                  <button type="button" onClick={openFilterMenu} aria-label="Filter by date joined">
                    <img src={filterIcon} height={10.67} width={16}></img>
                  </button>
                </div>
              </th>
              <th>
                <div>
                  <span>Status</span>
                  <button type="button" onClick={openFilterMenu} aria-label="Filter by status">
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
                    onClick={(e) => openMenu(e, user)}
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
        {filterAnchorEl && (
          <FilterMenu
            anchorEl={filterAnchorEl}
            containerEl={filterMenuContainerEl}
            onClose={() => {
              closeFilterMenu();
              setDraftFilters(activeFilters);
            }}
            draftFilters={draftFilters}
            organizationOptions={organizationOptions}
            onChange={handleDraftFilterChange}
            onReset={resetFilters}
            onApply={applyFilters}
          />
        )}
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
          selectedUser={menu.selectedUser}
          onClose={() => setMenu({ isOpen: false, rowId: null, anchorEl: null, selectedUser: null })}
        />
      )}
    </section>
  );
};

export default UsersTable;