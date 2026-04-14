import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import Login from "../src/pages/login/Login";
import PrivateRoutes from "../src/routes/private-routes/PrivateRoutes";
import PublicRoutes from "../src/routes/public-routes/PublicRoutes";
import User from "../src/pages/user/User";
import DashboardLayout from "../src/layouts/dashboard-layout/DashboardLayout";

const renderApp = (initialEntries: string[]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route
            path="dashboard/users"
            element={
              <DashboardLayout>
                <div>Users Dashboard</div>
              </DashboardLayout>
            }
          />
          <Route path="dashboard/users/:id" element={<User />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe("app flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("logs in and navigates into the protected dashboard", async () => {
    const user = userEvent.setup();

    renderApp(["/login"]);

    await user.type(screen.getByLabelText(/email/i), "grace@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText("Users Dashboard", {}, { timeout: 3000 })).toBeInTheDocument();
    expect(localStorage.getItem("auth")).toBe("true");
  });

  it("redirects unauthenticated users away from protected routes", async () => {
    renderApp(["/dashboard/users"]);

    expect(await screen.findByRole("heading", { name: /welcome/i })).toBeInTheDocument();
    expect(screen.queryByText("Users Dashboard")).not.toBeInTheDocument();
  });

  it("loads the correct user details from the route id", async () => {
    const users = [
      {
        id: "1",
        username: "Wrong User",
        email: "wrong@mail.com",
        phoneNumber: "08000000001",
      },
      {
        id: "2",
        username: "Correct User",
        email: "correct@mail.com",
        phoneNumber: "08000000002",
      },
    ];

    (globalThis.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => users,
    });

    localStorage.setItem(
      "selectedUserData",
      JSON.stringify({
        id: "999",
        username: "Stale User",
        email: "stale@mail.com",
        phoneNumber: "08000000999",
      })
    );
    localStorage.setItem("auth", "true");

    renderApp(["/dashboard/users/2"]);

    expect(await screen.findByRole("heading", { name: "Correct User" })).toBeInTheDocument();
    expect(screen.getByText("correct@mail.com")).toBeInTheDocument();
    expect(screen.queryByText("Stale User")).not.toBeInTheDocument();
    expect(screen.queryByText("Wrong User")).not.toBeInTheDocument();
  });

  it("logs out and redirects to login", async () => {
    const user = userEvent.setup();

    localStorage.setItem("auth", "true");

    renderApp(["/dashboard/users"]);

    expect(await screen.findByText("Users Dashboard")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(localStorage.getItem("auth")).toBeNull();
    expect(await screen.findByRole("heading", { name: /welcome/i })).toBeInTheDocument();
  });
});