import { HuobiWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana } from '@reown/appkit-new/networks'
import { createAppKit } from '@reown/appkit-new/react'

import { AppKitButtons } from '../../components/AppKitButtons'
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
  defaultNetwork: solana,
  projectId: ConstantsUtil.ProjectId,
  metadata: ConstantsUtil.Metadata,
  features: {
    socials: [],
    emailShowWallets: false
  }
})

ThemeStore.setModal(modal)

export default function Solana() {
  return (
    <>
      <AppKitButtons />
      <SolanaTests />
    </>
  )
}
