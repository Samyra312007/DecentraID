import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WalletConnect } from '@/components/common/WalletConnect'

// Mock useDecentraID hook
const mockConnectWallet = jest.fn()
const mockDisconnectWallet = jest.fn()

jest.mock('@/hooks/useDecentraID', () => ({
  useDecentraID: () => ({
    address: null,
    connected: false,
    loading: false,
    connectWallet: mockConnectWallet,
    disconnectWallet: mockDisconnectWallet,
    chainId: null,
    isCorrectNetwork: false,
  }),
}))

// Mock web3 lib
jest.mock('@/lib/web3', () => ({
  connectWallet: jest.fn(),
}))

// Mock api client
jest.mock('@/lib/api', () => ({
  api: {
    setToken: jest.fn(),
    login: jest.fn(),
    resolveDID: jest.fn(),
  },
}))

describe('WalletConnect Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders connect prompt when disconnected', () => {
    render(<WalletConnect />)
    
    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument()
    expect(screen.getByText('Connect MetaMask')).toBeInTheDocument()
  })

  it('shows Wallet icon', () => {
    render(<WalletConnect />)
    
    const svg = document.querySelector('.lucide-wallet')
    expect(svg).toBeInTheDocument()
  })

  it('shows description text', () => {
    render(<WalletConnect />)
    
    expect(screen.getByText(/Connect your MetaMask wallet/)).toBeInTheDocument()
  })

  it('renders connect button', () => {
    render(<WalletConnect />)
    
    const button = screen.getByRole('button', { name: 'Connect MetaMask' })
    expect(button).toBeInTheDocument()
  })

  it('has correct button styling', () => {
    render(<WalletConnect />)
    
    const button = screen.getByRole('button', { name: 'Connect MetaMask' })
    expect(button).toHaveClass('bg-primary')
  })
})
