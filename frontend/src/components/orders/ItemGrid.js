import React from "react";

function ItemGrid({ items, onAddItem }) {
    return (
        <div className="item-grid-wrapper">
            <div className="item-grid">
                {items.map((item) => (
                    <div key={item.id} className="item-card" onClick={() => onAddItem(item)}>
                        <div className="item-card-name">{item.name}</div>
                        <div className="item-card-price">${item.price}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ItemGrid;
