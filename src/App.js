import "./App.css";
import React, { useState } from "react";

//Defino número de filas, columnas y bombas que quiero en mi tablero. (Será de 100 celdas)
const rows = 10;
const columns = 10;
const bombs = 10;

//Creo el tablero
const newBoard = () =>
  Array(rows) // array de 10 elementos
    .fill() // se llenan con undefined
    .map(() => Array(columns).fill(9)); // se mapea el primer array y se pushea un segundo array, llenado de 9.

    console.log(newBoard())
//Para colocar las bombas en el tablero, primero necesito buscar celdas en el tablero de forma aleatorea. Para eso busco coordenadas de ese tablero, representadas con X para las filas e Y para las columnas.

//Numero aleatoreo dentro de un rango (min - max).
const getNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getRandomCoords = () => ({
  x: getNumber(0, rows), //busco un número random entre cero y la cantidad de filas
  y: getNumber(0, columns), //busco un número random entre cero y la cantidad de filas
});

const placeBombs = (board) => {
  //Recibe array 2d
  for (let index = 0; index < bombs; index++) {
    // Itera hasta llegar al maximo de bombas
    const bomb = getRandomCoords(); //Bomb entonces es un objeto que tiene dos coordenadas (x , y)

    /* ejemplo bomb = {
        x: 2,
        y: 5
    }*/
    board[bomb.x][bomb.y] = 0; //Buscar en nuestro tablero segun las coordenadas del objeto bomb y luego le asigno a ese lugar el numero 0 (es decir, que hay una bomba)
  }

  return board; //Terminado de iterar, devuelvo el array lleno de bombas
};

function checkVecinos(board, x, y) {
  let vecinos = [];
  for (let modX = -1; modX <= 1; modX++) {
    //Define movimiento en el eje X 
    if (board[x + modX] !== undefined) {
      //Chequea que X + modificador exista en el array
      for (let modY = -1; modY <= 1; modY++) {
        //Define movimiento en el eje Y
        if (board[x + modX][y + modY] !== undefined) {
          //Chequea que X + modificador e Y + modificador exista en el array
          vecinos = [...vecinos, board[x + modX][y + modY]]; //Agrega valor de las celda con posición modificada al array vecinos
        }
      }
    }
  }

  const cantBombs = vecinos.filter((item) => item === 0).length; //filtro las bombas y cuento cuantas hay en el array.
  if (cantBombs === 0) {
    return -2; //retorna -2 si fue tocado y no hay bombas alrededor
  }
  return cantBombs;
}

function App() {
  const initialBoard = newBoard(); // creo un tablero
  const boardWithBombs = placeBombs(initialBoard); // coloco las bombas en el tablero previamente creado
  const [boardTable, setBoardTable] = useState(boardWithBombs);
  const [changeTeam, setChangeTeam] = useState(false) //para cambiar de equipo
  const [blockBoard, setBlockBoard] = useState(false) //para bloquear el tablero cuando perdés

  //Para hacer reset del juego
  const resetGame = () => {
    setBoardTable(placeBombs(initialBoard));  //Vuelve a crear un tablero nuevo con bombas. 
    setBlockBoard(false)
  };

  //Se ejecuta onClick. El primer caso convierte un cero a -1, y devuelve el tablero actualizado con ese nuevo valor. Solo actualiza a -1 el cero que se tocó. Al detectar que se tocó ese valor, envía un alert de "Perdiste".
  //Si tocaste una celda con valor 9, se va a ejecutar la funcion de checkVecinos para poder modificar con el numero de bombas que tenga alrededor esa celda. Como en el caso anterior, también se actualiza el tablero con este nuevo valor, y únicamente en la celda en que se hizo click. 
  const handleCellChange = (x, y) => {
    switch (boardTable[x][y]) {
      case 0:
        boardTable[x][y] = -1; //cambio el cero a -1
        setBoardTable([...boardTable]); //se actualiza el tablero
        alert("PERDISTE");
        setBlockBoard(true)
        break;

      case 9:
        boardTable[x][y] = checkVecinos(boardTable, x, y);
        setBoardTable([...boardTable]);
        break;

      default:
        break;
    }
  };

  //Para manejar estilos del tablero
  const getClassName = (cell) => {
    let className = "";
    switch (cell) {
      case 0:
      case 9:
        className = 'hiddenValue'
        break;

      case -2:
        changeTeam === false ? className = "emptyCell" : className = "riverEmptyCell"
        break;

      case -1:
        changeTeam === false ? className = "showBomb" : className = "riverShowBomb"
        break;

      default:
        className = "showValue";
        break;
    }
    return className;
  };

  //Para manejar estilos por fuera del tablero.
  const titleClassName = changeTeam ? 'riverTitle' : 'bocaTitle';
  const boardClassName = changeTeam ? 'riverApp' : 'bocaApp';
  const reloadClassName = changeTeam ? 'riverReload' : 'bocaReload';
  const changeTeamButton = changeTeam ? 'bocaChangeButton' : 'riverChangeButton'
  const blockBoardClassName = blockBoard === true ? 'blockBoard ' : ''



  return (
    <div className='container'>
      <p className="change-team">Cambiar a</p>
      <button className={changeTeamButton} onClick={() => {
        resetGame()
        setChangeTeam(!changeTeam)
      }}> {changeTeam ? 'Boca' : 'River'} </button>
      <h1 className={titleClassName}>{changeTeam ? 'Buscagallinas' : 'Buscaromán'}</h1>
      <div className={blockBoardClassName}>
        <div className={boardClassName}>
          {boardTable.map((table, rowIndex) => {
            return (
              <div className="column">
                {table.map((cell, cellIndex) => {
                  return (
                    <div
                      onClick={() => handleCellChange(rowIndex, cellIndex)}
                      className={getClassName(cell)}
                      key={`${cellIndex};${rowIndex}`}
                    >
                      {cell}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <button className={reloadClassName} onClick={resetGame}>
        Reiniciar
      </button>
    </div>
  );
}

export default App;
