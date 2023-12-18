"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { currentProfile } from "@/lib/current-profile";

const InviteServerModal = () => {
    const { isOpen, type, onClose, data, onOpen } = useModal();
    const origin = useOrigin();
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const isModalOpen = isOpen && type === "invite";
    const { server } = data;
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const handelClose = () => {
        onClose();
    };

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = async () => {
        try {
            setLoading(true);
            const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            onOpen("invite", { server: res.data });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handelClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Your Bro&apos;s
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server Invite Link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl}
                            disabled={loading}
                        />
                        <Button size="icon" disabled={loading} onClick={onCopy}>
                            {copied ? (
                                <Check className="w-4 h-4 text-green-500" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                    <Button
                        variant="link"
                        size="sm"
                        disabled={loading}
                        className="text-xs text-zinc mt-4"
                        onClick={onNew}
                    >
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteServerModal;
