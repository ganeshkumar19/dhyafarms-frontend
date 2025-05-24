import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";

import SidebarNav from "@/components/dashboard/SidebarNav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardFooter from "@/components/dashboard/DashboardFooter";

import { Outlet } from "react-router-dom"; // 👈 important

const DashboardLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "250px 1fr" }}
      minH="100vh"
      bg="backgroundColor"
      overflow="hidden"
    >
      {/* Sidebar (Visible on desktop) */}
      {hasMounted && isDesktop && (
        <GridItem
          as="aside"
          bg="bgColor"
          borderRight="1px solid"
          borderColor="gray.200"
          p={{ base: 4, lg: 6 }}
        >
          <SidebarNav isOpen={false} onClose={() => {}} />
        </GridItem>
      )}

      {/* Drawer Sidebar (Mobile) */}
      {!isDesktop && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="bgColor">
            <SidebarNav isOpen={isOpen} onClose={onClose} />
          </DrawerContent>
        </Drawer>
      )}

      {/* Main Content Area */}
      <GridItem
        as="section"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Header */}
        <Box as="header" w="full" shadow="sm" p={0}>
          <DashboardHeader onMenuClick={onOpen} />
        </Box>

        {/* Main Content */}
        <Box
          as="main"
          flex="1"
          overflowY="auto"
          px={{ base: 4, md: 6 }}
          py={4}
        >
          <Outlet /> {/* 👈 renders the nested route */}
        </Box>

        {/* Footer */}
        <Box
          as="footer"
          borderTop="1px solid"
          borderColor="gray.200"
          px={0}
          py={0}
          mt="auto"
        >
          <DashboardFooter />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default DashboardLayout;
