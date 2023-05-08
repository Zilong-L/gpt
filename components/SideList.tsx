import React from "react";
import { useRouter } from "next/router";
import SideListItem from "./SideListItem";
import { v4 as uuidv4 } from "uuid";
import { defaultHistory } from "pages/api/Message";
import { ThemeContext } from "components/ThemeContext";
import { useContext } from "react";
import styled from "styled-components";
import UserMenu from "./UserMenu";

type Item = {
    label: string;
    id: string;
};

type SideListProps = {
    items: Item[];
    setItems: React.Dispatch<any>;
};

const StyledList = styled.div`
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    margin: 0.5rem 0.5rem;
    padding: 0.75rem 0.5rem;
    color: ${({ theme }) => theme.text};
    :hover {
        background-color: ${({ theme }) => theme.backgroundSelected};
        cursor: pointer;
    }
`;
const SideList: React.FC<SideListProps> = ({ items, setItems }) => {
    const router = useRouter();
    const { theme } = useContext(ThemeContext);

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
        const length = items.length;
        const newLabels = [{ id: id, label: `对话 ${length + 1}` }].concat(
            items
        );
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
            className="flex h-full select-none flex-col justify-between py-2  "
            style={{ background: theme.background }}
        >
            <div className="">
                <StyledList theme={theme} onClick={handleNewChat}>
                    开启新对话
                </StyledList>
            </div>
            <div className="flex-grow overflow-y-auto">
                {items.map((item: Item) => (
                    <div key={item.id} className="p-2">
                        <SideListItem {...Props} item={item} theme={theme} />
                    </div>
                ))}
            </div>
            <hr className="my-4 w-[90%] self-center border-t border-gray-300" />

            <div className="w-[95%] self-center">
                <UserMenu />
            </div>
        </div>
    );
};

export default SideList;
