import React, { useState } from "react";
import { useRouter } from "next/router";

type LabelProps = {
    item: { id: string; label: string };
    handleClick: (event: React.MouseEvent<HTMLDivElement>, id: string) => void;
    handleSave: (id: string, label: string) => void;
    handleDelete: (id: string) => void;
    theme:any
};

const Label: React.FC<LabelProps> = ({
    item,
    handleClick,
    handleSave,
    handleDelete,
    theme
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingLabel, setEditingLabel] = useState(item.label);
    const router = useRouter();
    const id = router.query.label;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsEditing(true);
        console.log('ref')

        if(inputRef.current){
            inputRef.current.focus();
        }
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
            className="flex justify-between p-2 hover:cursor-pointer  "
            style={{background:id===item.id?theme.backgroundSelected:"",color:theme.text}}
            onClick={handleRouter}
        >
                <input
                    ref={inputRef}
                    title="input"
                    type="text"
                    className={`w-full bg-transparent p-2   focus:outline-none  ${isEditing? 'block' : 'hidden'}`}
                    value={editingLabel}
                    onChange={handleInputChange}
                />
            
                <div className={`${isEditing? 'hidden' : 'block'} py-1 `}
                
                >{item.label}</div>
            

            <div className="flex items-center">
                {isEditing ? (
                    <div className="flex items-center">
                        <button
                            className="mr-2 rounded-md px-2 py-1   "
                            onClick={handleSaveClick}
                            
                        >
                            Save
                        </button>
                        <button
                            className="rounded-md px-2 py-1   "
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <button
                            className="mr-2 rounded-md px-2  py-1   "
                            onClick={handleEdit}
                        >
                            Edit
                        </button>
                        <button
                            className="rounded-md px-2 py-1   "
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
