/* eslint-disable react/prop-types */
import icons from "../../assets/icons";

const Rating = ({rating}) => {
    const {FaStar, FaStarHalfAlt, CiStar} = icons;
    return (<>
        {rating >= 1 ? (<span className="text-[#EDBB0E]">
          <FaStar/>
        </span>) : rating >= 0.5 ? (<span className="text-[#EDBB0E]">
          <FaStarHalfAlt/>
        </span>) : (<span className="text-slate-600">
          <CiStar/>
        </span>)}
        {rating >= 2 ? (<span className="text-[#EDBB0E]">
          <FaStar/>
        </span>) : rating >= 1.5 ? (<span className="text-[#EDBB0E]">
          <FaStarHalfAlt/>
        </span>) : (<span className="text-slate-600">
          <CiStar/>
        </span>)}
        {rating >= 3 ? (<span className="text-[#EDBB0E]">
          <FaStar/>
        </span>) : rating >= 2.5 ? (<span className="text-[#EDBB0E]">
          <FaStarHalfAlt/>
        </span>) : (<span className="text-slate-600">
          <CiStar/>
        </span>)}
        {rating >= 4 ? (<span className="text-[#EDBB0E]">
          <FaStar/>
        </span>) : rating >= 3.5 ? (<span className="text-[#EDBB0E]">
          <FaStarHalfAlt/>
        </span>) : (<span className="text-slate-600">
          <CiStar/>
        </span>)}
        {rating >= 5 ? (<span className="text-[#EDBB0E]">
          <FaStar/>
        </span>) : rating >= 4.5 ? (<span className="text-[#EDBB0E]">
          <FaStarHalfAlt/>
        </span>) : (<span className="text-slate-600">
          <CiStar/>
        </span>)}
    </>);
};

export default Rating;
