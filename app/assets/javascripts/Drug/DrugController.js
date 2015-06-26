app.controller("DrugController", ['$scope', '$routeParams', '$location', '$sanitize', 'DrugService', 'EventService',
function ($scope, $routeParams, $location, $sanitize, drugService, eventService) {

  window.DrugControllerScope = $scope; // debugging hook TODO: remove
  $scope.selectedDrug = {}
  $scope.drug, $scope.events = null;
  $scope.selectedLabel = null;
  $scope.searchPlaceholder = "enter drug name (e.g. Lipitor)";

  // typeahead search
  $scope.searchDrugs = function (val) {
      return drugService.typeAheadSearch(val);
  };
  $scope.onSelect = function (item, model, label) {
    $scope.navigateToDrug(item.product_ndc)
  };

  // fetch details for a given drug
  $scope.getDetail = function () {
      drugService.getDetails($scope.selectedDrug.product_ndc, $scope.onDetailsLoaded);
  }

  $scope.onDetailsLoaded = function(data){
      $scope.drug = data;
      $scope.drillOnEvent(''); // get a sampling of recent events
  }

  // fetch event details for table
  $scope.drillOnEvent = function (term) {
      eventService.index($scope.drug.proprietary_name, term, $scope.onEventsLoaded);
  }

  $scope.onEventsLoaded = function (data) {
      $scope.eventsDetail = data.results;
  }

  // navigate among drugs
  $scope.navigateToDrug = function(product_ndc) {
    return $location.path("/drug/" + product_ndc);
  }

  // build link to FDA's recall details
  // TODO - looks like this is no longer used: DELETE if so
  $scope.url_fda_enforcement_report = function( recall ) {
    var id = recall.recall_number,
        report_date = $scope.UTIL.parseDate(recall.report_date);
    return "http://www.accessdata.fda.gov/scripts/enforcement/enforce_rpt-Product-Tabs.cfm?action=select&recall_number="+id+"&w="+report_date+"&lang=eng"
  }

  // if we have a drug ID via the route, use that
  if ($routeParams.product_ndc) {
    $scope.drugLoading = true;
    $scope.selectedDrug.product_ndc = $routeParams.product_ndc;
    $scope.getDetail();
  }

}]);
