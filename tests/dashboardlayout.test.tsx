import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, afterEach } from "vitest";
import DashboardLayout from "../src/layouts/dashboard-layout/DashboardLayout";
import "@testing-library/jest-dom/vitest";

const renderLayout = () => render(
  <MemoryRouter initialEntries={["/dashboard"]}>
    <DashboardLayout>
      <div>Child Content</div>
    </DashboardLayout>
  </MemoryRouter>
);


describe("DashboardLayout interactions", () => {
  afterEach(() => {
    cleanup(); 
  });

  it("renders children", () => {
    renderLayout();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("focuses search input on Ctrl/Cmd+K", () => {
    renderLayout();
    const input = screen.getByTestId("dashboard-search-input");
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(input).toHaveFocus();
  });

  it("toggles side nav with hamburger", () => {
    renderLayout();
    const hamburger = screen.getByTestId("dashboard-hamburger-button");
    const sideNav = screen.getByTestId("dashboard-side-nav");

    expect(sideNav).toHaveAttribute("data-state", "closed");
    fireEvent.click(hamburger);
    expect(sideNav).toHaveAttribute("data-state", "open");
    fireEvent.click(hamburger);
    expect(sideNav).toHaveAttribute("data-state", "closed");
  });

  it("closes side nav on backdrop click", () => {
    renderLayout();
    const hamburger = screen.getByTestId("dashboard-hamburger-button");
    const sideNav = screen.getByTestId("dashboard-side-nav");
    const backdrop = screen.getByTestId("dashboard-backdrop");

    fireEvent.click(hamburger);
    expect(sideNav).toHaveAttribute("data-state", "open");

    fireEvent.click(backdrop);
    expect(sideNav).toHaveAttribute("data-state", "closed");
  });

  it("opens and closes user menu (outside click + Escape)", () => {
    renderLayout();
    const userMenuButton = screen.getByTestId("dashboard_user_menu_button");
  
    fireEvent.click(userMenuButton);
    const userMenu = screen.getByTestId("dashboard-user-menu");
    expect(userMenuButton).toHaveAttribute("aria-expanded", "true");
    expect(userMenu).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(userMenuButton).toHaveAttribute("aria-expanded", "false");
    expect(userMenu).not.toBeInTheDocument();

    fireEvent.click(userMenuButton);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(userMenuButton).toHaveAttribute("aria-expanded", "false");
    expect(userMenu).not.toBeInTheDocument();
  });
});