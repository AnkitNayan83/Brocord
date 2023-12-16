import { useEffect, useState } from "react";

interface ChatScrollProps {
    chatRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;
}

export const useChatScroll = ({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count,
}: ChatScrollProps) => {
    const [hasInitialize, setHaInitialize] = useState(false);

    useEffect(() => {
        const topDiv = chatRef?.current;

        const handelScroll = () => {
            const scrollTop = topDiv?.scrollTop;

            if (scrollTop === 0 && shouldLoadMore) {
                loadMore();
            }
        };
        topDiv?.addEventListener("scroll", handelScroll);

        return () => {
            topDiv?.removeEventListener("scroll", handelScroll);
        };
    }, [chatRef, shouldLoadMore, loadMore]);

    useEffect(() => {
        const topDiv = chatRef?.current;
        const bottomDiv = bottomRef?.current;

        const shouldAutoScroll = () => {
            if (!hasInitialize && bottomDiv) {
                setHaInitialize(true);
                return true;
            }

            if (!topDiv) {
                return false;
            }

            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

            return distanceFromBottom <= 100;
        };

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: "smooth",
                });
            }, 100);
        }
    }, [chatRef, bottomRef, count, loadMore]);
};
