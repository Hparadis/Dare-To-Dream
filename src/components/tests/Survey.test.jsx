import { vi } from 'vitest'
vi.mock('../../api', () => ({
    submitSurvey: vi.fn().mockResolvedValue({ status: 'success' })
  }))

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Survey from "../../pages/Survey";
import { UserContext } from "../../context/UserContext";
import Home from "../../pages/Home";
// ✅ Mock context using Vitest's vi.fn()
const MockUserProvider = ({ children }) => (
  <UserContext.Provider
    value={{
      userId: "test-user",
      userName: "Tester",
      setUserName: vi.fn(),               // 👈 vi instead of jest
      setUserDescription: vi.fn(),        // 👈 vi instead of jest
      isAuthReady: true,
      db: null,
      auth: null,
    }}
  >
    {children}
  </UserContext.Provider>
);

  test("Survey > submits the survey form and redirects to /home", async () => {
     const HomeMock = () => <div data-testid="home-page">Home Page</div>;
  render(
    <MemoryRouter initialEntries={["/survey"]}>
      <MockUserProvider>
        <Routes>
          <Route path="/survey" element={<Survey />} />
          <Route path="/home" element={<HomeMock />} />
        </Routes>
      </MockUserProvider>
    </MemoryRouter>
  );

  // Step 0: Select Problem
  fireEvent.mouseDown(screen.getByLabelText(/problem/i));
  const problemOption = await screen.findByText("Anxiety");
  fireEvent.click(problemOption);
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  // Step 1: Select Cause
  fireEvent.mouseDown(screen.getByLabelText(/cause/i));
  const causeOption = await screen.findByText("Relationship");
  fireEvent.click(causeOption);
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  // Step 2: Time Period
  fireEvent.change(screen.getByLabelText(/time period/i), {
    target: { value: "2 months" },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  // Step 3: Effect
  fireEvent.change(screen.getByLabelText(/effect/i), {
    target: { value: "Low energy and sadness" },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  // Step 4: Name and Description
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "Test User" },
  });
  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: "Just testing the survey" },
  });

  fireEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => {
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });
      
});
