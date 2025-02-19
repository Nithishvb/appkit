import { vi } from 'vitest'

import type { ChainAdapter } from '@reown/appkit-core'
import type { SdkVersion } from '@reown/appkit-core'

import { mainnet, sepolia, solana } from '../../src/networks/index.js'
import type { AppKitOptions } from '../../src/utils/index.js'

export const mockOptions: AppKitOptions & {
  sdkVersion: SdkVersion
  sdkType: string
} = {
  projectId: 'test-project-id',
  adapters: [
    {
      chainNamespace: 'eip155',
      construct: vi.fn(),
      syncConnectors: vi.fn(),
      setAuthProvider: vi.fn(),
      getAccounts: vi.fn().mockResolvedValue({ accounts: [{ address: '0x123', type: 'eoa' }] }),
      syncConnection: vi.fn().mockResolvedValue({
        chainId: 'eip155:1',
        address: '0x123'
      }),
      getBalance: vi.fn().mockResolvedValue({ balance: '0', symbol: 'ETH' }),
      getProfile: vi.fn().mockResolvedValue({}),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn()
    } as unknown as ChainAdapter
  ],
  networks: [mainnet, sepolia, solana],
  metadata: {
    name: 'Test App',
    description: 'Test App Description',
    url: 'https://test-app.com',
    icons: ['https://test-app.com/icon.png']
  },
  sdkVersion: `html-wagmi-5.1.6`,
  sdkType: 'appkit'
}
