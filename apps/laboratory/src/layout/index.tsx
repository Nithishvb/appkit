import type { ReactNode } from 'react'

import { Container } from '@chakra-ui/react'

import { LayoutHeader } from './LayoutHeader'

type Props = {
  children: ReactNode | ReactNode[]
}

export default function Layout({ children }: Props) {
  return (
    <Container maxW="100ch">
      <LayoutHeader />
      <main>{children}</main>
    </Container>
  )
}
