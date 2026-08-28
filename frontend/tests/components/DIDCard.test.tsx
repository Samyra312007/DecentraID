import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DIDCard } from '@/components/did/DIDCard'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
})

const mockDID = {
  id: 'did:decentraid:0x1234567890abcdef1234567890abcdef12345678',
  controller: '0xabcdef1234567890abcdef1234567890abcdef12',
  verificationMethod: [
    {
      id: 'did:decentraid:0x1234567890abcdef#key-1',
      type: 'EcdsaSecp256k1VerificationKey2019',
      controller: 'did:decentraid:0x1234567890abcdef',
      publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK',
    },
  ],
  authentication: ['did:decentraid:0x1234567890abcdef#key-1'],
  assertionMethod: ['did:decentraid:0x1234567890abcdef#key-1'],
  created: '2024-01-15T10:30:00Z',
  updated: '2024-01-20T14:45:00Z',
  status: 'active' as const,
}

describe('DIDCard Component', () => {
  it('renders DID document', () => {
    render(<DIDCard did={mockDID} />)
    
    expect(screen.getByText('Your Identity')).toBeInTheDocument()
    expect(screen.getByText('did:decentraid:0x1234567890abcdef1234567890abcdef12345678')).toBeInTheDocument()
  })

  it('displays controller address', () => {
    render(<DIDCard did={mockDID} />)
    
    expect(screen.getByText('Controller Address')).toBeInTheDocument()
    expect(screen.getByText('0xabcdef1234567890abcdef1234567890abcdef12')).toBeInTheDocument()
  })

  it('shows active status badge', () => {
    render(<DIDCard did={mockDID} />)
    
    expect(screen.getByText('active')).toBeInTheDocument()
  })

  it('shows verification methods', () => {
    render(<DIDCard did={mockDID} />)
    
    expect(screen.getByText('Verification Methods')).toBeInTheDocument()
    expect(screen.getByText('EcdsaSecp256k1VerificationKey2019')).toBeInTheDocument()
  })

  it('shows created and updated dates', () => {
    render(<DIDCard did={mockDID} />)
    
    expect(screen.getByText(/Created:/)).toBeInTheDocument()
    expect(screen.getByText(/Updated:/)).toBeInTheDocument()
  })

  it('copies DID to clipboard when copy button is clicked', () => {
    render(<DIDCard did={mockDID} />)
    
    const copyButtons = screen.getAllByText('📋')
    fireEvent.click(copyButtons[0])
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockDID.id)
  })

  it('shows suspended status with red badge', () => {
    const suspendedDID = { ...mockDID, status: 'suspended' as const }
    render(<DIDCard did={suspendedDID} />)
    
    expect(screen.getByText('suspended')).toBeInTheDocument()
  })
})
