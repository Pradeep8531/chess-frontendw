import React from 'react';

const Movecharacter = ({ onMove }) => {
    return (
        <div className="mt-4">
        <h2 className="text-xl mb-2">Move Character</h2>
        <input
            type="text"
            placeholder="Enter move (e.g., P1:L, H1:F, H2:FL)"
            className="px-4 py-2 rounded bg-gray-700 text-white"
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    const [char, direction] = e.target.value.split(':');
                    onMove(char, direction);
                    e.target.value = '';
                }
            }}
        />
    </div>
    );
};

export default Movecharacter;
