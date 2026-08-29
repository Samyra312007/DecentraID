import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DIDCard } from '@/components/did/DIDCard'

const mockDID = {
  id: 'did:decentraid:0x1234567890abcdef',
  did: 'did:decentraid:0x1234567890abcdef1234567890abcdef12345678',
  name: 'My Identity',
  controller: '0xabcdef1234567890abcdef1234567890abcdef12',
  verification_methods: ['did:decentraid:0x1234567890abcdef#key-1'],
  authentication: ['did:decentraid:0x1234567890abcdef#key-1'],
  assertionMethod: ['did:decentraid:0x1234567890abcdef#key-1'],
  services: [
    {
      id: 'messaging',
      type: 'MessagingService',
      serviceEndpoint: 'https://example.com/messaging',
    },
  ],
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-20T14:45:00Z',
  status: 'active' as const,
}

describe('DIDCard Component', () => {
  it('renders DID name', () => {
    render(<DIDCard did={mockDID} />)
    expect(screen.getByText('My Identity')).toBeInTheDocument()
  })

  it('shows truncated DID string', () => {
    render(<DIDCard did={mockDID} />)
    // The component renders: did.did.slice(0, 20) + "..." inside a <p>
    const didText = screen.getByText((content) =>
      content.includes('did:decentraid:0x123') && content.includes('...')
    )
    expect(didText).toBeInTheDocument()
  })

  it('shows active status badge', () => {
    render(<DIDCard did={mockDID} />)
    expect(screen.getByText('active')).toBeInTheDocument()
  })

  it('shows controller address', () => {
    render(<DIDCard did={mockDID} />)
    expect(screen.getByText('Controller')).toBeInTheDocument()
    // The component renders: controller.slice(0, 8) + "..." + controller.slice(-6)
    const controllerText = screen.getByText((content) =>
      content.includes('0xabcdef') && content.includes('cdef12')
    )
    expect(controllerText).toBeInTheDocument()
  })

  it('shows created date', () => {
    render(<DIDCard did={mockDID} />)
    expect(screen.getByText('Created')).toBeInTheDocument()
  })

  it('shows services count', () => {
    render(<DIDCard did={mockDID} />)
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn()
    render(<DIDCard did={mockDID} onSelect={onSelect} />)

    const card = document.querySelector('.card')!
    fireEvent.click(card)

    expect(onSelect).toHaveBeenCalledWith(mockDID)
  })

  it('renders without onSelect callback', () => {
    render(<DIDCard did={mockDID} />)
    expect(screen.getByText('My Identity')).toBeInTheDocument()
  })

  it('shows Unnamed DID when name is missing', () => {
    const noNameDid = { ...mockDID, name: undefined }
    render(<DIDCard did={noNameDid} />)
    expect(screen.getByText('Unnamed DID')).toBeInTheDocument()
  })

  it('shows suspended status', () => {
    const suspendedDID = { ...mockDID, status: 'suspended' as const }
    render(<DIDCard did={suspendedDID} />)
    expect(screen.getByText('suspended')).toBeInTheDocument()
  })

  it('shows deactivated status', () => {
    const deactivatedDID = { ...mockDID, status: 'deactivated' as const }
    render(<DIDCard did={deactivatedDID} />)
    expect(screen.getByText('deactivated')).toBeInTheDocument()
  })

  it('does not show services section when no services', () => {
    const noServicesDid = { ...mockDID, services: [] }
    render(<DIDCard did={noServicesDid} />)
    expect(screen.queryByText('Services')).not.toBeInTheDocument()
  })

  it('shows multiple services count', () => {
    const multiServicesDid = {
      ...mockDID,
      services: [
        { id: 'messaging', type: 'MessagingService', serviceEndpoint: 'https://example.com/msg' },
        { id: 'storage', type: 'StorageService', serviceEndpoint: 'https://example.com/storage' },
      ],
    }
    render(<DIDCard did={multiServicesDid} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
