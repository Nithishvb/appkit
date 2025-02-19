import * as React from 'react'

import { useAppKitState } from '@reown/appkit-new/react'

import { EthersModalInfo } from './Ethers/EthersModalInfo'
import { EthersTests } from './Ethers/EthersTests'
import { SolanaModalInfo } from './Solana/SolanaModalInfo'
import { SolanaTests } from './Solana/SolanaTests'

export function MultiChainTestsEthersSolana() {
  const { activeChain } = useAppKitState()

  return (
    <>
      {activeChain === 'eip155' ? (
        <React.Fragment>
          <EthersModalInfo />
          <EthersTests />
        </React.Fragment>
      ) : null}
      {activeChain === 'solana' ? (
        <React.Fragment>
          <SolanaModalInfo />
          <SolanaTests />
        </React.Fragment>
      ) : null}
    </>
  )
}
