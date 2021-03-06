(function () {
  'use strict';

  angular
    .module('flp.moneymask', [])
    .directive('moneyMask', moneyMask);

  moneyMask.$inject = ['$filter'];
  function moneyMask($filter) {
    var directive = {
      require: 'ngModel',
      link: link,
      restrict: 'A',
      scope: {
        model: '=ngModel'
      }
    };
    return directive;

    function link(scope, element, attrs, ngModelCtrl) {
      var display, cents;

      ngModelCtrl.$render = function () {
        display = $filter('number')(cents / 100, 2);

        if (attrs.moneyMaskPrepend) {
          display = attrs.moneyMaskPrepend + ' ' + display;
        }

        if (attrs.moneyMaskAppend) {
          display = display + ' ' + attrs.moneyMaskAppend;
        }

        element.val(display);
      }

      scope.$watch('model', function onModelChange(newValue) {
        newValue = parseFloat(newValue) || 0;

        if(newValue !== cents) {
          cents = Math.round(newValue * 100);
        }

        ngModelCtrl.$viewValue = newValue;
        ngModelCtrl.$render();
      });

      element.on('keydown', function (e) {
        var char = String.fromCharCode(e.keyCode);
        
        if(e.keyCode === 9) return true; // Tab key to change the focus of the element
        e.preventDefault();

        if (e.keyCode === 8 || e.keyCode === 46) { // Backspace or delete
          cents = parseInt(cents.toString().slice(0, -1)) || 0;

        } else if (char.search(/[0-9\-]/) === 0) {
          cents = parseInt(cents + char);

        } else if (char.search(/[a-i`]/) === 0) { // Numpads
          var charNumpad = String.fromCharCode(e.keyCode - 48);
          cents = parseInt(cents + charNumpad);
        } else {
          return false;
        }

        ngModelCtrl.$setViewValue(cents / 100);
        ngModelCtrl.$render();
        scope.$apply();
      })
    }
  }
})();
