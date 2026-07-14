import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock AuthContext (must match import path used by component)
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { username: 'testuser', full_name: 'Test User', email: 'test@example.com', created_at: new Date().toISOString() },
    loading: false
  })
}), { virtual: true });

// Mock api
vi.mock('../../api/axios', () => ({
  get: vi.fn(() => Promise.resolve({ data: { total_trips: 2, most_popular_destination: 'Paris' } })),
  put: vi.fn(() => Promise.resolve({ data: {} }))
}), { virtual: true });

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn(), dismiss: vi.fn() }
}), { virtual: true });

import ProfilePage from '../ProfilePage';

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders profile and allows editing & saving extras to localStorage', async () => {
    render(<ProfilePage />);

    // Wait for overview to render
    await waitFor(() => expect(screen.getByText(/My Profile/i)).toBeInTheDocument());

    // Click Edit Profile
    const editBtn = screen.getByText(/Edit Profile/i);
    fireEvent.click(editBtn);

    // Preferences tab should be active, find Interests input placeholder
    const interestsInput = await screen.findByPlaceholderText(/Add and press Enter/i);
    fireEvent.change(interestsInput, { target: { value: 'Hiking' } });
    fireEvent.keyDown(interestsInput, { key: 'Enter', code: 'Enter' });

    // Save
    const saveBtn = screen.getByText(/Save Changes/i);
    fireEvent.click(saveBtn);

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('profile_extra'));
      expect(stored).toBeTruthy();
      expect(stored.interests).toContain('Hiking');
    });
  });
});
