import { EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, FormControl, FormLabel, Input, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import EditPaymentMode from './EditPaymentMode';

function ViewPaymentMode({ data }) {
    const [isEditOpen, setIsEditOpen] = useState(false); // State to manage the edit drawer's open/close

    const handleEditClick = () => {
        setIsEditOpen(true); // Open the edit drawer when the button is clicked
    };


    return (
        <Flex direction="column">
            {isEditOpen ? ( // If isEditOpen is true, render EditPaymentMode
                <EditPaymentMode data={data} onClose={() => setIsEditOpen(false)} />
            ) : (
                <FormControl >
                    <FormLabel mt={5}>Payment Mode Name:</FormLabel>
                    <Input type="text" value={data.name} isReadOnly />
                    <FormLabel mt={5}>Description:</FormLabel>
                    <Input type="text" value={data.description} isReadOnly />
                    <SimpleGrid columns={2} spacing={10} mt={5}>
                        <Box>
                            <FormLabel>Is Default Mode?</FormLabel>
                            <Switch defaultChecked={data.is_default} isReadOnly />
                        </Box>
                        <Box>
                            <FormLabel>Mode Enabled</FormLabel>
                            <Switch defaultChecked={data.is_enabled} isReadOnly />
                        </Box>
                    </SimpleGrid>
                    <Button variant="outline" colorScheme='yellow' mt={5} onClick={handleEditClick}>
                        <EditIcon mr={2} />
                        Edit
                    </Button>
                </FormControl>
            )}
        </Flex>
    );

}

export default ViewPaymentMode;
