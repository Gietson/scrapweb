'use strict';

angular.module('app')
  .filter('unique', function() {
      return function(input, key) {
          var unique = {};
          var uniqueList = [];
          for(var i = 0; i < input.length; i++){
              if(typeof unique[input[i][key]] == "undefined"){
                  unique[input[i][key]] = "";
                  uniqueList.push(input[i]);
              }
          }
          return uniqueList;
      };
  })
  .filter('labelCase', [function(){
      return function(input){
        if(!input){
          return input;
        }else{
          input = input.replace(/([A-Z])/g, ' $1');
          return input[0].toUpperCase() + input.slice(1);
        }
      };
  }])
  .filter('camelCase', [function(){
    return function(input){
      if(!input){
        return input;
      }else{
        return input.toLowerCase().replace(/ (\w)/g, function(match, letter){
          return letter.toUpperCase();
        });
      }
    };
  }])

  .filter('reverse', [function() {
    return function(items) {
      if(items){
        return items.slice().reverse();
      }else{
        return items;
      }
    };
  }])

  .filter('active', [function() {
      return function(input) {
          // console.log(input);
        var out = 'N';
        if(input===true){ out='Y';}
        return out;
      };
  }])
    .filter('agency', [function() {
        return function(input) {
             //console.log('agency=' + input);
            var out = null;
            if(input===true){ out='Y';}
            else if(input === false) {out='N'}
            return out;
        };
    }])
  .filter('status', [function() {
      return function(input) {
          console.log(input);
        var out = 'I';
        if(input==='0'){ out='A';}
        return out;
      };
  }])
  .filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          // console.log(item[prop]);
          if(item[prop]==null)
            return;
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
})
    .filter("customCurrency", function (numberFilter) {
        function isNumeric(value) {
            return (!isNaN(parseFloat(value)) && isFinite(value));
        }

        return function (inputNumber, currencySymbol, decimalSeparator, thousandsSeparator, decimalDigits, prefixWithSymbol) {
            if (isNumeric(inputNumber)) {
                // Default values for the optional arguments
                currencySymbol = (typeof currencySymbol === "undefined") ? "$" : currencySymbol;
                decimalSeparator = (typeof decimalSeparator === "undefined") ? "." : decimalSeparator;
                thousandsSeparator = (typeof thousandsSeparator === "undefined") ? "," : thousandsSeparator;
                decimalDigits = (typeof decimalDigits === "undefined" || !isNumeric(decimalDigits)) ? 2 : decimalDigits;
                prefixWithSymbol = (typeof prefixWithSymbol === "undefined") ? true : prefixWithSymbol;

                if (decimalDigits < 0) decimalDigits = 0;

                // Format the input number through the number filter
                // The resulting number will have "," as a thousands separator
                // and "." as a decimal separator.
                var formattedNumber = numberFilter(inputNumber, decimalDigits);

                // Extract the integral and the decimal parts
                var numberParts = formattedNumber.split(".");

                // Replace the "," symbol in the integral part
                // with the specified thousands separator.
                numberParts[0] = numberParts[0].split(",").join(thousandsSeparator);

                // Compose the final result
                var result = numberParts[0];

                if (numberParts.length == 2) {
                    result += decimalSeparator + numberParts[1];
                }

                return (prefixWithSymbol ? currencySymbol + " " : "") + result + (prefixWithSymbol ? "" : " " + currencySymbol);
            } else {
                return inputNumber;
            }
        };
    });
