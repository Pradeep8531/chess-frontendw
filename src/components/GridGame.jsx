import React, { useState, useEffect } from 'react';
import Grid from './grid';
import CharacterSelection from './CharacterSelection';
import Movecharacter from './Movecharacter';
import Details from './details';

const GridGame = () => {
    const [grid, setGrid] = useState([]);
    const [player1Characters, setPlayer1Characters] = useState(["P1", "H1", "H2", "P2", "P3"]);
    const [player2Characters, setPlayer2Characters] = useState(["P4", "H3", "H4", "P5", "P6"]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [playerTurn, setPlayerTurn] = useState(1);
    const [warningMessage, setWarningMessage] = useState("");
    const [moveHistory, setMoveHistory] = useState([]);
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
                setPlayerTurn(message.gameState.playerTurn);
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
    
        if (ws) {
            ws.send(JSON.stringify({
                type: 'PLACE',
                character: selectedCharacter,
                row,
                col,
            }));
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
    
        // Add the placement to move history
        const moveDetails = `Player ${playerTurn}: Placed ${selectedCharacter} at (${row}, ${col})`;
        setMoveHistory([...moveHistory, moveDetails]);
    
        // Remove the character from the player's list
        if (playerTurn === 1) {
            setPlayer1Characters(player1Characters.filter(char => char !== selectedCharacter));
            if (player1Characters.length === 1) {
                setPlayerTurn(2);  // Switch turn to player 2
            }
        } else {
            setPlayer2Characters(player2Characters.filter(char => char !== selectedCharacter));
            if (player2Characters.length === 1) {
                setPlayerTurn(1);  // Switch turn to player 1
            }
        }
    
        setSelectedCharacter(null);  // Reset the selected character
    };
    
    

    const handleMove = (character, direction) => {
        if (ws) {
            ws.send(JSON.stringify({
                type: 'MOVE',
                character,
                direction,
                playerTurn
            }));
        }
    
        // Add the move to the move history
        const moveDetails = `Player ${playerTurn}: Moved ${character} ${direction}`;
        setMoveHistory([...moveHistory, moveDetails]);
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
            <Details />
        </div>
    );
};

export default GridGame;
