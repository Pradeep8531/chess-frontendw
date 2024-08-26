import React, { useState, useEffect } from 'react';
import Grid from './grid';
import CharacterSelection from './CharacterSelection';
import Movecharacter from './Movecharacter';
import Details from './details';

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
    const [moveHistory, setMoveHistory] = useState([]);


    const [killedPlayer1Characters, setKilledPlayer1Characters] = useState([]);
    const [killedPlayer2Characters, setKilledPlayer2Characters] = useState([]);


    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3001');
        socket.onopen = () => {
            console.log('Connected to the server');
        };
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleServerMessage(message);
        };
        socket.onclose = () => {
            console.log('Disconnected from the server');
        };
        setWs(socket);

        return () => socket.close();
    }, []);

    const handleServerMessage = (message) => {
        switch (message.type) {
            case 'INIT':
                setGrid(message.gameState.grid);
                break;
            case 'UPDATE':
                setGrid(message.gameState.grid);
                setPlayerTurn(message.gameState.playerTurn);
                break;
            case 'INVALID_MOVE':
                setWarningMessage(message.reason);
                setTimeout(() => setWarningMessage(""), 2000);
                break;
            case 'WIN':
                alert(`${message.winner} wins! Start a new game.`);
                window.location.reload();
                break;
            default:
                break;
        }
    };

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
        if (ws) {
            ws.send(JSON.stringify({
                type: 'MOVE',
                character: selectedCharacter,
                direction: '',
                playerTurn
            }));
        }


        setSelectedCharacter(null);

        if (playerTurn === 1 && player1Characters.length === 1) {
            setPlayerTurn(2);
        }
    };

    function checkwin(){
        let winner = "";
        if (killedPlayer1Characters.length === 5) {
            winner = "2";
            alert("Player 2 wins! Start a new game.");
            window.location.reload(); 

        if (ws) {
            ws.send(JSON.stringify({
                type: 'WIN',
                winner : winner,
            }));
        }
        } else if (killedPlayer2Characters.length === 5) {
            winner = "1";
            alert("Player 1 wins! Start a new game.");
            window.location.reload(); 

        if (ws) {
            ws.send(JSON.stringify({
                type: 'WIN',
                winner : winner,
            }));
        }
        }
    }

    const handleMove = (character, direction) => {

        const validPawnDirections = ['L', 'R', 'F', 'B'];
    const validHero1And3Directions = ['L', 'R', 'F', 'B'];
    const validHero2And4Directions = ['FL', 'FR', 'BL', 'BR'];

    let validDirections = [];

    if (character.startsWith('P')) {
        validDirections = validPawnDirections;
    } else if (character === 'H1' || character === 'H3') {
        validDirections = validHero1And3Directions;
    } else if (character === 'H2' || character === 'H4') {
        validDirections = validHero2And4Directions;
    }

    if (!validDirections.includes(direction)) {
        setWarningMessage(`Invalid direction! ${character} cannot move in the direction '${direction}'.`);
        setTimeout(() => setWarningMessage(""), 2000);
        return;
    }
        
    let winner = "";
    if (killedPlayer1Characters.length === 5) {
        winner = "2";
        alert("Player 2 wins! Start a new game.");
        window.location.reload(); 

    if (ws) {
        ws.send(JSON.stringify({
            type: 'WIN',
            winner : winner,
        }));
    }
    } else if (killedPlayer2Characters.length === 5) {
        winner = "1";
        alert("Player 1 wins! Start a new game.");
        window.location.reload(); 

    if (ws) {
        ws.send(JSON.stringify({
            type: 'WIN',
            winner : winner,
        }));
    }
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

        const moveDetails = `Player ${playerTurn} : ${character} : ${direction}`;
setMoveHistory([...moveHistory, moveDetails]);
        if (ws) {
            ws.send(JSON.stringify({
            type: 'MOVE',
            character,
            direction,
            playerTurn
        }));
}


        cellsToCheck.forEach(([r, c]) => {
            if (r >= 0 && r < 5 && c >= 0 && c < 5) {
                const targetCell = grid[r][c];
                if (playerTurn === 1 && ["P4", "P5", "P6", "H3", "H4"].includes(targetCell)) {
                    setKilledPlayer2Characters([...killedPlayer2Characters, targetCell]); 
                    grid[r][c] = null;
                }
                if (playerTurn === 2 && ["P1", "P2", "P3", "H1", "H2"].includes(targetCell)) {
                    setKilledPlayer1Characters([...killedPlayer1Characters, targetCell]);
                    grid[r][c] = null;
                }
            }
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
        checkwin();
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

            <CharacterSelection
                player1Characters={player1Characters}
                player2Characters={player2Characters}
                onCharacterSelect={handleCharacterSelect}
                selectedCharacter={selectedCharacter}
                playerTurn={playerTurn}
            />

            <Grid grid={grid} onCellClick={handleCellClick} />

            <Movecharacter onMove={handleMove} />
            <div className="move-history mt-4 p-2 bg-gray-800 rounded">
                <h2 className="text-lg font-semibold mb-2">Move History</h2>
                    <ul>
                        {moveHistory.map((move, index) => (
                        <li key={index}>{move}</li>
                    ))}
            </ul>
            </div>
            <Details/>
        </div>
    );
};

export default GridGame;
