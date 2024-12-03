import React, { useRef, useEffect } from "react";
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Expand from '@arcgis/core/widgets/Expand';
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Search from '@arcgis/core/widgets/Search';  // Import Search widget

export default function EsriMap() {

  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      /**
       * Initialize application
       */
      const webmap = new WebMap({
        portalItem: {
          id: "aa1d3f80270146208328cf66d022e09c"
        }
      });

      const view = new MapView({
        container: mapDiv.current,
        map: webmap
      });

      // Add the Bookmarks widget
      const bookmarks = new Bookmarks({
        view
      });

      const bkExpand = new Expand({
        view,
        content: bookmarks,
        expanded: true
      });

      // Add the Search widget
      const searchWidget = new Search({
        view: view
      });

      // Add the search widget to the top-left corner of the view (you can change the position as needed)
      view.ui.add(searchWidget, "top-right");
      // Add the widget to the top-right corner of the view
      view.ui.add(bkExpand, "top-right");

      

      // Bonus: How many bookmarks in the webmap?
      view.when(() => {
        if (webmap.bookmarks && webmap.bookmarks.length) {
          console.log("Bookmarks: ", webmap.bookmarks.length);
        } else {
          console.log("No bookmarks in this webmap.");
        }
      });
    }
  }, [mapDiv]);

  return (
    <div 
      ref={mapDiv} 
      className="w-full h-screen p-0 m-0 overflow-hidden"  // Tailwind classes for full screen, no padding/margin, and hiding overflow
    />
  );
}
