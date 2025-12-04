import React, { useState, useEffect } from 'react';
import { Button, Box, Text, VStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Icon } from '@chakra-ui/react';
import { FiDownload, FiSmartphone } from 'react-icons/fi';

interface PWAInstallButtonProps {
  variant?: 'button' | 'banner';
  onInstallSuccess?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'button',
  onInstallSuccess 
}) => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Check if already installed (running in standalone mode)
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                           (window.navigator as any).standalone ||
                           document.referrer.includes('android-app://');
    setIsStandalone(isStandaloneMode);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if install prompt is available
    const checkInstallPrompt = () => {
      setIsInstallable(!!(window as any).pwaInstallPrompt);
    };

    checkInstallPrompt();
    window.addEventListener('pwa-install-available', checkInstallPrompt);

    return () => {
      window.removeEventListener('pwa-install-available', checkInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS && !isStandalone) {
      // Show iOS installation instructions
      onOpen();
      return;
    }

    if ((window as any).installPWA) {
      try {
        await (window as any).installPWA();
        onInstallSuccess?.();
      } catch (error) {
        console.error('Install failed:', error);
      }
    }
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  // Don't show if not installable (and not iOS)
  if (!isInstallable && !isIOS) {
    return null;
  }

  if (variant === 'banner') {
    return (
      <>
        <Box
          bg="blue.500"
          color="white"
          p={3}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <VStack align="start" spacing={0} flex={1}>
            <Text fontWeight="bold" fontSize="sm">Install miFIN Lead App</Text>
            <Text fontSize="xs">Install the app for better experience and offline access</Text>
          </VStack>
          <Button
            size="sm"
            colorScheme="whiteAlpha"
            leftIcon={<FiDownload />}
            onClick={handleInstallClick}
            ml={2}
          >
            Install
          </Button>
        </Box>

        {/* iOS Installation Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Install on iOS</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="start" spacing={3}>
                <Text>To install this app on your iOS device:</Text>
                <Box>
                  <Text fontWeight="bold">1. Tap the Share button</Text>
                  <Text fontSize="sm" color="gray.600">
                    (The square with an arrow pointing up)
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">{`2. Scroll down and tap "Add to Home Screen"`}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">{`3. Tap "Add" to confirm`}</Text>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Got it!</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Button
        leftIcon={<Icon as={FiSmartphone} />}
        colorScheme="blue"
        variant="outline"
        size="sm"
        onClick={handleInstallClick}
      >
        Install App
      </Button>

      {/* iOS Installation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Install on iOS</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={3}>
              <Text>To install this app on your iOS device:</Text>
              <Box>
                <Text fontWeight="bold">1. Tap the Share button</Text>
                <Text fontSize="sm" color="gray.600">
                  (The square with an arrow pointing up)
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">{`2. Scroll down and tap "Add to Home Screen"`}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">{`3. Tap "Add" to confirm`}</Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Got it!</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PWAInstallButton;

