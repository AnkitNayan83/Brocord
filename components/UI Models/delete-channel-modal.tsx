"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";

const DeleteChannelModal = () => {
    const { isOpen, type, onClose, data } = useModal();
    const [loading, setLoading] = useState(false);
    const isModalOpen = isOpen && type === "deleteChannel";
    const { server, channel } = data;
    const router = useRouter();

    const handelClose = () => {
        onClose();
    };

    const onConfirm = async () => {
        try {
            setLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id,
                },
            });
            await axios.delete(url);

            router.refresh();
            onClose();
            window.location.reload();
            router.push(`/servers/${server?.id}`);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(true);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handelClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to delete{" "}
                        <span className="font-bold text-indigo-500">#{channel?.name}</span> ?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={loading}
                            onClick={() => {
                                handelClose();
                            }}
                            variant="ghost"
                        >
                            Cancel
                        </Button>

                        <Button
                            disabled={loading}
                            onClick={() => {
                                onConfirm();
                            }}
                            variant="primary"
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteChannelModal;
