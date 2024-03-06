import React, { useState, useEffect } from 'react';
import md5 from 'md5';
import Product from './Products/Product';

function Request() {
    const [response, setResponse] = useState(null);

    useEffect(() => {
        const makeAPIRequest = async () => {
            const password = 'Valantis';
            const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const xAuth = md5(`${password}_${timestamp}`);

            const requestBody = {
                action: 'get_ids',
                params: {
                    offset: 0,
                    limit: 50
                }
            };

            try {
                const response = await fetch('https://api.valantis.store:41000/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth': xAuth
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    const responseData = await response.json();
                    const ids = responseData.result;
                    await fetchItems(ids);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                console.error('Ошибка:', error);
            }
        };

        makeAPIRequest();
    }, []);

    const fetchItems = async (ids) => {
        const password = 'Valantis';
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const xAuth = md5(`${password}_${timestamp}`);

        const requestBody = {
            action: 'get_items',
            params: {
                ids: ids
            }
        };

        try {
            const response = await fetch('https://api.valantis.store:41000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth': xAuth
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const responseData = await response.json();
                setResponse(responseData);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };
    return (
        <>
            {response ? (
                <div>
                    <Product data={response} />
                </div>
            )
                : (
                    <h2 style={{ textAlign: "center", fontSize: "30px" }}>Загрузка продуктов...</h2>
                )
            }
        </>
    );
}

export default Request;
