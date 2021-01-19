import "./App.css";
import React, { useState } from "react";

//Defino número de filas, columnas y bombas que quiero en mi tablero. (Será de 100 celdas)
const rows = 10;
const columns = 10;
const bombs = 10;

//Creo el tablero
const newBoard = () =>
  Array(rows) // array de 5 elementos
    .fill() // se llenan con undefined
    .map(() => Array(columns).fill(9)); // se mapea el primer array y se pushea un segundo array, llenado de 9.

//Para colocar las bombas en el tablero, primero necesito buscar celdas en el tablero de forma aleatorea. Para eso busco coordenadas de ese tablero, representadas con X para las filas e Y para las columnas.

//Numero aleatoreo dentro de un rango (min - max).
const getNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getRandomCoords = () => ({
  x: getNumber(0, rows), //busco un núemero random entre cero y la cantidad de filas
  y: getNumber(0, columns), //busco un núemero random entre cero y la cantidad de filas
});

const placeBombs = (board) => {
  //Recibe array 2d (matriz)
  for (let index = 0; index < bombs; index++) {
    // Itera hasta llegar al maximo de bombas
    const bomb = getRandomCoords(); //Bomb entonces es un objeto que tiene dos coordenadas (x , y)
    /* bomb = {
        x: 2,
        y: 5
    }*/
    board[bomb.y][bomb.x] = 0; //Buscar en nuestra matriz segun las coordenadas del objeto bomb y luego le asigno a ese lugar el numero 0 (es decir, que hay una bomba)
  }

  return board; //Terminado de iterar, devuelvo la matriz llena de bombas
};

function checkVecinos(board, x, y) {
  let vecinos = [];
  for (let modX = -1; modX <= 1; modX++) {
    //DEFINE MOVIMIENTO EN EL EJE X
    if (board[x + modX] !== undefined) {
      //CHEQUEA QUE X + MODIFICADOR EXISTA EN EL ARRAY
      for (let modY = -1; modY <= 1; modY++) {
        //DEFINE MOVIMIENTO EN EL EJE Y
        if (board[x + modX][y + modY] !== undefined) {
          //CHEQUEA QUE X + MODIFICADOR E Y + MODIFICADOR EXISTA EN EL ARRAY
          vecinos = [...vecinos, board[x + modX][y + modY]]; //AGREGA VALOR DE LA CELDA CON POSICION MODIFICADA AL ARRAY VECINOS
        }
      }
    }
  }
  const cantBombs = vecinos.filter((item) => item == 0).length; //filtro las bombas y cuento cuantas hay en el array.
  if (cantBombs == 0) {
    return -2; //retorna -2 si fue tocado y no hay bombas alrededor
  }
  return cantBombs;
}
function App() {
  const initialBoard = newBoard(); // creo un tablero
  const boardWithBombs = placeBombs(initialBoard); // coloco las bombas en el tablero previamente creado
  const [boardTable, setBoardTable] = useState(boardWithBombs);

  const resetGame = () => {
    setBoardTable(placeBombs(initialBoard));  //Vuelve a crear un tablero nuevo con bombas. 
  };


//Se ejecuta onClick. El primer caso convierte un cero a -1, y devuelve el tablero actualizado con ese nuevo valor. Solo actualiza a -1 el cero que se tocó. Al detectar que se tocó ese valor, envía un alert de "Perdiste".
//Si tocaste una celda con valor 9, se va a ejecutar la funcion de checkVecinos para poder modificar con el numero de bombas que tenga alrededor esa celda. Como en el caso anterior, también se actualiza el tablero con este nuevo valor, y únicamente en la celda en que se hizo click. 
  const handleCellChange = (x, y) => {
    switch (boardTable[x][y]) {
      case 0:
        boardTable[x][y] = -1; //cambio el cero a -1
        setBoardTable([...boardTable]); //se actualiza el tablero
        alert("PERDISTE");
        break;

      case 9:
        boardTable[x][y] = checkVecinos(boardTable, x, y);
        setBoardTable([...boardTable]);
        break;

      default:
        break;
    }
  };

  //Defino las clases según el valor de cada celda. Primero aparecen todas ocultas ya que no se modifican los valores hasta que las tocás (todos son ceros y nueves). Entonces se aplica la clase "hiddenValue", luego si tocamos una celda que no tiene ningun valor porque no tiene ninguna bomba alrededor, le aplico la clase "emptyCell". Después, si toco una bomba, se aplica la clase "showBomb" que se da si hay un -1 en la celda. Ese -1 aparece cuando se detecta que hay un cero en la celda. Por último, si no se aplican ninguna de estas variantes, actúa la clase "showValue".

  const getClassName = (cell) => {
    let className = "";
    switch (cell) {
      case 0:
      case 9:
        className = "hiddenValue";
        break;

      case -2:
        className = "emptyCell";
        break;

      case -1:
        className = "showBomb";
        break;

      default:
        className = "showValue";
        break;
    }
    return className;
  };

  return (
    <div className="container">
      <h1 className="title">Buscaromán</h1>
      <div className="App">
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
      <button className="reload" onClick={resetGame}>
        Reiniciar
      </button>
    </div>
  );
}

export default App;
