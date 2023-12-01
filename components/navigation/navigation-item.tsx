"use client";

import Image from "next/image";
import ActionTooltip from "./action-tooltip";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

interface NavigatioItemProps {
    id: string;
    imageUrl: string;
    name: string;
}

const NavigatioItem = ({ id, imageUrl, name }: NavigatioItemProps) => {
    const params = useParams();
    const router = useRouter();

    const handelClick = () => {
        router.push(`/servers/${id}`);
    };

    return (
        <ActionTooltip side="right" align="center" label={name}>
            <button onClick={handelClick} className="group relative flex items-center">
                <div
                    className={cn(
                        "absolute left-0 bg-primary rounded-r-full transistion-all w-[4px]",
                        params?.serverId !== id && "group-hover:h-[20px]",
                        params?.serverId === id ? "h-[36px]" : "h-[8px]"
                    )}
                />
                <div
                    className={cn(
                        "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transistion-all overflow-hidden",
                        params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                    )}
                >
                    <Image src={imageUrl} fill alt="server img" />
                </div>
            </button>
        </ActionTooltip>
    );
};

export default NavigatioItem;
