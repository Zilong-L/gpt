import { useState, useEffect } from "react";
import Hamburger from "./Hamburger";
import { useRouter } from "next/router";
import { useSwipeable } from "react-swipeable";
interface Props {
    leftContent: React.ReactNode;
    rightContent: React.ReactNode;
}

const SplitView: React.FC<Props> = ({ leftContent, rightContent }) => {
    const [showList, setShowList] = useState(false);
    const [swipeProgress, setSwipeProgress] = useState(0);
    const [dragging, setDragging] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setSwipeProgress(0);
        setShowList(false);
    }, [router.query.label]);
    useEffect(() => {
        const setVhProperty = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        };

        setVhProperty();
        window.addEventListener("resize", setVhProperty);

        return () => {
            window.removeEventListener("resize", setVhProperty);
        };
    }, []);
    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (swipeProgress < 90) {
                setSwipeProgress(0);
                setShowList(false);
            } else {
                setSwipeProgress(100);
            }
            setDragging(false);
        },
        onSwiped: () => {
            if (!showList) {
                setSwipeProgress(0);
            } else {
                setSwipeProgress(100);
            }
            setDragging(false);
        },
        onSwipedRight: () => {
            if (swipeProgress > 10) {
                setSwipeProgress(100);
                setShowList(true);
            } else {
                setSwipeProgress(0);
            }
            setDragging(false);
        },
        onSwiping: (event) => {
            if ((event.dir == "Left" || event.dir == "Right") && !showList) {
                setSwipeProgress(Math.min(Math.max(event.deltaX / 6, 0), 100));
            } else if (
                (event.dir == "Left" || event.dir == "Right") &&
                showList
            ) {
                setSwipeProgress(
                    Math.min(Math.max(event.deltaX / 6 + 100, 0), 100)
                );
            } else if (event.dir == "Up" || event.dir == "Down") {
            }

            setDragging(true);
        },
        delta: 60,
        preventScrollOnSwipe: true,
    });
    const toggleMenu = () => {
        setShowList((show) => {
            if (show) {
                setSwipeProgress(0);
                return false;
            } else {
                setSwipeProgress(100);
                return true;
            }
        });
    };
    return (
        <div
            className="hscreen_for_mobile flex flex-col lg:flex-row "
            {...handlers}
        >
            <div className=" h-full w-full lg:hidden ">
                <div className="fixed right-2 z-20">
                    <Hamburger isOpen={showList} toggle={toggleMenu} />
                </div>
                <div
                    className={`absolute z-10 h-full w-full   lg:w-[300px] lg:translate-x-0 ${
                        dragging ? "" : "duration-150"
                    }`}
                    style={{
                        transform: `translateX(${swipeProgress - 100}%)`,
                        animation: "forwards",
                    }}
                >
                    {leftContent}
                </div>
            </div>
            <div className="z-10 hidden h-full w-[300px]  lg:block ">
                {leftContent}
            </div>
            <div className="relative block h-full w-full">{rightContent}</div>
        </div>
    );
};

export default SplitView;
