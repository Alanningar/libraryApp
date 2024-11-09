"use client";

function GenreSelector({ selectedGenre, setSelectedGenre }) {
    const handleChange = (e) => {
        const genre = e.target.value;
        console.log('Selected Genre:', genre);
        setSelectedGenre(genre);
    };

    return (
        <div className="SelectorDiv">
            <select className="Selector" value={selectedGenre} onChange={handleChange}>
                <option value="none">Select a genre</option>
                <option value="fiction">Fiction</option>
                <option value="mystery">Mystery</option>
                <option value="fantasy">Fantasy</option>
                <option value="science Fiction">Science Fiction</option>
                <option value="romance">Romance</option>
                <option value="paranormal">Paranormal</option>
                <option value="thriller">Thriller</option>
                <option value="action">Action</option>
                <option value="historical">Historical</option>
                <option value="psychology">Psychology</option>
                <option value="self-help">Self-help</option>
            </select>
        </div>
    );
}

function StockFilter({ inStockOnly, setInStockOnly }) {
    const handleToggle = () => {
        setInStockOnly(!inStockOnly);
    };

    return (
        <div className="StockFilterDiv">
            <label className="StockFilter">
                <input className="StockFilterCheckbox" 
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={handleToggle}
                />
                Stock
            </label>
        </div>
    );
}

export { GenreSelector, StockFilter };