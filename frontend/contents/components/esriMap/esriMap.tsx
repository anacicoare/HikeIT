import React, { useRef, useEffect, useState, useContext, use } from "react";
import Locate from "@arcgis/core/widgets/Locate";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Search from '@arcgis/core/widgets/Search'; 
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import esriConfig from '@arcgis/core/config';
import Graphic from "@arcgis/core/Graphic";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import { ProfileContext } from '@/contexts/ProfileContext';
import { ReviewsServices } from "@/services/reviews/reviewsServices";
import { FavoritesServices } from "@/services/favorites/favoritesServices";

// Configure Esri API Key
esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurGSKiLmewHC7EAlkZcSYgvoxtZ6BQISodIXqucLr2oM2e-7tmozybifTXErhVQ-PP4FV_SPb9X2kO6vLwgp9oUZEk0BGzo9qek2t2aTn6I6rGlJZ5sozjvBPR3-abc8_UEG0g9cx5V5QYc0IJdofXRLkcmDK8W9jjAwV0vBNvFH70cOYtqyGe9L85J_HvRw3pkysRPvRvsq6mjGNKSI4TS0.AT1_tGYZextN";

export default function EsriMap() {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [selectedStops, setSelectedStops] = useState<__esri.Graphic[]>([]);
  const [trailsLayer, setTrailsLayer] = useState<__esri.FeatureLayer | null>(null);
  const [view, setView] = useState<__esri.MapView | null>(null);
  const profile = useContext(ProfileContext);
  const [favoriteTrails, setFavoriteTrails] = useState<string[]>([]);

  useEffect(() => {
    // Fetch favorite trails for the current user
    const userEmail = profile?.profile?.email;
    if (!userEmail) return;

    FavoritesServices.getAllFavorites({ userEmail: userEmail })
      .then(response => {
        const favorites = response?.data?.map(item => item.trailName) || [];
        setFavoriteTrails(favorites);
      })
      .catch(error => {
        console.error('Error fetching favorite trails:', error);
      });
  }, [profile?.profile?.email]);

  useEffect(() => {
    if (!mapDiv.current) return;

    // Initialize the web map
    const webmap = new WebMap({
      portalItem: {
        id: "aa1d3f80270146208328cf66d022e09c"
      }
    });

    // Create the map view
    const mapView = new MapView({
      container: mapDiv.current,
      map: webmap
    });

    // Add Locate widget
    const locateWidget = new Locate({
      view: mapView,
      useHeadingEnabled: true,
      goToLocationEnabled: true,
      geolocationOptions: {
        maximumAge: 0,
        timeout: 15000,
        enableHighAccuracy: true
      }
    });

    // Create the trails feature layer
    const trailsFeatureLayer = new FeatureLayer({
      url: 'https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/National_Park_Service_Trails/FeatureServer/0',
      outFields: ['*'], // Fetch all fields for more detailed information
    });

    // Store references for use in event handlers
    setView(mapView);
    setTrailsLayer(trailsFeatureLayer);

    // Add layers to the map
    mapView.map.add(trailsFeatureLayer);
    // Add the locate widget to the top left corner of the view
    mapView.ui.add(locateWidget, "top-left");
    // Add the search widget
    const searchWidget = new Search({ view: mapView });
    mapView.ui.add(searchWidget, "top-right");
    // mapView.ui.add(bkExpand, "top-right");

    // Cleanup function
    return () => {
      mapView.destroy();
    };
  }, []);

  // Improved trail detection function
  const detectTrail = async (clickPoint: __esri.Point) => {
    if (!trailsLayer || !view) return null;

    try {
      // Increase tolerance for point-to-line intersection
      const tolerance = view.scale / 130; // Adjust this value based on map scale
      const queryGeometry = geometryEngine.buffer(clickPoint, tolerance);

      const query = trailsLayer.createQuery();
      query.geometry = queryGeometry;
      query.spatialRelationship = "intersects";
      query.returnGeometry = true;
      query.outFields = ['*'];

      const queryResults = await trailsLayer.queryFeatures(query);

      // Check if any trails were found
      if (queryResults.features.length > 0) {
        // Optionally, find the closest trail
        const closestTrail = queryResults.features.reduce((closest, current) => {
          const closestDistance = closest 
            ? geometryEngine.distance(closest.geometry, clickPoint)
            : Infinity;
          const currentDistance = geometryEngine.distance(current.geometry, clickPoint);
          return currentDistance < closestDistance ? current : closest;
        }, null);

        return closestTrail;
      }

      return null;
    } catch (error) {
      console.error("Error detecting trail:", error);
      return null;
    }
  };

  // Handle map click for stop selection
  const handleMapClick = async (event: __esri.MapViewClickEvent) => {
    if (!view || !trailsLayer) return;

    try {
      // Detect trail at clicked location
      const detectedTrail = await detectTrail(event.mapPoint);

      if (detectedTrail) {
        // Create a stop graphic
        const stopGraphic = new Graphic({
          geometry: event.mapPoint,
          symbol: {
            type: "simple-marker",
            color: "green",
            size: "12px",
            outline: {
              color: "white",
              width: 2
            }
          },
          attributes: {
            trailName: detectedTrail.attributes.TRLNAME || 'Unknown Trail'
          }
        });

        // Add graphic to the view and track selected stops
        // view.graphics.add(stopGraphic);
        setSelectedStops(prev => [...prev, stopGraphic]);

setInitialPopupContent(stopGraphic);
    } else {
      view.popup.open({
        location: event.mapPoint,
        content: "No trail found at this location.",
        title: "Please click on a trail to add a stop or review"
      });
    }
  } catch (error) {
    console.error("Error processing map click:", error);
  }
};

function setInitialPopupContent(stopGraphic) {
  const popupDiv = document.createElement("div");
  const nameLabel = document.createElement("p");
  nameLabel.textContent = `Trail Name: ${stopGraphic.attributes.trailName}`;

  const leaveReviewButton = document.createElement("button");
  leaveReviewButton.textContent = "Leave Review";
  leaveReviewButton.style.cssText = buttonStyle();
  leaveReviewButton.onclick = () => updatePopupForReview(stopGraphic, popupDiv);

  const favoriteIcon = document.createElement("button");
  favoriteIcon.innerHTML = "&#x2661;"; // Unicode heart symbol
  favoriteIcon.style.cssText = favoriteButtonStyle(stopGraphic.attributes.TRLNAME); // Check if it's a favorite based on some local state or storage
  favoriteIcon.onclick = () => toggleFavorite(stopGraphic, favoriteIcon);

  // See All Reviews Button
  const seeAllReviewsButton = document.createElement("button");
  seeAllReviewsButton.textContent = "See All Reviews";
  seeAllReviewsButton.style.cssText = `${buttonStyle()} margin-left: 10px;`; // Same styling as other buttons
  seeAllReviewsButton.onclick = () => {
    ReviewsServices.getAllReviewsForTrail(stopGraphic.attributes.trailName)
      .then(reviews => {
        console.log('All reviews:', reviews?.data?.reviews);
        showAllReviewsPopup(reviews?.data?.reviews, popupDiv, stopGraphic); // Show the popup with all reviews
      })
      .catch(error => {
        console.error('Error loading reviews:', error);
      });
  };

  popupDiv.appendChild(nameLabel);
  popupDiv.appendChild(leaveReviewButton);
  popupDiv.appendChild(seeAllReviewsButton);
  popupDiv.appendChild(favoriteIcon);

  view.popup.open({
    location: stopGraphic.geometry,
    title: "Trail Information",
    content: popupDiv
  });
}

function favoriteButtonStyle(trailName) {
  // Assuming you might keep a local state or local storage to check favorites quickly
  const isFavorite = localStorage.getItem(trailName) === 'true' || favoriteTrails.includes(trailName);
  return `
    cursor: pointer;
    background-color: transparent;
    color: ${isFavorite ? 'red' : 'black'};
    border: none;
    font-size: 24px;
    margin-left: 10px;
  `;
}

async function toggleFavorite(stopGraphic, favoriteIcon) {
  const trailName = stopGraphic.attributes.trailName;
  const userEmail = profile?.profile?.email; // Ensure this is fetched from a reliable React context or state

  // Check if currently marked as a favorite
  const isFavorite = localStorage.getItem(trailName) === 'true';

  // Toggle the state and update backend
  localStorage.setItem(trailName, (!isFavorite).toString());
  favoriteIcon.style.color = isFavorite ? 'black' : 'red';

  try {
    const response = await FavoritesServices.getDataForFavorites({
      userEmail: userEmail,
      trailName: trailName
    });
    console.log('Favorite status updated:', response);
  } catch (error) {
    console.error('Error updating favorite status:', error);
    // Revert the local change if the backend update fails
    localStorage.setItem(trailName, isFavorite.toString());
    favoriteIcon.style.color = isFavorite ? 'red' : 'black';
  }
}

function updatePopupForReview(stopGraphic, popupDiv) {
  popupDiv.innerHTML = ''; // Clear the popup content

  const textarea = document.createElement("textarea");
  textarea.style.cssText = "width: 100%; height: 80px; margin-top: 10px; padding: 8px; box-shadow: inset 0 0 5px #00000030;";
  textarea.placeholder = "Leave a review!";

  // Add error message element (hidden by default)
  const errorMessage = document.createElement("div");
  errorMessage.style.cssText = `
    color: #dc2626;
    font-size: 14px;
    margin-top: 4px;
    display: none;
    padding: 4px;
    border-radius: 4px;
  `;
  errorMessage.textContent = "Please enter a review before submitting.";

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit Review";
  submitButton.style.cssText = buttonStyle();

  const backButton = document.createElement("button");
  backButton.textContent = "Back";
  backButton.style.cssText = `${buttonStyle()} margin-left: 10px;`;
  backButton.onclick = () => setInitialPopupContent(stopGraphic);

  const seeAllReviewsButton = document.createElement("button");
  seeAllReviewsButton.textContent = "See All Reviews";
  seeAllReviewsButton.style.cssText = `${buttonStyle()} margin-left: 10px;`;
  seeAllReviewsButton.onclick = () => {
    ReviewsServices.getAllReviewsForTrail(stopGraphic.attributes.trailName)
      .then(reviews => {
        console.log('All reviews:', reviews?.data?.reviews);
        showAllReviewsPopup(reviews?.data?.reviews, popupDiv, stopGraphic);
      })
      .catch(error => {
        console.error('Error loading reviews:', error);
      });
  };

  submitButton.onclick = () => {
    const reviewText = textarea.value.trim(); // Trim whitespace
    
    if (!reviewText) {
      // Show error message if review is empty
      errorMessage.style.display = 'block';
      textarea.style.border = '1px solid #dc2626';
      return;
    }

    // Clear error state if exists
    errorMessage.style.display = 'none';
    textarea.style.border = '1px solid #d1d5db';

    ReviewsServices.getDataForReview({
      trailName: stopGraphic.attributes.trailName,
      userEmail: profile?.profile?.email,
      reviewText: reviewText
    }).then(() => {
      setInitialPopupContent(stopGraphic);
    }).catch(error => {
      console.error('Error submitting review:', error);
      errorMessage.textContent = "Error submitting review. Please try again.";
      errorMessage.style.display = 'block';
    });
  };

  // Add event listener to hide error message when user starts typing
  textarea.addEventListener('input', () => {
    if (textarea.value.trim()) {
      errorMessage.style.display = 'none';
      textarea.style.border = '1px solid #d1d5db';
    }
  });

  popupDiv.appendChild(textarea);
  popupDiv.appendChild(errorMessage);
  popupDiv.appendChild(submitButton);
  popupDiv.appendChild(backButton);
  popupDiv.appendChild(seeAllReviewsButton);
}

// Function to display all reviews in the popup
function showAllReviewsPopup(reviews, popupDiv, stopGraphic) {
  popupDiv.innerHTML = ''; // Clear the popup content

  const title = document.createElement("h3");
  title.textContent = "All Reviews";
  popupDiv.appendChild(title);

 if (!reviews || reviews.length === 0) { 
    const noReviewsMessage = document.createElement("p");
    noReviewsMessage.textContent = "No reviews available.";
    noReviewsMessage.style.cssText = "text-align: center; font-style: italic; color: #888;";
    popupDiv.appendChild(noReviewsMessage);
  } else { 
    reviews.forEach((review, index) => {
      const reviewItem = document.createElement("div");
      reviewItem.style.cssText = `
        margin-bottom: 15px;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #fefefe;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      `;

      // Handle missing or empty fields
      const reviewText = review.text?.trim() || "No review text provided.";
      const reviewerName = review.user?.trim() || "Anonymous";

      // Display the review content
      reviewItem.innerHTML = `
        <strong>Review #${index + 1}</strong>
        <p style="margin: 8px 0; font-size: 14px;">"${reviewText}"</p>
        <p style="text-align: right; font-size: 12px; color: #555;">— ${reviewerName}</p>
      `;
      popupDiv.appendChild(reviewItem);
  });
}


  const backButton = document.createElement("button");
  backButton.textContent = "Back";
  backButton.style.cssText = `${buttonStyle()} margin-top: 10px;`; // Add margin to separate from reviews
  backButton.onclick = () => updatePopupForReview(stopGraphic, popupDiv);

  popupDiv.appendChild(backButton);
}


function buttonStyle() {
  return `
    cursor: pointer;
    background-color: #007BFF; 
    color: white; 
    border: none; 
    padding: 8px 15px; 
    border-radius: 4px; 
    margin-top: 8px;
    transition: background-color 0.3s ease;
  `;
}
  // Add click event listener when view and trailsLayer are ready
  useEffect(() => {
    if (view && trailsLayer) {
      view.on("click", handleMapClick);
      
      // Cleanup event listener
      // return () => {
      //   view?.removeEventListener("click", handleMapClick);
      // };
    }
  }, [view, trailsLayer]);

  return (
    <div 
      ref={mapDiv} 
      className="w-full h-screen p-0 m-0 overflow-hidden" 
    />
  );
}