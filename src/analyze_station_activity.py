from pathlib import Path
import pandas as pd


def analyze_station_activity(df):
    """
    Create station-level activity summary for food cart location analysis.
    """

    print("\nAnalyzing station activity...")

    # Focus on start stations because they show where trips begin
    station_activity = (
        df.groupby(["start_station_name", "start_station_id", "start_lat", "start_lng"])
        .agg(
            total_trips=("ride_id", "count"),
            avg_trip_duration=("trip_duration_minutes", "mean"),
            member_trips=("member_casual", lambda x: (x == "member").sum()),
            casual_trips=("member_casual", lambda x: (x == "casual").sum()),
            weekend_trips=("is_weekend", "sum"),
            weekday_trips=("is_weekend", lambda x: (~x).sum()),
            lunch_hour_trips=("start_hour", lambda x: x.between(11, 14).sum()),
            morning_trips=("start_hour", lambda x: x.between(7, 10).sum()),
            evening_trips=("start_hour", lambda x: x.between(17, 20).sum()),
        )
        .reset_index()
    )

    # Create basic percentages
    station_activity["lunch_hour_share"] = (
        station_activity["lunch_hour_trips"] / station_activity["total_trips"]
    )

    station_activity["weekend_share"] = (
        station_activity["weekend_trips"] / station_activity["total_trips"]
    )

    # Sort by lunch-hour demand
    station_activity = station_activity.sort_values(
        by="lunch_hour_trips", ascending=False
    )

    # Save output
    output_path = Path("data/processed/station_activity_summary.csv")
    station_activity.to_csv(output_path, index=False)

    print(f"Station activity summary shape: {station_activity.shape}")
    print(f"Saved station summary to: {output_path}")

    print("\nTop 10 stations by lunch-hour trips:")
    print(
        station_activity[
            [
                "start_station_name",
                "total_trips",
                "lunch_hour_trips",
                "lunch_hour_share",
                "start_lat",
                "start_lng",
            ]
        ].head(10)
    )

    return station_activity