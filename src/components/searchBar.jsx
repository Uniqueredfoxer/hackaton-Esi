const SearchBar = () => {
    return (
        <div className="w-full max-w-2xl my-8 flex flex-col items-center md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <input
                type="search"
                placeholder="Rechercher par annee, module, mot-cle..."
                className="w-[80%] py-2 px-4 rounded-full focus:outline-none focus:border focus:border-[#bdbdbd25] bg-[#222] text-gray-300"
            />
            <button className="w-[25%] px-4 py-2 flex justify-center items-center rounded-[10px] bg-[hsl(0_0%_90%)] text-black hover:bg-[hsl(0_0%_80%)] transition-colors duration-300 ease-in-out md:w-auto">
                Search
            </button>
        </div>
    );
}
export default SearchBar;