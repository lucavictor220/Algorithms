var _ = require('./underscore');

function Candy(name, price) {
  var weight;

  this.name = name || 'name';
  this.price = price || 0;
  this.getName = function() {
    return this.name;
  }
  this.setName = function(name) {
    this.name = name;
  }
  this.getPrice = function() {
    return this.price;
  }
  this.setPrice = function(price) {
    this.price = price;
  }
  this.getInfo = function() {
    return 'Candy: ' + this.name + '\nPrice: ' + this.price;
  }
  // this.setWeight = function(weight) {
  //   console.log(this.weight)
  //   this.weight = weight;
  // }
  var that = this;
}

function Container(param) {
    this.member = param;
    var secret = 3;
    var openBy;
    this.setOpenBy = function(privious_cell) { openBy = privious_cell; }
    this.getOpenBy = function() { return openBy; }
    var new_secret = (function(value) {

      return value + 10;
    })(param);
    (function(param) {
      secret = 21;
    })(param);
    this.getNewSecret = function() {
      return new_secret;
    }
    this.setSecret = function(value) {
      secret = value;
    }
    this.getSecret = function() {
      return secret;
    }
}

var new_array = [1, 3, 5, 6, 7, 0];

var a = new Container('a');

var b = new Container('b');
b.setOpenBy(a);

var c = new Container('c');
c.setOpenBy(b);

// console.log(a.getSecret());

// var array = [a, b, c];
// function popCellWithLowestFCost(array) {
//   var min = _.min(array, function(cell) { return cell.getSecret(); })
//   var index = _.findIndex(array, min);
//   return  array.splice(index, 1);
// }


console.log(!_.isEmpty(a.getOpenBy()));
