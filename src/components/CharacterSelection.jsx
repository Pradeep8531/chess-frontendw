import React from 'react';

const CharacterSelection = ({ player1Characters, player2Characters, onCharacterSelect, selectedCharacter, playerTurn }) => {
    const characters = playerTurn === 1 ? player1Characters : player2Characters;

    return (
        <div className="mb-4">
                <h2 className="text-xl mb-2">Player {playerTurn} - Select a Character</h2>
                <div className="flex space-x-2">
                    {(playerTurn === 1 ? player1Characters : player2Characters).map(character => (
                        <button
                            key={character}
                            className={`px-4 py-2 rounded ${
                                selectedCharacter === character ? 'bg-blue-600' : 'bg-gray-700'
                            }`}
                            onClick={() => onCharacterSelect(character)}
                        >
                            {character}
                        </button>
                    ))}
                </div>
        </div>
    );
};

export default CharacterSelection;
