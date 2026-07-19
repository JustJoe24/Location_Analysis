from pathlib import Path
import pandas as pd


def load_citibike_data():
    """
    Load all Citi Bike CSV files from data/raw and combine them into one dataframe.
    """

    raw_data_path = Path("data/raw")

    csv_files = list(raw_data_path.glob("*.csv"))

    if not csv_files:
        raise FileNotFoundError("No CSV files found in data/raw. Please add the Citi Bike CSV files there.")

    print(f"Found {len(csv_files)} CSV files:")

    dataframes = []

    for file in csv_files:
        print(f"Loading: {file.name}")
        
        df = pd.read_csv(
        file,
        dtype={
            "start_station_id": "string",
            "end_station_id": "string"},
        low_memory=False,)
        dataframes.append(df)

    combined_df = pd.concat(dataframes, ignore_index=True)

    print(f"\nCombined dataset shape: {combined_df.shape}")
    print("\nColumns:")
    print(combined_df.columns.tolist())

    return combined_df