import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../../pages/Home";
import { UserContext } from "../../context/UserContext";

vi.mock("@mui/material/useMediaQuery", () => ({
  __esModule: true,
  default: () => true,
}));

vi.mock("../../api/firebaseApi", () => ({
  fetchGroups: vi.fn().mockResolvedValue([
    { groupId: "g1", groupName: "Test Group", memberCount: 1 },
  ]),
  fetchCommunities: vi.fn().mockResolvedValue([
    { communityId: "c1", communityName: "Test Community", memberCount: 2 },
  ]),
  getInitialFriends: vi.fn().mockResolvedValue([]),
}));

const MockUserProvider = ({ children }) => (
  <UserContext.Provider
    value={{
      userId: "test-user",
      userName: "Tester",
      userDescription: "Desc",
      isAuthReady: true,
      setUserName: vi.fn(),
      setUserDescription: vi.fn(),
      db: null,
      auth: null,
    }}
  >
    {children}
  </UserContext.Provider>
);

describe("Home Page", () => {
  test("renders sidebar buttons and loads data", async () => {
    render(
      <MemoryRouter>
        <MockUserProvider>
          <Home />
        </MockUserProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const api = require("../../api/firebaseApi");
      expect(api.fetchGroups).toHaveBeenCalled();
      expect(api.fetchCommunities).toHaveBeenCalled();
      expect(api.getInitialFriends).toHaveBeenCalled();
    });

    expect(screen.getByText(/groups/i)).toBeInTheDocument();
    expect(screen.getByText(/communities/i)).toBeInTheDocument();
    expect(screen.getByText(/friends/i)).toBeInTheDocument();
  });

  test("clicking Groups shows the group overlay", async () => {
    render(
      <MemoryRouter>
        <MockUserProvider>
          <Home />
        </MockUserProvider>
      </MemoryRouter>
    );

    // Find the Groups button (using case-insensitive match)
    const groupButtons = screen.getAllByText(/groups/i);
    fireEvent.click(groupButtons[0]);

    // Wait for "Test Group" text to appear, with flexible regex matcher
    const groupOverlay = await screen.findByText(/Test Group/i);
    expect(groupOverlay).toBeVisible();

    // For debugging, you can log the DOM if test still fails:
    // console.log(screen.debug());
  });
});
