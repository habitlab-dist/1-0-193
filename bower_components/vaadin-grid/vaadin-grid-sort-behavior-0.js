
  window.vaadin = window.vaadin || {};
  vaadin.elements = vaadin.elements || {};
  vaadin.elements.grid = vaadin.elements.grid || {};

  /**
   * @polymerBehavior vaadin.elements.grid.SortBehavior
   */
  vaadin.elements.grid.SortBehavior = {

    properties: {

      /*
       * When `true`, all `<vaadin-grid-sorter>` are applied for sorting.
       */
      multiSort: {
        type: Boolean,
        value: false
      },

      _sorters: {
        type: Array,
        value: function() {
          return [];
        }
      },

      _previousSorters: {
        type: Array,
        value: function() {
          return [];
        }
      }

    },

    listeners: {
      'sorter-changed': '_onSorterChanged'
    },

    _onSorterChanged: function(e) {
      var sorter = e.target;

      this._removeArrayItem(this._sorters, sorter);
      sorter._order = null;
      
      if (this.multiSort) {
        if (sorter.direction) {
          this._sorters.unshift(sorter);
        }

        this._sorters.forEach(function(sorter, index) {
          sorter._order = this._sorters.length > 1 ? index : null;
        }, this);
      } else {
        this._sorters.forEach(function(sorter) {
          sorter._order = null;
          sorter.direction = null;
        });

        if (sorter.direction) {
          this._sorters = [sorter];
        }
      }

      e.stopPropagation();

      if (this.dataProvider &&
        // No need to clear cache if sorters didn't change
        JSON.stringify(this._previousSorters) !== JSON.stringify(this._mapSorters())) {
        this.clearCache();
      }

      this._previousSorters = this._mapSorters();
    },

    _mapSorters: function() {
      return this._sorters.map(function(sorter) {
        return {
          path: sorter.path,
          direction: sorter.direction
        };
      });
    },

    _removeArrayItem: function(array, item) {
      var index = array.indexOf(item);
      if (index > -1) {
        array.splice(index, 1);
      }
    },

  };
