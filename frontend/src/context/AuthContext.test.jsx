import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";
import api from "../api/axios";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const TestConsumer = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="user">{user?.username || "none"}</div>
      <button onClick={() => login("newuser", "password")}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("clears stale profile data when a new account logs in", async () => {
    localStorage.setItem("profile_extra", JSON.stringify({ bio: "old profile" }));

    api.post.mockResolvedValueOnce({ data: { access_token: "token-123" } });
    api.get.mockResolvedValueOnce({ data: { username: "newuser", email: "new@example.com" } });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("login"));

    await waitFor(() => {
      expect(localStorage.getItem("profile_extra")).toBeNull();
    });
  });
});
