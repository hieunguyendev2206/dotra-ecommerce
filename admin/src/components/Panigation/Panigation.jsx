/* eslint-disable react/prop-types */

import icons from "../../assets/icons";

const Panigation = ({
                        currentPageNumber, setCurrentPageNumber, totalItem, parPage, showItem,
                    }) => {
    const {FaChevronLeft, FaChevronRight} = icons;

    let totalPage = Math.ceil(totalItem / parPage);
    let startPage = currentPageNumber;
    let dif = totalPage - currentPageNumber;

    if (dif <= showItem) {
        startPage = totalPage - showItem;
    }

    let endPage = startPage < 0 ? showItem : showItem + startPage;

    if (startPage <= 0) {
        startPage = 1;
    }

    const createBtn = () => {
        const btns = [];
        for (let i = startPage; i < endPage; i++) {
            btns.push(<li
                className={`${currentPageNumber === i ? "bg-black shadow-lg shadow-gray-600/20 text-white rounded mr-2" : "bg-white hover:bg-black shadow-lg hover:shadow-white/50 hover:text-white rounded mr-2"} w-[45px] h-[40px] flex justify-center items-center cursor-pointer`}
                onClick={() => setCurrentPageNumber(i)}
            >
                {i}
            </li>);
        }
        return btns;
    };
    return (<ul className="flex">
        {currentPageNumber > 1 && (<li
            onClick={() => setCurrentPageNumber(currentPageNumber - 1)}
            className="w-[45px] h-[40px] flex justify-center items-center bg-white text-white cursor-pointer rounded mr-2"
        >
            <FaChevronLeft color="black"/>
        </li>)}
        {createBtn()}
        {currentPageNumber < totalPage && (<li
            onClick={() => setCurrentPageNumber(currentPageNumber + 1)}
            className="w-[45px] h-[40px] flex justify-center items-center bg-white text-white cursor-pointer rounded mr-2"
        >
            <FaChevronRight color="black"/>
        </li>)}
    </ul>);
};

export default Panigation;
