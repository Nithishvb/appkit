import { Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider } from '@chakra-ui/react'

import { useAppKitNetwork } from '@reown/appkit/react'

import { UpaEvmSignMessageTest } from './UpaEvmSignMessageTest'
import { UpaSolanaSignMessageTest } from './UpaSolanaSignMessageTest'

export function UpaTests() {
  const { caipNetwork } = useAppKitNetwork()

  return (
    <Card marginTop={10} marginBottom={10}>
      <CardHeader>
        <Heading size="md">Test Interactions</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading size="xs" textTransform="uppercase" pb="2">
              Sign Message
            </Heading>
            {caipNetwork?.chainNamespace === 'eip155' ? (
              <UpaEvmSignMessageTest />
            ) : (
              <UpaSolanaSignMessageTest />
            )}
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}
