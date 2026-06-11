import React from 'react';

const Prices = ({ setSelectedRange, selectedRange }) => {
    const handleClick = (range) => {
        if (selectedRange === range) {
            setSelectedRange(null);
        } else {
            setSelectedRange(range);
        }
    };

    return (
        <div className="prices-container">
            <h2>Price Ranges</h2>
            <div className="prices-cards">
                <div 
                    className={`price-card ${selectedRange === null ? 'selected' : ''}`} 
                    onClick={() => handleClick(null)}
                >
                    <h3>All</h3>
                </div>
                <div 
                    className={`price-card ${selectedRange === 'under99' ? 'selected' : ''}`} 
                    onClick={() => handleClick('under99')}
                >
                    <h3>Under-₹99rs</h3>
                </div>
                <div 
                    className={`price-card ${selectedRange === '100-149' ? 'selected' : ''}`} 
                    onClick={() => handleClick('100-149')}
                >
                    <h3>₹100-₹149</h3>
                </div>
                <div 
                    className={`price-card ${selectedRange === '200-249' ? 'selected' : ''}`} 
                    onClick={() => handleClick('200-249')}
                >
                    <h3>₹200-₹249</h3>
                </div>
                <div 
                    className={`price-card ${selectedRange === 'veg' ? 'selected' : ''}`} 
                    onClick={() => handleClick('veg')}
                >
                    <h3>Veg</h3>
                </div>
                <div 
                    className={`price-card ${selectedRange === 'nonveg' ? 'selected' : ''}`} 
                    onClick={() => handleClick('nonveg')}
                >
                    <h3>Non-Veg</h3>
                </div>
            </div>
        </div>
    );
};

export default Prices;
