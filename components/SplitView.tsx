import { useState, useEffect, useContext } from "react";
import Hamburger from "./Hamburger";
import { useRouter } from "next/router";
import { useSwipeable } from "react-swipeable";
import { ThemeContext } from "components/ThemeContext";
interface Props {
    leftContent: React.ReactNode;
    rightContent: React.ReactNode;
}

const SplitView: React.FC<Props> = ({ leftContent, rightContent }) => {
    const [showList, setShowList] = useState(false);
    const [swipeProgress, setSwipeProgress] = useState(0);
    const [dragging, setDragging] = useState(false);
    const router = useRouter();
    const { theme,toggleTheme} = useContext(ThemeContext);
    
    useEffect(() => {
        if (showList) {
            setSwipeProgress(80);
        } else {
            setSwipeProgress(0);
        }
    }, [showList]);
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
            if (swipeProgress < 70) {
                setShowList(false);
            }
            setDragging(false);
        },
        onSwiped: () => {
            if (showList) {
                setSwipeProgress(80);
            } else {
                setSwipeProgress(0);
            }
            setDragging(false);
        },
        onSwipedRight: () => {
            if (swipeProgress > 10) {
                setShowList(true);
            }
            setDragging(false);
            console.log("swiped right");
        },
        onSwiping: (event) => {
            if ((event.dir == "Left" || event.dir == "Right") && !showList) {
                setSwipeProgress(Math.min(Math.max(event.deltaX / 6, 0), 80));
                event.vxvy;
            } else if (
                (event.dir == "Left" || event.dir == "Right") &&
                showList
            ) {
                setSwipeProgress(
                    Math.min(Math.max(event.deltaX / 6 + 80, 0), 80)
                );
                console.log(Math.min(Math.max(event.deltaX / 6 + 80, 0), 80));
            } else if (event.dir == "Up" || event.dir == "Down") {
            }

            setDragging(true);
        },
        delta: 20,
        preventScrollOnSwipe: true,
    });
    const toggleMenu = () => {
        setShowList((show) => {
            if (show) {
                setSwipeProgress(0);
                return false;
            } else {
                setSwipeProgress(80);
                return true;
            }
        });
    };
    return (
        <div
            className={`hscreen_for_mobile flex flex-col overflow-hidden lg:flex-row ${
                !dragging && "duration-300"
            }`}
            {...handlers}
        >
            <div className=" z-20 h-full w-full lg:hidden ">
                <div className="fixed right-2 z-20">
                    <Hamburger isOpen={showList} toggle={toggleMenu} />
                </div>
                <div
                    className={`hscreen_for_mobile  absolute z-10 grid w-full grid-cols-10   lg:w-[300px] lg:translate-x-0 ${
                        showList && "shadow-2xl shadow-blue-100"
                    } ${!dragging && "transition-transform"}`}
                    style={{
                        transform: `translateX(${swipeProgress - 100}%)`,
                        gridTemplateRows: "repeat(10,1fr)",
                    }}
                >
                    <div
                        className="col-span-8 col-start-3 row-start-1 row-end-3 bg-black"
                        style={{ background: theme.banner }}
                    onClick={toggleTheme}

                    ></div>
                    <div className="col-span-8 col-start-3 row-start-3 row-end-[11]">
                        {leftContent}
                    </div>
                </div>
            </div>
            <div className="z-10 hidden h-full w-[300px]  lg:block ">
                {leftContent}
            </div>

            <div
                className={`relative block h-full w-full ${
                    !dragging && "transition-transform"
                }`}
            >
                <div
                    className={` pointer-events-none fixed z-10  h-full w-full  bg-black lg:hidden ${
                        !dragging && "transition-opacity"
                    } `}
                    style={{ opacity: `${swipeProgress / 2}%` }}
                ></div>

                {rightContent}
            </div>
        </div>
    );
};

export default SplitView;
