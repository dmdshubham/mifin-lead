import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Badge,
  Flex,
  Textarea,
  Select,
} from '@chakra-ui/react';
import { useOffline } from '@mifin/hooks/OfflineContext';
import { saveLead, addPendingAction } from '@mifin/utils/indexedDB';
import { useAppDispatch } from '@mifin/redux/hooks';
import { manageNewLead } from '@mifin/redux/service/manageNewLead/api';
import { MASTER_PAYLOAD } from '@mifin/ConstantData/apiPayload';

interface OfflineLeadFormData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  loanAmount: string;
  source: string;
  notes: string;
}

export const OfflineLeadForm: React.FC<{ onSuccess?: () => void; onCancel?: () => void }> = ({
  onSuccess,
  onCancel,
}) => {
  const { isOnline, refreshPendingCount } = useOffline();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OfflineLeadFormData>({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    loanAmount: '',
    source: 'OFFLINE_ENTRY',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      toast({
        title: 'First name is required',
        status: 'error',
        duration: 3000,
      });
      return false;
    }

    if (!formData.lastName.trim()) {
      toast({
        title: 'Last name is required',
        status: 'error',
        duration: 3000,
      });
      return false;
    }

    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      toast({
        title: 'Valid mobile number is required',
        status: 'error',
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const leadPayload = {
        ...MASTER_PAYLOAD,
        requestData: {
          leadGenerateFormVO: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            mobile: formData.mobile,
            email: formData.email,
            loanAmount: formData.loanAmount,
            source: formData.source,
            notes: formData.notes,
            offlineCreated: !isOnline,
            createdTimestamp: new Date().toISOString(),
          },
        },
      };

      if (isOnline) {
        // Submit directly if online
        const response = await dispatch(manageNewLead(leadPayload));

        if (response.payload?.responseData?.error?.toLowerCase() === 's') {
          toast({
            title: 'Lead created successfully',
            description: `Lead ID: ${response.payload.responseData.leadid}`,
            status: 'success',
            duration: 5000,
          });

          // Reset form
          setFormData({
            firstName: '',
            lastName: '',
            mobile: '',
            email: '',
            loanAmount: '',
            source: 'OFFLINE_ENTRY',
            notes: '',
          });

          if (onSuccess) onSuccess();
        } else {
          throw new Error(response.payload?.responseData?.errorMessage || 'Failed to create lead');
        }
      } else {
        // Save offline if not online
        const localLeadId = `offline-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        await saveLead(localLeadId, leadPayload, false);
        await addPendingAction('CREATE_LEAD', {
          ...leadPayload,
          localLeadId,
        });
        
        // Refresh pending count to trigger worklist update
        await refreshPendingCount();

        toast({
          title: 'Lead saved offline',
          description: 'Will be synced when you are back online',
          status: 'info',
          duration: 5000,
        });

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          mobile: '',
          email: '',
          loanAmount: '',
          source: 'OFFLINE_ENTRY',
          notes: '',
        });

        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: 'Error creating lead',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      {!isOnline && (
        <Badge colorScheme="orange" mb={4} p={2}>
          Offline Mode - Lead will be synced when online
        </Badge>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Mobile Number</FormLabel>
            <Input
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              maxLength={10}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Loan Amount</FormLabel>
            <Input
              name="loanAmount"
              type="number"
              value={formData.loanAmount}
              onChange={handleChange}
              placeholder="Enter loan amount"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Source</FormLabel>
            <Select name="source" value={formData.source} onChange={handleChange}>
              <option value="OFFLINE_ENTRY">Offline Entry</option>
              <option value="WALK_IN">Walk In</option>
              <option value="REFERRAL">Referral</option>
              <option value="WEBSITE">Website</option>
              <option value="OTHER">Other</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any additional notes"
              rows={4}
            />
          </FormControl>

          <Flex gap={3} mt={4}>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Saving..."
              flex={1}
            >
              {isOnline ? 'Create Lead' : 'Save Offline'}
            </Button>

            {onCancel && (
              <Button variant="outline" onClick={onCancel} flex={1}>
                Cancel
              </Button>
            )}
          </Flex>
        </VStack>
      </form>
    </Box>
  );
};

