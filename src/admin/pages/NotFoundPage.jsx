import { Center, Container } from '@chakra-ui/react'
import React from 'react'

const NotFoundPage = () => {
  return (
    <Container bg="white" display="flex" zIndex={1}  minH="100vh" minW="100%">
      <Center>

        Error Page Not Found!
      </Center>
    </Container>
  )
}

export default NotFoundPage