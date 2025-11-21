import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

export function Provider({ children }) {
  return (
    <ChakraProvider value={defaultSystem}>
      {children}
    </ChakraProvider>
  );
}

