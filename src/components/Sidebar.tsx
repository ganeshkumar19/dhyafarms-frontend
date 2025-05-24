import { Link, useLocation } from "react-router-dom";
import {
  Box,
  VStack,
  Link as ChakraLink,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";



const Sidebar = () => {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Ponds", path: "/ponds" },
    { name: "Devices", path: "/devices" },
    { name: "Profile", path: "/profile" },
    { name: "Support", path: "/support" },

  ];

  return (
    <>
      {/* Hamburger Icon for Small Screens */}
      <IconButton
        display={{ base: "block", lg: "none" }} // Show only on small screens
        position="absolute"
        top="0"
        right="20px"
        icon={<HamburgerIcon />}
        aria-label="Open menu"
        onClick={onOpen}
        bg="bgColor"
        color="white"
      />

      {/* Full Sidebar (Visible on Large Screens) */}
      <Box
        w="64"
        bg="bgColor"
        color="white"
        display={{ base: "none", lg: "flex" }} // Hide on small screens
        flexDirection="column"
        minH="100vh"
      >
        <Box p={4} fontSize="xl" fontWeight="bold" borderBottom="1px" borderColor="green.800">
          Dhya Farms
        </Box>
        <Box flex="1" p={4}>
          <VStack spacing={2} align="stretch">
            {navItems.map((item) => (
              <ChakraLink
                key={item.path}
                to={item.path}
                as={Link}
                px={3}
                py={2}
                rounded="md"
                _hover={{ bg: "green.800" }}
                bg={location.pathname === item.path ? "green.800" : undefined}
              >
                {item.name}
              </ChakraLink>
            ))}
          </VStack>
        </Box>
      </Box>

      {/* Drawer for Small Screens */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="bgColor" color="white">
          <DrawerCloseButton />
          <Box p={4} fontSize="xl" fontWeight="bold" borderBottom="1px" borderColor="green.800">
            Dhya Farms
          </Box>
          <DrawerBody>
            <VStack spacing={3} align="stretch">
              {navItems.map((item) => (
                <ChakraLink
                  key={item.path}
                  to={item.path}
                  as={Link}
                  px={3}
                  py={2}
                  rounded="md"
                  _hover={{ bg: "green.800" }}
                  bg={location.pathname === item.path ? "green.800" : undefined}
                  onClick={onClose} // Close drawer when link is clicked
                >
                  {item.name}
                </ChakraLink>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;