angular
  .module("demo-kogito-knative", [])
  .controller("call-dmn", function ($scope, $http) {
    console.log(ENV.baseUrl);
    var bonus_endpoint = ENV.baseUrl + '/frequent_discount';
 
    function createPayload(from,to, status){
      var payload = '{"Status":"'+status +'","From":"' + from + '","To":"' + to + '"}';
      return payload;
    }
    $scope.msgTime = "";
    $scope.status = "";
    $scope.discount ="";
    $scope.startDMN = function () {
      var startTime = new Date().getTime();
      var elapsedTime = 0;
      var from = $scope.traveler.from;
      var to = $scope.traveler.to;
      var status = $scope.traveler.status;

      
      var payload = createPayload(from,to, status);
      console.log(payload);
      $http.post(
        bonus_endpoint,
        payload
      ).then(function (response) {
        console.log("response :" + response.status);
        $scope.greeting = response.data;
        if (response.status == 200) {
          // approved
          console.log($scope.greeting);
          $scope.msgTime = "Execution time : " + elapsedTime + " ms";
          $scope.msgContainer = "Version 1.0";
          $scope.status = status;
          $scope.discount = status +" member got "+$scope.greeting.Discount+"% Discount !" ;
        }})}});