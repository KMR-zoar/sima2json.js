/*
 * SIMA to GeoJson converter.
 * This software is released under the MIT License, see http://opensource.org/licenses/mit-license.php
 * Copyright (c) 2015 Zoar
*/
var epsgcodes = ["0","2443","2444","2445","2446","2447","2448","2449","2450","2451","2452","2453","2454","2455","2456","2457","2458","2459","2460","2461"]

function SimaToGeoJSONPoint(sima) {
   var simaline = sima.split("\n");
   var number = $('[name=code]').val();
   var pointstock = [];

   for (var i = 0; i < simaline.length; i++) {
      var simalineelement = simaline[i].split(",");

      if (simalineelement[0] == "A01") {
         var geometry = {
            type: 'Point',
            coordinates: [Number(simalineelement[4]), Number(simalineelement[3])]
         };

         var properties = {
            Number: simalineelement[1],
            Name: simalineelement[2],
            Xcoordinates: simalineelement[3],
            Ycoordinates: simalineelement[4]
         }

         var features = {
            type: 'Feature',
            properties: properties,
            geometry: geometry
         }

         pointstock.push(features);
      };
   }

   var crsproperties = {
      name: 'urn:ogc:def:crs:EPSG::' + epsgcodes[number]
   };

   var crs = {
      type: 'name',
      properties: crsproperties
   };

   var geojson = {
      type: 'FeatureCollection',
      crs:crs,
      features: pointstock
   };

   return geojson;

};

function SimaToGeoJSONPolygon(sima) {
   var simaline = sima.split("\n");
   var number = $('[name=code]').val();
   var polygonstock = [];
   var points = {};
   var coordinates = [];

   for (var i = 0; i < simaline.length; i++) {
      var simalineelement = simaline[i].split(",");

      if (simalineelement[0] == "A01") {
         points[ simalineelement[1] + simalineelement[2] ]  = [Number(simalineelement[4]), Number(simalineelement[3])]
      };

      if (simalineelement[0] == "D00") {
        var properties = {
           Number: simalineelement[1],
           Name : simalineelement[2]
        } 
      };

      if (simalineelement[0] == "B01") {
        coordinates.push(points[ simalineelement[1] + simalineelement[2] ]);
      };

      if (simalineelement[0] == "D99") {
         coordinates.push(coordinates[0]);
         coordinates = [coordinates];

         var geometry = {
            type : 'Polygon',
            coordinates : coordinates
         };

         var features = {
            type : 'Feature',
            properties : properties,
            geometry : geometry
         };

         polygonstock.push(features)

      };

   }

   var crsproperties = {
      name: 'urn:ogc:def:crs:EPSG::' + epsgcodes[number]
   };

   var crs = {
      type: 'name',
      properties: crsproperties
   };

   var geojson = {
      type: 'FeatureCollection',
      crs:crs,
      features: polygonstock
   };

   return geojson;

};
