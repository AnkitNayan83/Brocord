"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy, Crown, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import ActionTooltip from "../navigation/action-tooltip";

const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2" />,
    ADMIN: <Crown className="h-4 w-4 text-yellow-400" />,
};

const ManageMemberModal = () => {
    const { isOpen, type, onClose, data, onOpen } = useModal();

    const isModalOpen = isOpen && type === "members";
    const { server } = data;

    const handelClose = () => {
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handelClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Member&apos;s
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.Member.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.Member?.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.profile.name}
                                    <ActionTooltip label={member.role}>
                                        {roleIconMap[member.role]}
                                    </ActionTooltip>
                                </div>
                                <p className="text-xs text-zinc-500">{member.profile.email}</p>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ManageMemberModal;
