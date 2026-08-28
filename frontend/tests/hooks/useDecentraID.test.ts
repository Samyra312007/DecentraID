import { renderHook, act } from '@testing-library/react'
import { useDecentraID } from '@/hooks/useDecentraID'

// Mock the API client
jest.mock('@/lib/api', () => ({
  api: {
    setToken: jest.fn(),
    login: jest.fn(),
    resolveDID: jest.fn(),
    listAssets: jest.fn(),
    getAnomalyAlerts: jest.fn(),
    mintAsset: jest.fn(),
    requestAccess: jest.fn(),
  },
}))

// Mock the web3 connector
jest.mock('@/lib/web3', () => ({
  connectWallet: jest.fn(),
}))

describe('useDecentraID Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useDecentraID())
    
    expect(result.current.did).toBeNull()
    expect(result.current.assets).toEqual([])
    expect(result.current.alerts).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.connected).toBe(false)
    expect(result.current.address).toBeNull()
  })

  it('returns connectWallet function', () => {
    const { result } = renderHook(() => useDecentraID())
    
    expect(typeof result.current.connectWallet).toBe('function')
  })

  it('returns disconnectWallet function', () => {
    const { result } = renderHook(() => useDecentraID())
    
    expect(typeof result.current.disconnectWallet).toBe('function')
  })

  it('returns fetchAssets function', () => {
    const { result } = renderHook(() => useDecentraID())
    
    expect(typeof result.current.fetchAssets).toBe('function')
  })

  it('returns fetchAlerts function', () => {
    const { result } = renderHook(() => useDecentraID())
    
    expect(typeof result.current.fetchAlerts).toBe('function')
  })

  it('returns mintAsset function', () => {
    const { result } = renderHook(() => useDecentraID())
    
    expect(typeof result.current.mintAsset).toBe('function')
  })

  it('returns requestAccess function', () => {
    const { result } = renderHook(() => useDecentraID())
    
    expect(typeof result.current.requestAccess).toBe('function')
  })

  it('disconnectWallet clears all state', async () => {
    const { result } = renderHook(() => useDecentraID())
    
    act(() => {
      result.current.disconnectWallet()
    })
    
    expect(result.current.connected).toBe(false)
    expect(result.current.token).toBeNull()
    expect(result.current.address).toBeNull()
    expect(result.current.did).toBeNull()
    expect(result.current.assets).toEqual([])
    expect(result.current.alerts).toEqual([])
  })

  it('isCorrectNetwork returns false by default', () => {
    const { result } = renderHook(() => useDecentraID())
    
    expect(result.current.isCorrectNetwork).toBe(false)
  })
})
