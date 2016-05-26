var _ = require('./underscore.js');
var fs = require('fs');

fs.readFile('./maze2.txt', 'utf8', (err, data) => {
  if (err) throw err;
  var new_data = transformData(data);
  var shortest_path = findShortestPath(new_data);
  console.log("++++++++++SHORTEST PATH +++++++++");
  console.log(shortest_path.getRoad());
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

  const global_src = findSpecialCell(maze, 'A');
  const global_dest = findSpecialCell(maze, 'B');
  const diagonal_move_cost = 14;
  const forward_move_cost = 10;

  if (_.isEmpty(global_src) || _.isEmpty(global_dest)) {
    console.log("Something wrong with given data");
    return;
  }
  // Cell Class definition
  function Cell(row, col, type) {
    var G = 0; // distance from start/src node
    var H = 0; // distance from end/dest node
    var F = 0;
    var openBy = {};
    var discovering_cost = 0;

    this.setDiscoveringCost = function(price) { discovering_cost = price; }
    this.getDiscoveringCost = function() { return discovering_cost; }
    this.setOpenBy = function(cell) { openBy = cell; }
    this.getOpenBy = function() { return openBy; }
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
  // Path Class definition
  function Path(current_cell) {
    (function(current_cell) {
      var max_value = _.max([Math.abs(global_dest.row - current_cell.row), Math.abs(global_dest.col - current_cell.col)]);
      var min_value = _.min([Math.abs(global_dest.row - current_cell.row), Math.abs(global_dest.col - current_cell.col)]);
      current_cell.setH(min_value * diagonal_move_cost + (max_value - min_value) * forward_move_cost); // set cost to dest
    })(current_cell);

    var cost = 0;
    var road = (function(current_cell) {
      var road = [];
      road.push(current_cell);
      while(!_.isEmpty(current_cell.getOpenBy())) {
        cost += current_cell.getDiscoveringCost();
        current_cell = current_cell.getOpenBy();
        road.push(current_cell);
      }
      return road;
    })(current_cell)

    this.getRoad = function() { return road; }
    this.getCost = function() { return cost; }

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

  function popCellWithLowestFCost(cells_list) {
    var min = _.min(cells_list, function(cell) { return cell.getF(); })
    var index = _.findIndex(cells_list, min);
    cells_list.splice(index, 1);
    return min;
  }

  var src = global_src;
  var new_path = new Path(src);
  var open = [];
  var closed = [];
  var current_cell;
  open.push(src);

  // MAIN WHILE LOOP +++++++++++++++++++++++++
  var iterator = 50;
  while(iterator != 0) {
    current_cell = popCellWithLowestFCost(open);
    current_cell.riched = true;
    closed.push(current_cell);
    // console.log(current_cell);
    if (current_cell.getH() === 0) { // path have been found
      var shortest_path = new Path(current_cell);
      return shortest_path;
    }

    var new_cells = findNearbyCells(current_cell);
    addOpenByCellProperty(current_cell, new_cells);
    _.each(new_cells, function(cell) {
      if (cell.type == '-' || closed.indexOf(cell) != -1) {
        return;
      }
      if (checkNewPath(cell, current_cell) || open.indexOf(cell) == -1) {
        setNewPath(current_cell, cell);
        if (open.indexOf(cell) == -1) {
          open.push(cell);
        }
      }
    });
    iterator--;
  }

  function checkNewPath(cell ,current_cell) {
    var current_G_cost_diff = cell.getG() - cell.getOpenBy().getG();
    var new_G_cost_diff = cell.getG() - current_cell.getG();
    if (current_G_cost_diff < new_G_cost_diff)
      return true;
    return false;
  }

  function setNewPath(current_cell, cell) {
    cell.setOpenBy(current_cell);
    var new_path = new Path(cell);
    // console.log("+++++++++++++ PATH COST ++++++++++++")
    // console.log(new_path.getRoad());
    // console.log("+++++++++++++ PATH COST ++++++++++++")
    debugger
    cell.setG(new_path.getCost());
  }

  function findNearbyCells(current_cell) {
    var new_cells = [];
    // 8 possibilities
    new_cells.push(new Cell(current_cell.row + 1, current_cell.col,     maze[current_cell.row + 1][current_cell.col]));       // forward
    new_cells[0].setDiscoveringCost(forward_move_cost);
    new_cells.push(new Cell(current_cell.row + 1, current_cell.col + 1, maze[current_cell.row + 1][current_cell.col + 1]));   // forward + down
    new_cells[1].setDiscoveringCost(diagonal_move_cost);
    new_cells.push(new Cell(current_cell.row    , current_cell.col + 1, maze[current_cell.row][current_cell.col + 1]));       // down
    new_cells[2].setDiscoveringCost(forward_move_cost);
    new_cells.push(new Cell(current_cell.row - 1, current_cell.col + 1, maze[current_cell.row - 1][current_cell.col + 1]));   // back + down
    new_cells[3].setDiscoveringCost(diagonal_move_cost);
    new_cells.push(new Cell(current_cell.row - 1, current_cell.col,     maze[current_cell.row - 1][current_cell.col]));       // back
    new_cells[4].setDiscoveringCost(forward_move_cost);
    new_cells.push(new Cell(current_cell.row - 1, current_cell.col - 1, maze[current_cell.row - 1][current_cell.col - 1]));   // back + up
    new_cells[5].setDiscoveringCost(diagonal_move_cost);
    new_cells.push(new Cell(current_cell.row,     current_cell.col - 1, maze[current_cell.row][current_cell.col - 1]));       // up
    new_cells[6].setDiscoveringCost(forward_move_cost);
    new_cells.push(new Cell(current_cell.row + 1, current_cell.col - 1, maze[current_cell.row + 1][current_cell.col - 1]));   // forward + up
    new_cells[7].setDiscoveringCost(diagonal_move_cost);

    return new_cells;
  }

  function addOpenByCellProperty(openByCell, cells) {
    _.each(cells, function(cell) { cell.setOpenBy(openByCell); })
  }

  function checkNewCells(new_cells) {
    return _.filter(new_cells, function(cell) { return checkPosition(cell); });
  }

  function checkPosition(cell) {
    if (data[cell.row][cell.col] == '+' || data[cell.row][cell.col] == 'B') {
      return true;
    }
    return false;
  }
}
