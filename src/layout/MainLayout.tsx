import React from "react";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ColorModeToggle } from "@/components/ui/ColorModeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Dynamically set background color based on color mode
 

  return (
    <Grid
      templateColumns="repeat(6, 1fr)"
      bg="backgroundColor" // ✅ Background changes with mode
      minH="100vh"
      overflow="hidden" // ✅ Prevents horizontal scrolling
    >
      <GridItem
        as="aside"
        colSpan={{ base: 6, lg: 2, xl: 1 }}
        bg="bgColor"
        color="white"
        minH={{ lg: "100vh" }}
        p={{ base: "20px", lg: "30px" }}
      >
        <Sidebar />
      </GridItem>

      <GridItem
        as="section"
        colSpan={{ base: 6, lg: 4, xl: 5 }}
        p="10px"
        overflow="hidden"
        minW="0"
        display="flex"
        flexDirection="column"

      >
        {/* Color Mode Toggle Button (Top Right) */}
        <Box position="absolute" top={{ base: 34, md: 10, lg: 2 }} right={4} zIndex="1">
          <ColorModeToggle />
        </Box>
        {/* Header */}
        <Box as="header" w="full" shadow="sm" mt={10} mb={4}>
          <Header />
        </Box>

        {/* Scrollable main content */}
        <Box as="main" flex="1" overflowY="auto" p={4}>
          {children}
        </Box>

        {/* Footer */}
        <Box as="footer" borderTop="1px solid" borderColor="borderColor" mt={4} p={4}>
          <Footer />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default MainLayout;
