/* eslint-disable react/prop-types */

import icons from "../../assets/icons";

const Pagination = ({
                        currentPageNumber,
                        setCurrentPageNumber,
                        totalItem,
                        parPage,
                        showItem,
                    }) => {
    const {FaChevronLeft, FaChevronRight} = icons;

    let totalPage = Math.ceil(totalItem / parPage);
    let startPage = Math.max(currentPageNumber - Math.floor(showItem / 2), 1);
    let endPage = Math.min(startPage + showItem - 1, totalPage);

    if (endPage - startPage + 1 < showItem) {
        startPage = Math.max(endPage - showItem + 1, 1);
    }

    const createBtn = () => {
        const btns = [];
        for (let i = startPage; i <= endPage; i++) {
            btns.push(
                <li
                    className={`${
                        currentPageNumber === i
                            ? "bg-red-500 shadow-lg shadow-gray-600/50 text-white border"
                            : "bg-white hover:bg-gray-500 shadow-lg hover:shadow-gray-600/50 hover:text-white border"
                    } w-[45px] h-[40px] flex justify-center items-center cursor-pointer rounded-md border-2`}
                    onClick={() => setCurrentPageNumber(i)}
                >
                    {i}
                </li>
            );
        }
        return btns;
    };
    return (
        <ul className="flex">
            {currentPageNumber > 1 && (
                <li
                    onClick={() => setCurrentPageNumber(currentPageNumber - 1)}
                    className="w-[45px] h-[40px] rounded-md flex justify-center items-center bg-white text-white cursor-pointer border-2"
                >
                    <FaChevronLeft color="black"/>
                </li>
            )}
            {createBtn()}
            {currentPageNumber < totalPage && (
                <li
                    onClick={() => setCurrentPageNumber(currentPageNumber + 1)}
                    className="w-[45px] h-[40px] rounded-md flex justify-center items-center bg-white text-white cursor-pointer border-2"
                >
                    <FaChevronRight color="black"/>
                </li>
            )}
        </ul>
    );
};

export default Pagination;
