"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import ActionTooltip from "../navigation/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
    const { onOpen } = useModal();
    console.log(channelType);
    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channels" && (
                <ActionTooltip label="Create Channel" side="top">
                    <button
                        className="text-zinc-500 hover:text-zinc-600 dakr:text-zinc-400 dark:hover:text-zinc-300 transition"
                        onClick={() => onOpen("createChanel", { server, channelType })}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label="Settings" side="top">
                    <button
                        className="text-zinc-500 hover:text-zinc-600 dakr:text-zinc-400 dark:hover:text-zinc-300 transition"
                        onClick={() => onOpen("members", { server })}
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
    );
};

export default ServerSection;
