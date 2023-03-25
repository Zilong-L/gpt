import React, { useState } from "react";
import { useRouter } from "next/router";

type LabelProps = {
    item: { id: string; label: string };
    handleClick: (event: React.MouseEvent<HTMLDivElement>, id: string) => void;
    handleSave: (id: string, label: string) => void;
    handleDelete: (id: string) => void;
};

const Label: React.FC<LabelProps> = ({
    item,
    handleClick,
    handleSave,
    handleDelete,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingLabel, setEditingLabel] = useState(item.label);
    const router = useRouter();
    const id = router.query.label;
    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsEditing(true);
        e.stopPropagation();
    };
    const handleRouter = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isEditing) {
            return;
        }
        handleClick(event, item.id);
    };
    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsEditing(false);
        setEditingLabel(item.label);
    };

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Handle delete click here
        handleDelete(item.id);
        e.stopPropagation();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditingLabel(event.target.value);
    };

    const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        handleSave(item.id, editingLabel);

        setIsEditing(false);
    };

    return (
        <div
            className={`flex justify-between p-2 hover:cursor-pointer hover:bg-neutral-700 ${
                id === item.id ? "bg-neutral-800" : ""
            }`}
            onClick={handleRouter}
        >
            {isEditing ? (
                <input
                    title="input"
                    type="text"
                    className="w-full bg-transparent p-2 text-teal-200 focus:outline-none"
                    value={editingLabel}
                    onChange={handleInputChange}
                />
            ) : (
                <div className="text-teal-200">{item.label}</div>
            )}

            <div className="flex items-center">
                {isEditing ? (
                    <div className="flex items-center">
                        <button
                            className="mr-2 rounded-md px-2 py-1 text-teal-200 hover:bg-neutral-600 hover:text-teal-100  "
                            onClick={handleSaveClick}
                        >
                            Save
                        </button>
                        <button
                            className="rounded-md px-2 py-1 text-teal-200 hover:bg-neutral-600 hover:text-teal-100"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <button
                            className="mr-2 rounded-md px-2  py-1 text-teal-200 hover:bg-neutral-600 hover:text-teal-100"
                            onClick={handleEdit}
                        >
                            Edit
                        </button>
                        <button
                            className="rounded-md px-2 py-1 text-teal-200 hover:bg-neutral-600 hover:text-teal-100"
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Label;
