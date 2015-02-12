require(["Lightstreamer/DynaGrid"],function(DynaGrid) {


  var Test = function() {
    this.lsGrid = new DynaGrid("content");
    this.lsGrid.setNodeTypes(["td"]);
    this.lsGrid.parseHtml();

    this.countEl = 0;

    this.unshift = this.firstUnshift;
    this.push =  this.firstPush;


    this.rate = document.getElementById("rate");
    this.amount = document.getElementById("amount");
    this.time = document.getElementById("time");
    this.length = document.getElementById("length");

    this.unshift();
    this.unshift();
  }


  Test.prototype = {
    newItem: function() {
      var key = Math.random();
      this.lsGrid.updateRow(key,{value:Math.random(),key:key});
      this.countEl++;
    },


    firstUnshift: function() {
      this.lsGrid.setAddOnTop(true);
      this.unshift = this.newItem;
      this.push =  this.firstPush;
      this.newItem();
    },

    firstPush: function() {
      this.lsGrid.setAddOnTop(false);
      this.push = this.newItem;
      this.unshift = this.firstUnshift;
      this.newItem();
    },

    remove: function() {
      //this.lsGrid.removeRow();
    },

    clear: function() {
      this.lsGrid.clean();
    },


    start: function() {
      this.intervalId;
      if (this.amount.value === null && this.rate.value === null) {
        console.log('amount and rate should be specified');
        return;
      }

      // start mark
      IBT.startMeasuring();

      // add the first
      this.unshift();

      // set interval for further adds
      var that = this;
      this.intervalId = setInterval(function() {
        that.add()
      }, IBT.calculateInterval(this.rate.value));
    },

    stop: function () {
      // stop mark
      IBT.stopMeasuring();
      clearInterval(this.intervalId);
      this.time.value = IBT.calculateMeasure();
      IBT.calculateHundreds().forEach(function (item) {
        console.log(item);
      });
    },

    add: function () {
      if (this.countEl % 100 === 0) {
        IBT.markHundred(this.countEl / 100);
      }

      if (this.amount.value == 0) {
        this.stop();
      } else {
        this.unshift();
        this.amount.value = this.amount.value - 1;
      }
    }
  };


  window.ls =  new Test();

});


