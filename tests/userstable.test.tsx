import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import UsersTable from "../src/components/users-table/UsersTable";
import "@testing-library/jest-dom/vitest";

type UserStatus = "Active" | "Inactive" | "Pending" | "Blacklisted";

const makeUsers = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    organization: i % 2 ? "Lendsqr" : "Irorun",
    username: `User ${i + 1}`,
    email: `user${i + 1}@mail.com`,
    phoneNumber: `08000000${String(i + 1).padStart(3, "0")}`,
    dateJoined: "May 15, 2020 10:00 AM",
    status: (["Active", "Inactive", "Pending", "Blacklisted"][i % 4] as UserStatus),
  }));

const renderTable = () =>
  render(
    <MemoryRouter>
      <UsersTable />
    </MemoryRouter>
  );

describe("UsersTable", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders rows from API and shows total count", async () => {
    const users = makeUsers(12);
    (globalThis.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => users,
    });

    renderTable();

    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
    expect(await screen.findByText("User 1")).toBeInTheDocument();
    expect(screen.getByText(/out of/i)).toBeInTheDocument();
  });

  it("shows error state when fetch fails", async () => {
    (globalThis.fetch as Mock).mockResolvedValue({
      ok: false,
      json: async () => [],
    });

    renderTable();

    expect(await screen.findByText(/could not load users/i)).toBeInTheDocument();
  });

  it("changes page when Next is clicked", async () => {
    const users = makeUsers(12);
    (globalThis.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => users,
    });

    renderTable();

    expect(await screen.findByText("User 1")).toBeInTheDocument();
    expect(screen.queryByText("User 11")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /next page/i }));

    await waitFor(() => {
      expect(screen.getByText("User 11")).toBeInTheDocument();
    });
  });

  it("closes page-size dropdown on Escape and outside click", async () => {
    const users = makeUsers(12);
    (globalThis.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => users,
    });

    renderTable();
    await screen.findByText("User 1");

    // open dropdown
    fireEvent.click(screen.getByTestId("toggle-users-page-size"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    // reopen and close by outside click
    fireEvent.click(screen.getByTestId("toggle-users-page-size"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("opens row menu and closes on Escape/outside click", async () => {
    const users = makeUsers(12);
    (globalThis.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => users,
    });

    renderTable();
    await screen.findByText("User 1");

    const actionsButton = screen.getAllByTestId("users-action-menu-button");
    fireEvent.click(actionsButton[1]);

    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    fireEvent.click(actionsButton[1]);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});