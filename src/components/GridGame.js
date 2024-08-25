import React, { useState } from 'react';

const GridGame = () => {
    const initialGrid = [
        Array(5).fill(null),
        Array(5).fill(null),
        Array(5).fill(null),
        Array(5).fill(null),
        Array(5).fill(null)
    ];

    const [grid, setGrid] = useState(initialGrid);
    const [player1Characters, setPlayer1Characters] = useState(["P1", "H1", "H2", "P2", "P3"]);
    const [player2Characters, setPlayer2Characters] = useState(["P4", "H3", "H4", "P5", "P6"]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [playerTurn, setPlayerTurn] = useState(1);
    const [warningMessage, setWarningMessage] = useState("");

    // Create lists to track killed characters
    const [killedPlayer1Characters, setKilledPlayer1Characters] = useState([]);
    const [killedPlayer2Characters, setKilledPlayer2Characters] = useState([]);

    const handleCharacterSelect = (character) => {
        setSelectedCharacter(character);
    };

    const handleCellClick = (row, col) => {
        const correctRow = playerTurn === 1 ? 0 : 4;

        if (row !== correctRow || !selectedCharacter) {
            setWarningMessage(`You can only place characters on your starting row!`);
            setTimeout(() => setWarningMessage(""), 2000);
            return;
        }

        const newGrid = grid.map((r, rowIndex) =>
            r.map((cell, colIndex) => {
                if (rowIndex === row && colIndex === col && cell === null) {
                    return selectedCharacter;
                }
                return cell;
            })
        );
        setGrid(newGrid);

        if (playerTurn === 1) {
            setPlayer1Characters(player1Characters.filter(char => char !== selectedCharacter));
        } else {
            setPlayer2Characters(player2Characters.filter(char => char !== selectedCharacter));
        }

        setSelectedCharacter(null);

        if (playerTurn === 1 && player1Characters.length === 1) {
            setPlayerTurn(2);
        }
    };

    

    const handleMove = (character, direction) => {

        
            if (killedPlayer1Characters.length === 5) {
                alert("Player 2 wins! Start a new game.");
                window.location.reload(); 
            } else if (killedPlayer2Characters.length === 5) {
                alert("Player 1 wins! Start a new game.");
                window.location.reload(); 
            }
        

        if (
            (playerTurn === 1 && killedPlayer1Characters.includes(character)) ||
            (playerTurn === 2 && killedPlayer2Characters.includes(character))
        ) {
            setWarningMessage(`${character} is dead and cannot be moved!`);
            console.log(killedPlayer1Characters.length);
     
            setTimeout(() => setWarningMessage(""), 2000);
            return;
        }

        if (playerTurn === 1) {
            if (["P4", "P5", "P6", "H3", "H4"].includes(character)) {
                setWarningMessage("You cannot move the other player's characters!");
                setTimeout(() => setWarningMessage(""), 2000);
                return;
            }
        } else if (playerTurn === 2) {
            if (["P1", "P2", "P3", "H1", "H2"].includes(character)) {
                setWarningMessage("You cannot move the other player's characters!");
                setTimeout(() => setWarningMessage(""), 2000);
                return;
            }
        }

        const [row, col] = findCharacterPosition(character);
        let newRow = row;
        let newCol = col;

        let cellsToCheck = [];

        if (character.startsWith('P4') || character.startsWith('P5') || character.startsWith('P6')) {
            switch (direction) {
                case 'L': newCol -= 1; break;
                case 'R': newCol += 1; break;
                case 'F': newRow -= 1; break;
                case 'B': newRow += 1; break;
                default: return;
            }
        } else if (character.startsWith('P1') || character.startsWith('P2') || character.startsWith('P3')) {
            switch (direction) {
                case 'R': newCol -= 1; break;
                case 'L': newCol += 1; break;
                case 'B': newRow -= 1; break;
                case 'F': newRow += 1; break;
                default: return;
            }
        } else if (character.startsWith('H1')) {
            switch (direction) {
                case 'R': cellsToCheck.push([newRow, newCol - 1], [newRow, newCol - 2]); newCol -= 2; break;
                case 'L': cellsToCheck.push([newRow, newCol + 1], [newRow, newCol + 2]); newCol += 2; break;
                case 'B': cellsToCheck.push([newRow - 1, newCol], [newRow - 2, newCol]); newRow -= 2; break;
                case 'F': cellsToCheck.push([newRow + 1, newCol], [newRow + 2, newCol]); newRow += 2; break;
                default: return;
            }
        } else if (character.startsWith('H3')) {
            switch (direction) {
                case 'L': cellsToCheck.push([newRow, newCol - 1], [newRow, newCol - 2]); newCol -= 2; break;
                case 'R': cellsToCheck.push([newRow, newCol + 1], [newRow, newCol + 2]); newCol += 2; break;
                case 'F': cellsToCheck.push([newRow - 1, newCol], [newRow - 2, newCol]); newRow -= 2; break;
                case 'B': cellsToCheck.push([newRow + 1, newCol], [newRow + 2, newCol]); newRow += 2; break;
                default: return;
            }
        } else if (character.startsWith('H2')) {
            switch (direction) {
                case 'BR': cellsToCheck.push([newRow - 1, newCol - 1], [newRow - 2, newCol - 2]); newRow -= 2; newCol -= 2; break;
                case 'BL': cellsToCheck.push([newRow - 1, newCol + 1], [newRow - 2, newCol + 2]); newRow -= 2; newCol += 2; break;
                case 'FR': cellsToCheck.push([newRow + 1, newCol - 1], [newRow + 2, newCol - 2]); newRow += 2; newCol -= 2; break;
                case 'FL': cellsToCheck.push([newRow + 1, newCol + 1], [newRow + 2, newCol + 2]); newRow += 2; newCol += 2; break;
                default: return;
            }
        } else if (character.startsWith('H4')) {
            switch (direction) {
                case 'FL': cellsToCheck.push([newRow - 1, newCol - 1], [newRow - 2, newCol - 2]); newRow -= 2; newCol -= 2; break;
                case 'FR': cellsToCheck.push([newRow - 1, newCol + 1], [newRow - 2, newCol + 2]); newRow -= 2; newCol += 2; break;
                case 'BL': cellsToCheck.push([newRow + 1, newCol - 1], [newRow + 2, newCol - 2]); newRow += 2; newCol -= 2; break;
                case 'BR': cellsToCheck.push([newRow + 1, newCol + 1], [newRow + 2, newCol + 2]); newRow += 2; newCol += 2; break;
                default: return;
            }
        }

        cellsToCheck.forEach(([r, c]) => {
            if (r >= 0 && r < 5 && c >= 0 && c < 5) {
                const targetCell = grid[r][c];
                if (playerTurn === 1 && ["P4", "P5", "P6", "H3", "H4"].includes(targetCell)) {
                    setKilledPlayer2Characters([...killedPlayer2Characters, targetCell]); // Add to killedPlayer2 list
                    grid[r][c] = null;
                }
                if (playerTurn === 2 && ["P1", "P2", "P3", "H1", "H2"].includes(targetCell)) {
                    setKilledPlayer1Characters([...killedPlayer1Characters, targetCell]); // Add to killedPlayer1 list
                    grid[r][c] = null;
                }
            }
            //checkWinner();
        });

        if (newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5) {
            const targetCell = grid[newRow][newCol];
            if (targetCell === null || targetCell.startsWith(playerTurn === 1 ? 'P2' : 'P1')) {
                const newGrid = grid.map((r, rowIndex) =>
                    r.map((cell, colIndex) => {
                        if (rowIndex === row && colIndex === col) return null;
                        if (rowIndex === newRow && colIndex === newCol) return character;
                        return cell;
                    })
                );
                setGrid(newGrid);
                setPlayerTurn(playerTurn === 1 ? 2 : 1);
            } else {
                setWarningMessage("Invalid move. Target cell is occupied by your own character.");
                setTimeout(() => setWarningMessage(""), 2000);
            }
        } else {
            setWarningMessage("Move out of bounds.");
            setTimeout(() => setWarningMessage(""), 2000);
        }
    };

    const findCharacterPosition = (character) => {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (grid[row][col] === character) {
                    return [row, col];
                }
            }
        }
        return [-1, -1];
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-2xl font-bold mb-6">5x5 Grid Game</h1>

            {warningMessage && (
                <div className="mb-4 text-red-500">
                    {warningMessage}
                </div>
            )}

            <div className="mb-4">
                <h2 className="text-xl mb-2">Player {playerTurn} - Select a Character</h2>
                <div className="flex space-x-2">
                    {(playerTurn === 1 ? player1Characters : player2Characters).map(character => (
                        <button
                            key={character}
                            className={`px-4 py-2 rounded ${
                                selectedCharacter === character ? 'bg-blue-600' : 'bg-gray-700'
                            }`}
                            onClick={() => handleCharacterSelect(character)}
                        >
                            {character}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-16 h-16 border-2 border-gray-600 flex items-center justify-center cursor-pointer ${
                                rowIndex === (playerTurn === 1 ? 0 : 4) && cell === null && selectedCharacter ? 'hover:bg-gray-700' : ''
                            }`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                            {cell}
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4">
                <h2 className="text-xl mb-2">Move Character</h2>
                <input
                    type="text"
                    placeholder="Enter move (e.g., P1:L, H1:F, H2:FL)"
                    className="px-4 py-2 rounded bg-gray-700 text-white"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const [char, direction] = e.target.value.split(':');
                            handleMove(char, direction);
                            e.target.value = '';
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default GridGame;
