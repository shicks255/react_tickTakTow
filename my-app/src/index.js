import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



// functional component
function Square(props)
{
    return (
        <button className="square"
                onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return(
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
    constructor(props)
    {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                placements: {}
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i)
    {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i])
            return;
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        const placements = calculateRowAndColums(i);
        this.setState({
            history: history.concat([{
                squares:squares,
                placement:placements,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) =>
        {
            const desc = move ?
                'Go to move #' + move:
                'Go to game start';

            const placement = step.placement;
            const placementString = move ?
                '(' + placement.row + ', ' + placement.col + ')': '';

            const boldOrNot = move === history.length-1 ?
                <b>{desc}</b>:
                desc;

            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {boldOrNot}
                    </button>
                    {placementString}
                </li>
            )
        });

        let status;
        if (winner)
            status = 'Winner: ' + winner;
        else
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

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

    jumpTo(step)
    {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
}

function calculateWinner(squares)
{
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
    for (let i = 0; i < lines.length; i++)
    {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
            return squares[a];
    }
    return null;
}

function calculateRowAndColums(squareNumber)
{
    let row;
    let col;

    if (squareNumber < 3)
        row = 1;
    else if (squareNumber < 6)
        row = 2;
    else
        row = 3;

    if (squareNumber === 0 || squareNumber === 3 || squareNumber === 6)
        col = 1;
    if (squareNumber === 1 || squareNumber === 4 || squareNumber === 7)
        col = 2;
    if (squareNumber === 2 || squareNumber === 5 || squareNumber === 8)
        col = 3;

    return {row: row, col: col};
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
