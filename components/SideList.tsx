import React from "react";
import { useRouter } from "next/router";
import SideListItem from "./SideListItem";
import { v4 as uuidv4 } from "uuid";
import { defaultHistory } from "pages/api/Message";
import { ThemeContext } from "components/ThemeContext";
import { useContext } from "react";
import styled from "styled-components";

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
    const { theme } = useContext(ThemeContext);
    const StyledList = styled.div`
        background-color: ${theme.background};
        color: ${theme.text};
        padding: 0.75rem 0.5rem;
        color: ${theme.text};
        :hover {
            background-color: ${theme.backgroundSelected};
            cursor: pointer;
        }
    `;
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
    const handleNewChat = (event: React.MouseEvent<HTMLDivElement>) => {
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
        <div
            className="flex h-full flex-col overflow-y-auto select-none "
            style={{ background: theme.background }}
        >
            <StyledList onClick={handleNewChat}>开启新对话</StyledList>
            {items.map((item: Item) => (
                <div key={item.id}>
                    <SideListItem {...Props} item={item} theme={theme} />
                </div>
            ))}
        </div>
    );
};

export default SideList;
