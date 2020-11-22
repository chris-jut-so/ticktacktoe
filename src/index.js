import React from 'react';
import ReactDOM  from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
  class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
  
    render() {
        return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) return;
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpToMove(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // if(this.state.stepNumber - 1 >= 0 ) {
        //     const diffCell = findDiffArrIndex(current.squares, history[this.state.stepNumber -1].squares);
        //     const indices = [
        //         [1,1], [1,2], [1,3],
        //         [2,1], [2,2], [2,3],
        //         [3,1], [3,2], [3,3] 
        //     ];
        //     const pos = indices[diffCell];
        // }

        const moves = history.map((step, move) => {
            let desc;
            if(move) {
                const diffCell = findDiffArrIndex(step.squares, this.state.history[move -1].squares);
                const indices = [
                    [1,1], [1,2], [1,3],
                    [2,1], [2,2], [2,3],
                    [3,1], [3,2], [3,3] 
                ];
                const pos = indices[diffCell];

                desc = 'Go to move # ' + move + '(' + pos[0] + ',' + pos[1] +')';
            } else {
                desc = 'Go to game start';
            }
            
            return (
                <li key={move}>
                    <button onClick={() => this.jumpToMove(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner) {
            status = 'Winner: ' + winner;
        }
        else {
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : '0');
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares} 
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

function findDiffArrIndex(arr1, arr2) {
    if(arr1.length === arr2.length) {
        for(let i = 0; i < arr1.length; i++) {
            if(arr1[i] !== arr2[i]) return i;
        }
        return null;
    }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  