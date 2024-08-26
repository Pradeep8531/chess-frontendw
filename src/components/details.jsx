import React from 'react';

const Details = () => {
    return (
        <div className="mt-8 mb-8 bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Game Rules & Commands</h2>
            <ul className="list-disc list-inside">
                <li><strong>Pawns:</strong> 
                    <ul className="list-disc list-inside">
                        <li>Move Left (L), Right (R), Forward (F), or Backward (B) by 1 cell.</li>
                        <li><strong>Example Command:</strong> <span className="text-white">P1 F</span> - Pawn 1 moves forward by 1 cell.</li>
                    </ul>
                </li>
                <li><strong>Heroes 1 & 3:</strong> 
                    <ul className="list-disc list-inside">
                        <li>Move Left (L), Right (R), Forward (F), or Backward (B) by 2 cells.</li>
                        <li><strong>Example Command:</strong> <span className="text-white">H1 L</span> - Hero 1 moves left by 2 cells.</li>
                    </ul>
                </li>
                <li><strong>Heroes 2 & 4:</strong> 
                    <ul className="list-disc list-inside">
                        <li>Move Diagonally Left (DL), Right (DR), Up-Left (UL), or Up-Right (UR) by 2 cells.</li>
                        <li><strong>Example Command:</strong> <span className="text-white">H2 DR</span> - Hero 2 moves diagonally right by 2 cells.</li>
                    </ul>
                </li>
                <li>Heroes can eliminate any opponent's character in their path. Moving to a space occupied by an opponent's character removes that character from the game.</li>
                <li><strong>Invalid Moves:</strong> Targeting a friendly character, moving out of bounds, or moving a character that is already dead.</li>
            </ul>
        </div>
    );
};

export default Details;
