var _ = require('./underscore.js');
var fs = require('fs');

fs.readFile('./maze.txt', 'utf8', (err, data) => {
  if (err) throw err;
  var new_data = transformData(data);
  findShortestPath(new_data);
});

function transformData(data) {
  data = data.split('\n');
  data.pop(); // removes last line trash
  _.each(data, function(line, index, array) {
    array[index] = array[index].split(' ');
  });
  return data;
}

function findShortestPath(data) {
  var maze = data;

  var path = {
    diagonal_move_cost: 14,
    forward_move_cost: 10,
    G: 0, // distance from starting node
    H: 0, // distance from end node
    F: 0, // G cost + H cost
    findFCost: function() {
      this.F = this.G + this.H;
    },
    findGcost: function(src, current) {
      var path = findPath(src, current);
      this.G = path.diagonal_moves * this.diagonal_move_cost + path.forward_moves * this.forward_move_cost;
    },
    findHCost: function(current, dest) {
      this.H = path.diagonal_moves * this.diagonal_move_cost + path.forward_moves * this.forward_move_cost;
    }
  }

  function Cell(row, col, type) {
    var G = 0;
    var H = 0;
    var F = 0;

    this.getG = function() { return G; }
    this.setG = function(value) { G = value; }
    this.getH = function() { return H; }
    this.setH = function(value) { H = value; }
    this.getF = function() { return G + H; }

    this.row = row;
    this.col = col;
    this.type = type || '-';
    this.riched = false;
    this.setType = function(type) {
      this.type = type;
    }
  }

  function Path(src, dest) {
    var diagonal_move_cost = 14;
    var forward_move_cost = 10;
    var path = {};
    this.src = src || {};
    this.dest = dest || {};

    // function findPath(src, dest) {
    //   var max_value = _.max([Math.abs(dest.row - src.row), Math.abs(dest.col - src.col)]);
    //   var min_value = _.min([Math.abs(dest.row - src.row), Math.abs(dest.col - src.col)]);
    //   path.diagonal_moves = min_value;
    //   path.forward_moves = max_value - min_value;
    //   return path;
    // }

    // path = findPath(src, current);
    // this.findGcost = function(src, current) {
    //   G = path.diagonal_moves * diagonal_move_cost + path.forward_moves * forward_move_cost;
    // }
    // this.findHCost = function(current, dest) {
    //   H = this.path.diagonal_moves * diagonal_move_cost + this.path.forward_moves * forward_move_cost;
    // }
  }



  function findSpecialCell(data, cellName) {
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[0].length; j++) { // data[0] for line length;
        if (data[i][j] == cellName) {
          var cell = new Cell(i, j, cellName);
          cell.setType(maze[i][j]);
          return cell;
        }
      }
    }
    return {};
  }

  var src = findSpecialCell(data, 'A');
  var dest = findSpecialCell(data, 'B');

  if (_.isEmpty(src) || _.isEmpty(dest)) {
    console.log("Something wrong with given data");
    return;
  }

  var undiscovered_cells_stack = [];
  var discovered_cells_stack = [];

  // var initial_path = findPath(src, dest);

  undiscovered_cells_stack.push(src);


  // while(current_cell.H == 0) {
  //   var current_cell = undiscovered_cells_stack.pop();
  //   findNearbyCells(current_cell);
  // }

  var current_cell = undiscovered_cells_stack.pop();
  var new_cells = addNearbyCells(current_cell);
  new_cells = checkNewCells(new_cells);
  console.log(new_cells);

  function addNearbyCells(current_cell) {
    // 8 possibilities
    var new_cells = [];

    new_cells.push(new Cell(current_cell.row + 1, current_cell.col,     maze[current_cell.row + 1][current_cell.col]));       // forward
    new_cells.push(new Cell(current_cell.row + 1, current_cell.col + 1, maze[current_cell.row + 1][current_cell.col + 1]));   // forward + down
    new_cells.push(new Cell(current_cell.row    , current_cell.col + 1, maze[current_cell.row][current_cell.col + 1]));       // down
    new_cells.push(new Cell(current_cell.row - 1, current_cell.col + 1, maze[current_cell.row - 1][current_cell.col + 1]));   // back + down
    new_cells.push(new Cell(current_cell.row - 1, current_cell.col,     maze[current_cell.row - 1][current_cell.col]));       // back
    new_cells.push(new Cell(current_cell.row - 1, current_cell.col - 1, maze[current_cell.row - 1][current_cell.col - 1]));   // back + up
    new_cells.push(new Cell(current_cell.row,     current_cell.col - 1, maze[current_cell.row][current_cell.col - 1]));       // up
    new_cells.push(new Cell(current_cell.row + 1, current_cell.col - 1, maze[current_cell.row + 1][current_cell.col - 1]));   // forward + up
    return new_cells;
  }

  function checkNewCells(new_cells) {
    return _.filter(new_cells, function(cell) { return checkPosition(cell); });
  }

  function setCellsType(cells) {
    _.each(cells, function(cell) { cell.setType() });
  }

  function checkPosition(cell) {
    if (data[cell.row][cell.col] == '+' || data[cell.row][cell.col] == 'B') {
      return true;
    }
    return false;
  }
}
