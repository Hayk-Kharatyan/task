import React, { useState, useEffect } from 'react';
import "./Product.css";

function Product({ data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [sliderValue, setSliderValue] = useState(300000);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchText, setSearchText] = useState("");

    const uniqueProducts = {};
    if (Array.isArray(data.result)) {
        data.result.forEach(item => {
            if (!uniqueProducts[item.id]) {
                uniqueProducts[item.id] = item;
            }
        });
    }

    const uniqueProductArray = Object.values(uniqueProducts);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        const filtered = uniqueProductArray.filter(elem => elem.price <= sliderValue && elem.product.toLowerCase().includes(searchText.toLowerCase()));
        if (JSON.stringify(filtered) !== JSON.stringify(filteredProducts)) {
            setFilteredProducts(filtered);
        }
    }, [uniqueProductArray, sliderValue, searchText, filteredProducts]);
    



    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleChange = (event) => {
        const value = parseInt(event.target.value);
        setSliderValue(value);
    };

    return (
        <>
            <h2 className='header-products'>Продукты</h2>
            <div className='Products'>
                {filteredProducts.length > 0 ? (
                    filteredProducts.slice(indexOfFirstItem, indexOfLastItem).map((item) => (
                        <div key={item.id} className='block'>
                            <p>бренд: {item.brand === null ? "без имени бренда" : item.brand}</p>
                            <p>Продукт: {item.product}</p>
                            <p>Цена: {item.price}₽</p>
                            <p>id: {item.id}</p>
                        </div>
                    ))
                ) : (
                    <p>Нет доступных продуктов</p>
                )}
            </div>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(i + 1)}
                        className={currentPage === i + 1 ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button onClick={() => setModalOpen(!modalOpen)} className='btn-filter'>фильтровать продукты  →</button>
            {
                modalOpen && (
                    <div className={`modal ${modalOpen && 'activeModal'}`}>
                        <div className='close'>
                            <button onClick={() => setModalOpen(!modalOpen)} className='modal-close'>X</button>
                        </div>

                        <h3 className='header-h3'>Найти  Продукты</h3>
                        <div className='search-filter'>
                            <input
                                type="text"
                                placeholder="Поиск"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>

                        <div className='price-filter'>
                            <div>
                                <span>100₽</span>
                                <input
                                    type="range"
                                    name='price'
                                    min="100"
                                    max="300000"
                                    step="10"
                                    value={sliderValue}
                                    onChange={handleChange}
                                />
                                <span>{sliderValue}₽</span>
                            </div>
                        </div>
                    </div>
                )
            }

        </>
    );
}

export default Product;
