/* eslint-disable react/prop-types */
import icons from "../../assets/icons";

const Rating = ({ rating, reviews = null }) => {
    const { FaStar, FaStarHalfAlt, CiStar } = icons;
    
    // Định nghĩa các lớp chung cho ngôi sao
    const starClass = "text-[#EDBB0E] text-xs md:text-sm inline-block transition-all duration-300 hover:scale-110";
    const emptyStarClass = "text-slate-300 text-xs md:text-sm inline-block transition-all duration-300 hover:scale-110"; 
    
    return (
        <div className="flex items-center gap-[2px]">
            <div className="flex items-center">
                {rating >= 1 ? (
                    <span className={starClass}>
                        <FaStar />
                    </span>
                ) : rating >= 0.5 ? (
                    <span className={starClass}>
                        <FaStarHalfAlt />
                    </span>
                ) : (
                    <span className={emptyStarClass}>
                        <CiStar />
                    </span>
                )}
                {rating >= 2 ? (
                    <span className={starClass}>
                        <FaStar />
                    </span>
                ) : rating >= 1.5 ? (
                    <span className={starClass}>
                        <FaStarHalfAlt />
                    </span>
                ) : (
                    <span className={emptyStarClass}>
                        <CiStar />
                    </span>
                )}
                {rating >= 3 ? (
                    <span className={starClass}>
                        <FaStar />
                    </span>
                ) : rating >= 2.5 ? (
                    <span className={starClass}>
                        <FaStarHalfAlt />
                    </span>
                ) : (
                    <span className={emptyStarClass}>
                        <CiStar />
                    </span>
                )}
                {rating >= 4 ? (
                    <span className={starClass}>
                        <FaStar />
                    </span>
                ) : rating >= 3.5 ? (
                    <span className={starClass}>
                        <FaStarHalfAlt />
                    </span>
                ) : (
                    <span className={emptyStarClass}>
                        <CiStar />
                    </span>
                )}
                {rating >= 5 ? (
                    <span className={starClass}>
                        <FaStar />
                    </span>
                ) : rating >= 4.5 ? (
                    <span className={starClass}>
                        <FaStarHalfAlt />
                    </span>
                ) : (
                    <span className={emptyStarClass}>
                        <CiStar />
                    </span>
                )}
            </div>
            {reviews !== null && (
                <span className="text-xs text-slate-500 ml-1">({reviews})</span>
            )}
        </div>
    );
};

export default Rating;
