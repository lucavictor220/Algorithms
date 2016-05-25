
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
    this.setSecret = function(value) {
      secret = value;
    }
    this.getSecret = function() {
      return secret;
    }
}

var chocolate =  new Candy('chocolate', 50);

var new_container = new Container(31);

// new_container.setSecret(21)
// console.log(new_container.secret);
new_container.setSecret(34);
console.log(new_container.secret);
console.log(new_container.getSecret());
