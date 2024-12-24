/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

const Search = ({setParPage, searchValue, setSearchValue}) => {
    return (<div className="flex flex-wrap justify-start items-center gap-3">
        <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            required
            className="mr-5 rounded-md bg-white text-gray-600"
        >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
        </select>
        <input
            type="text"
            placeholder="Tìm kiếm..."
            className="input input-bordered w-full sm:w-[250px] md:w-[300px] lg:w-[420px] input-md bg-white border-gray-600 text-gray-600"
            onChange={(event) => setSearchValue(event.target.value)}
            value={searchValue}
        />
    </div>);
};

export default Search;
