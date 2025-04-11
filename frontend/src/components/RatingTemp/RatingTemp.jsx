/* eslint-disable react/prop-types */
import icons from "../../assets/icons";

const RatingTemp = ({ratingTemp}) => {
    const {AiFillStar, CiStar} = icons;
    
    // Tạo classes chung cho responsive
    const filledStarClass = "text-[#EDBB0E] text-base sm:text-sm";
    const emptyStarClass = "text-slate-300 text-base sm:text-sm";
    
    if (ratingTemp === 5) {
        return (
            <>
                <span className={filledStarClass}>
                    <AiFillStar/>
                </span>
                <span className={filledStarClass}>
                    <AiFillStar/>
                </span>
                <span className={filledStarClass}>
                    <AiFillStar/>
                </span>
                <span className={filledStarClass}>
                    <AiFillStar/>
                </span>
                <span className={filledStarClass}>
                    <AiFillStar/>
                </span>
            </>
        );
    } else if (ratingTemp === 4) {
        return (
            <>
                <span className={filledStarClass}>
                  <AiFillStar/>
                </span>
                <span className={filledStarClass}>
                  <AiFillStar/>
                </span>
                <span className={filledStarClass}>
                  <AiFillStar/>
                </span>
                <span className={filledStarClass}>
                  <AiFillStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
            </>
        );
    } else if (ratingTemp === 3) {
        return (
            <>
                <span className={filledStarClass}>
                  <AiFillStar/>
                </span>
                <span className={filledStarClass}>
                  <AiFillStar/>
                </span>
                <span className={filledStarClass}>
                  <AiFillStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
            </>
        );
    } else if (ratingTemp === 2) {
        return (
            <>
                <span className={filledStarClass}>
                  <AiFillStar/>
                </span>
                <span className={filledStarClass}>
                  <AiFillStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
            </>
        );
    } else if (ratingTemp === 1) {
        return (
            <>
                <span className={filledStarClass}>
                  <AiFillStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
            </>
        );
    } else {
        return (
            <>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
                <span className={emptyStarClass}>
                  <CiStar/>
                </span>
            </>
        );
    }
};

export default RatingTemp;
