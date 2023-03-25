import SplitView from "components/SplitView";
import SideList from "components/SideList";
import Dialog from "components/Dialog";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function LabelPage() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        let storageItems = localStorage.getItem("gpt-labels");
        if (storageItems == null) {
            localStorage.setItem("gpt-labels", JSON.stringify(items));
            return;
        }
        const itemJson = JSON.parse(storageItems);
        if (itemJson != null) {
            setItems(itemJson);
        }
    }, []);

    return (
        <div>
            <ToastContainer />
            <SplitView
                leftContent={<SideList items={items} setItems={setItems} />}
                rightContent={<Dialog />}
            />
        </div>
    );
}
