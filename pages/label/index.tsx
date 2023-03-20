import SplitView from "components/SplitView";
import SideList from "components/SideList";
import Welcome from "components/Welcome";
import Dialog from "components/Dialog";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LabelPage() {
    const router = useRouter();
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
        <SplitView
            leftContent={<SideList items={items} setItems={setItems} />}
            rightContent={<Welcome />}
        />
    );
}
