'use client'

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";

interface Props {
    children: React.ReactNode;
    title?: string;
    isOpen: boolean;
    onOpenChange?: ((isOpen: boolean) => void) | undefined;
    onOpen: () => void
}

export default function MyModal(props: Props) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{props.title}</ModalHeader>
                            <ModalBody>
                                {props.children}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
