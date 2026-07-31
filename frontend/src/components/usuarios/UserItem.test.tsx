import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UserItem } from './UserItem';
import type { Usuario } from '@/types';

describe('UserItem Component', () => {
  const mockUser: Usuario = {
    id: '123',
    nombre: 'Ana Garcia',
    email: 'ana@example.com',
    activo: true,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  };

  it('renders user information correctly', () => {
    render(<UserItem user={mockUser} />);
    
    
    expect(screen.getByText('Ana Garcia')).toBeInTheDocument();
    
    
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
    
    
    expect(screen.getByText('Agente Inmobiliario')).toBeInTheDocument();
  });

  it('renders correct initials in avatar', () => {
    render(<UserItem user={mockUser} />);
    
    
    
    
    const initialsElements = screen.getAllByText('AG');
    expect(initialsElements.length).toBeGreaterThan(0);
  });

  it('formats joined date correctly', () => {
    render(<UserItem user={mockUser} />);
    
    
    
    expect(screen.getByText(/Desde .*2023/i)).toBeInTheDocument();
  });
});
