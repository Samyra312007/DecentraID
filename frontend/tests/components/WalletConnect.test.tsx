import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WalletConnect } from '@/components/common/WalletConnect'

describe('WalletConnect Component', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  it('renders connect button', () => {
    render(<WalletConnect onClick={mockOnClick} />)
    
    expect(screen.getByText('Connect MetaMask')).toBeInTheDocument()
  })

  it('calls onClick when button is clicked', () => {
    render(<WalletConnect onClick={mockOnClick} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('shows connecting state while loading', () => {
    const slowOnClick = jest.fn(() => new Promise<void>(resolve => setTimeout(resolve, 100)))
    render(<WalletConnect onClick={slowOnClick} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByText('Connecting...')).toBeInTheDocument()
  })

  it('disables button while connecting', () => {
    const slowOnClick = jest.fn(() => new Promise<void>(resolve => setTimeout(resolve, 100)))
    render(<WalletConnect onClick={slowOnClick} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(button).toBeDisabled()
  })

  it('has correct styling classes', () => {
    render(<WalletConnect onClick={mockOnClick} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600')
    expect(button).toHaveClass('hover:bg-blue-700')
    expect(button).toHaveClass('text-white')
  })
})
