import React from "react";
import { useRouter } from "next/router";
import SideListItem from "./SideListItem";
import { v4 as uuidv4 } from "uuid";
import { defaultHistory } from "pages/api/Message";

type Item = {
    label: string;
    id: string;
};

type SideListProps = {
    items: Item[];
    setItems: React.Dispatch<any>;
};

const SideList: React.FC<SideListProps> = ({ items, setItems }) => {
    const router = useRouter();
    if (!items) {
        return <></>;
    }

    const handleClick = (
        event: React.MouseEvent<HTMLDivElement>,
        id: string
    ) => {
        event.preventDefault();
        router.push(`/label/${id}`);
    };
    const handleSave = (id: string, newLabel: string) => {
        const list = localStorage.getItem("gpt-labels");
        if (list) {
            const parsedList = JSON.parse(list);
            const updatedList = parsedList.map((item: any) => {
                if (item.id === id) {
                    return {
                        ...item,
                        label: newLabel,
                    };
                }
                return item;
            });
            localStorage.setItem("gpt-labels", JSON.stringify(updatedList));
            setItems(updatedList);
        }
    };
    const handleDelete = (id: string) => {
        const newLabels = items.filter((e) => e.id != id);
        localStorage.setItem("gpt-labels", JSON.stringify(newLabels));
        localStorage.removeItem(id);
        console.log(newLabels);
        router.push(`/label/${newLabels.length ? newLabels[0].id : ""}`);
        console.log(`/label/${newLabels.length ? newLabels[0].id : ""}`);
        setItems(newLabels);
    };
    const handleNewChat = (event: React.MouseEvent<HTMLButtonElement>) => {
        const id = uuidv4();
        const newLabels = [{ id: id, label: "New Chat" }].concat(items);
        localStorage.setItem("gpt-labels", JSON.stringify(newLabels));
        localStorage.setItem(id, JSON.stringify(defaultHistory));
        setItems(newLabels);
        router.push(`/label/${id}`);
    };
    const Props = {
        handleClick,
        handleSave,
        handleDelete,
    };
    return (
        <div className="flex h-full flex-col bg-neutral-600">
            <div className="py-2 hover:cursor-pointer hover:bg-neutral-700">
                <button
                    onClick={handleNewChat}
                    className="flex w-full  rounded-md px-2 py-1 text-teal-200  "
                >
                    New Chat
                </button>
            </div>
            {items.map((item: Item) => (
                <div key={item.id}>
                    <SideListItem {...Props} item={item} />
                </div>
            ))}
        </div>
    );
};

export default SideList;
