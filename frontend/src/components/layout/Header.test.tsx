import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';
import { useAuth } from '@/hooks/useAuth';


vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Header Component', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders branding', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, token: null, logout: mockLogout, login: vi.fn(), isLoading: false });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('RealEstatePro.')).toBeInTheDocument();
  });

  it('shows login button when user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, token: null, logout: mockLogout, login: vi.fn(), isLoading: false });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.queryByText('Salir')).not.toBeInTheDocument();
  });

  it('shows user name and logout button when authenticated', () => {
    const user = { id: '1', nombre: 'Juan', email: 'juan@test.com' } as any;
    vi.mocked(useAuth).mockReturnValue({ user, token: 'token', logout: mockLogout, login: vi.fn(), isLoading: false });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
    expect(screen.queryByText('Iniciar Sesión')).not.toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', () => {
    const user = { id: '1', nombre: 'Juan', email: 'juan@test.com' } as any;
    vi.mocked(useAuth).mockReturnValue({ user, token: 'token', logout: mockLogout, login: vi.fn(), isLoading: false });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('Salir');
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('renders back link when backUrl is provided', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, token: null, logout: mockLogout, login: vi.fn(), isLoading: false });

    render(
      <MemoryRouter>
        <Header backUrl="/test" backLabel="Volver de prueba" />
      </MemoryRouter>
    );

    expect(screen.getByText('Volver de prueba')).toBeInTheDocument();
    expect(screen.getByText('Volver de prueba').closest('a')).toHaveAttribute('href', '/test');
  });
});
