import { useState } from "react";

interface Props {
    leftContent: React.ReactNode;
    rightContent: React.ReactNode;
}

const SplitView: React.FC<Props> = ({ leftContent, rightContent }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [splitPosition, setSplitPosition] = useState(20);

    const handleMouseDown = () => {
        setIsDragging(true);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
        event.preventDefault();
        const containerWidth =
            document.getElementById("split-view-container")?.offsetWidth || 0;
        const splitPositionPx = Math.max(
            Math.min(event.clientX, containerWidth - 100),
            100
        );
        const splitPositionPercent = (splitPositionPx / containerWidth) * 100;
        setSplitPosition(splitPositionPercent);
    };

    return (
        <div className="flex h-screen flex-col">
            <div className="flex-shrink-0 flex-grow" id="split-view-container">
                <div className="flex h-full w-full">
                    {/* <div className="h-full w-full" style={{ flex: `${splitPosition}%` }}>
            {leftContent}
          </div> */}
                    <div className="h-full w-64">{leftContent}</div>
                    <div className="h-full bg-slate-50 hover:cursor-grab">
                        {/* Split line */}
                    </div>
                    <div
                        className="relative h-full w-full"
                        style={{ flex: `${100 - splitPosition}%` }}
                    >
                        {rightContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplitView;
