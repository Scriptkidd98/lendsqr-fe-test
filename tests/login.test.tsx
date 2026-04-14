import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import Login from "../src/pages/login/Login";

const renderLogin = () => {
	return render(
		<MemoryRouter>
			<Login />
		</MemoryRouter>
	);
};

describe("Login", () => {
	it("shows validation errors when the form is submitted empty", async () => {
		const user = userEvent.setup();

		renderLogin();

		await user.click(screen.getAllByTestId("login-button")[0]);

		expect(screen.getByText("Email field cannot be empty")).toBeInTheDocument();
		expect(screen.getByText("Password field cannot be empty")).toBeInTheDocument();
	});

	it("shows the invalid email format message for malformed email values", async () => {
		const user = userEvent.setup();

		renderLogin();

		await user.type(screen.getByLabelText(/email/i), "invalid-email");
		await user.type(screen.getByLabelText(/password/i), "password123");
		await user.click(screen.getAllByTestId("login-button")[0]);

		expect(screen.getByText("Email address is an invalid format")).toBeInTheDocument();
	});

	it("toggles the password field visibility when SHOW/HIDE is clicked", async () => {
		const user = userEvent.setup();

		renderLogin();

		const passwordInput = screen.getByLabelText(/password/i);

		expect(passwordInput).toHaveAttribute("type", "password");

		await user.click(screen.getAllByTestId("toggle-password-visibility")[0]);

		expect(passwordInput).toHaveAttribute("type", "text");

		await user.click(screen.getAllByTestId("toggle-password-visibility")[0]);

		expect(passwordInput).toHaveAttribute("type", "password");
	});

	it("disables the login button after a valid submission", async () => {
		const user = userEvent.setup();

		renderLogin();

		await user.type(screen.getByLabelText(/email/i), "grace@example.com");
		await user.type(screen.getByLabelText(/password/i), "password123");
		const submitButton = screen.getAllByTestId("login-button")[0];

		await user.click(submitButton);

		expect(submitButton).toBeDisabled();
	});
});
