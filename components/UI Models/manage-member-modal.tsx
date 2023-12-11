"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";
import {
    Check,
    Crown,
    Gavel,
    Loader2,
    MoreVertical,
    Shield,
    ShieldCheck,
    ShieldQuestion,
} from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import ActionTooltip from "../navigation/action-tooltip";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ServerWithMembersWithProfiles } from "@/types";

const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2" />,
    ADMIN: <Crown className="h-4 w-4 text-yellow-400" />,
};

const ManageMemberModal = () => {
    const { isOpen, type, onClose, data, onOpen } = useModal();
    const [loadingId, setLoadingId] = useState("");
    const router = useRouter();

    const isModalOpen = isOpen && type === "members";
    const { server } = data as { server: ServerWithMembersWithProfiles };

    const handelClose = () => {
        onClose();
    };

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                },
            });

            const response = await axios.delete(url);
            router.refresh();
            onOpen("members", { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId("");
        }
    };

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                },
            });
            const response = await axios.patch(url, { role });

            router.refresh();
            onOpen("members", { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId("");
        }
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
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="h-4 w-4 text-zinc-500" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex items-center">
                                                    <ShieldQuestion className="w-4 h-4 mr-2" />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onRoleChange(member.id, "GUEST")
                                                            }
                                                        >
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            Guest
                                                            {member.role === "GUEST" && (
                                                                <Check className="w-4 h-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onRoleChange(member.id, "MODERATOR")
                                                            }
                                                        >
                                                            <ShieldCheck className="h-4 w-4 mr-2" />
                                                            Moderator
                                                            {member.role === "MODERATOR" && (
                                                                <Check className="w-4 h-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onKick(member.id)}>
                                                <Gavel className="h-4 w-4 mr-2" />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ManageMemberModal;
