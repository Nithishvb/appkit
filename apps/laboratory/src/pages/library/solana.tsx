import { HuobiWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { createAppKit } from '@reown/appkit/react'

import { AppKitButtons } from '../../components/AppKitButtons'
import { SolanaModalInfo } from '../../components/Solana/SolanaModalInfo'
import { SolanaTests } from '../../components/Solana/SolanaTests'
import { ConstantsUtil } from '../../utils/ConstantsUtil'
import { ThemeStore } from '../../utils/StoreUtil'

const networks = ConstantsUtil.SolanaNetworks

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new HuobiWalletAdapter(), new SolflareWalletAdapter()]
})

const modal = createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks,
  projectId: ConstantsUtil.ProjectId,
  features: {
    analytics: true
  },
  metadata: ConstantsUtil.Metadata
})

ThemeStore.setModal(modal)

export default function MultiChainSolanaAdapterOnly() {
  return (
    <>
      <AppKitButtons />
      <SolanaModalInfo />
      <SolanaTests />
    </>
  )
}
