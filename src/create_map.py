from pathlib import Path
import folium
from folium.plugins import MarkerCluster


def create_location_map(scored_locations):
    """
    Create an interactive cluster map of scored food-cart locations.
    """

    print("\nCreating interactive cluster map...")

    # Center map around NYC
    nyc_map = folium.Map(location=[40.75, -73.97], zoom_start=12)

    # Add marker cluster
    marker_cluster = MarkerCluster().add_to(nyc_map)

    # Take top 100 scored stations for cleaner map
    top_locations = scored_locations.head(100)

    for _, row in top_locations.iterrows():
        popup_text = f"""
        <b>Station:</b> {row['start_station_name']}<br>
        <b>Food Cart Score:</b> {row['food_cart_score']:.3f}<br>
        <b>Total Trips:</b> {row['total_trips']}<br>
        <b>Lunch Trips:</b> {row['lunch_hour_trips']}<br>
        <b>Weekday Trips:</b> {row['weekday_trips']}<br>
        <b>Casual Trips:</b> {row['casual_trips']}
        """

        folium.Marker(
            location=[row["start_lat"], row["start_lng"]],
            popup=folium.Popup(popup_text, max_width=300),
            tooltip=row["start_station_name"],
        ).add_to(marker_cluster)

    # Save map
    output_path = Path("outputs/maps/food_cart_cluster_map.html")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    nyc_map.save(output_path)

    print(f"Map saved to: {output_path}")