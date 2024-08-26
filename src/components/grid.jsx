import React from 'react';

const Grid = ({ grid, onCellClick, playerTurn, selectedCharacter }) => {
    return (
        <div className="grid grid-cols-5 gap-2">
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-16 h-16 border-2 border-gray-600 flex items-center justify-center cursor-pointer ${
                            rowIndex === (playerTurn === 1 ? 0 : 4) && cell === null && selectedCharacter ? 'hover:bg-gray-700' : ''
                        }`}
                        onClick={() => onCellClick(rowIndex, colIndex)}
                    >
                        {cell}
                    </div>
                ))
            )}
        </div>
    );
};

export default Grid;
