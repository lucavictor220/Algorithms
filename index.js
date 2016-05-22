var _ = require('./underscore.js');
var fs = require('fs');

fs.readFile('./maze.txt', 'utf8', (err, data) => {
  if (err) throw err;
  var new_data = transformData(data);
  findShortestPath(new_data);
});


function transformData(data) {
  console.log(data);
  return data;
}

function findShortestPath() {
  console.log("will be");
}
