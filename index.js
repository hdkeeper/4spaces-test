/**
The task is to implement the Shop protocol (you can do that in this file directly).
- No database or any other storage is required, just store data in memory
- No any smart search, use String method contains (case sensitive/insensitive - does not matter)
–   Performance optimizations are optional
*/
var ShopImpl = (function () {
  function ShopImpl() {
    this.products = {};
  }

  /**
    Adds a new product object to the Shop.
    - Parameter product: product to add to the Shop
    - Returns: false if the product with same id already exists in the Shop, true – otherwise.
   */
  ShopImpl.prototype.addNewProduct = function (product) {
    if (this.products[product.id]) {
      return false;
    }

    this.products[product.id] = product;
    return true;
  };

  /**
    Deletes the product with the specified id from the Shop.
    - Returns: true if the product with same id existed in the Shop, false – otherwise.
   */
  ShopImpl.prototype.deleteProduct = function (id) {
    if (!this.products[id]) {
      return false;
    }

    delete this.products[id];
    return true;
  };

  /**
    Helper find function
    Parameter predicate: callback function (product) => boolean
    Returns: product[]
  */
  ShopImpl.prototype.findProducts = function (predicate) {
    const found = [];
    for (let id in this.products) {
      const p = this.products[id];
      if (predicate(p)) {
        found.push(p);
        if (found.length == 10) break;
      }
    }
    return found;
  };

  /**
    - Returns: 10 product names containing the specified string. 
    If there are several products with the same name, producer's name is appended to product's name.
   */
  ShopImpl.prototype.listProductsByName = function (searchString) {
    const found = this.findProducts(p => p.name.includes(searchString));
    
    const nameCount = {};
    found.forEach(p => {
      nameCount[p.name] = (nameCount[p.name] || 0) + 1;
    });

    return found.map(p => nameCount[p.name] > 1 ? `${p.producer} - ${p.name}` : p.name);
  };

  /**
    - Returns: 10 product names whose producer contains the specified string, ordered by producers.
   */
  ShopImpl.prototype.listProductsByProducer = function (searchString) {
    return this.findProducts(p => p.producer.includes(searchString))
      .sort((a, b) => a.producer.localeCompare(b.producer))
      .map(p => p.name);
  };

  return ShopImpl;
}());

function test(shop) {
    assert(!shop.deleteProduct("1"));
    assert(shop.addNewProduct({ id: "1", name: "1", producer: "Lex" }));
    assert(!shop.addNewProduct({ id: "1", name: "any name because we check id only", producer: "any producer" }));
    assert(shop.deleteProduct("1"));
    assert(shop.addNewProduct({ id: "3", name: "Some Product3", producer: "Some Producer2" }));
    assert(shop.addNewProduct({ id: "4", name: "Some Product1", producer: "Some Producer3" }));
    assert(shop.addNewProduct({ id: "2", name: "Some Product2", producer: "Some Producer2" }));
    assert(shop.addNewProduct({ id: "1", name: "Some Product1", producer: "Some Producer1" }));
    assert(shop.addNewProduct({ id: "5", name: "Other Product5", producer: "Other Producer4" }));
    assert(shop.addNewProduct({ id: "6", name: "Other Product6", producer: "Other Producer4" }));
    assert(shop.addNewProduct({ id: "7", name: "Other Product7", producer: "Other Producer4" }));
    assert(shop.addNewProduct({ id: "8", name: "Other Product8", producer: "Other Producer4" }));
    assert(shop.addNewProduct({ id: "9", name: "Other Product9", producer: "Other Producer4" }));
    assert(shop.addNewProduct({ id: "10", name: "Other Product10", producer: "Other Producer4" }));
    assert(shop.addNewProduct({ id: "11", name: "Other Product11", producer: "Other Producer4" }));
    var byNames = shop.listProductsByName("Product");
    assert(byNames.length == 10);
    byNames = shop.listProductsByName("Some Product");
    assert(byNames.length == 4);
    assert(byNames.indexOf("Some Producer3 - Some Product1") >= 0);
    assert(byNames.indexOf("Some Product2") >= 0);
    assert(byNames.indexOf("Some Product3") >= 0);
    assert(byNames.indexOf("Some Product1") < 0);
    assert(byNames.indexOf("Some Producer1 - Some Product1") >= 0);
    var byProducer = shop.listProductsByProducer("Producer");
    assert(byProducer.length == 10);
    byProducer = shop.listProductsByProducer("Some Producer");
    assert(byProducer.length == 4);
    assert(byProducer[0] == "Some Product1");
    assert(byProducer[1] == "Some Product2" || byProducer[1] == "Some Product3");
    assert(byProducer[2] == "Some Product2" || byProducer[2] == "Some Product3");
    assert(byProducer[3] == "Some Product1");
}

function assert(condition) {
  if (!condition) {
    throw new Error("Assertion failed");
  }
}

test(new ShopImpl());
