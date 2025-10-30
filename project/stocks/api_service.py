import requests
from flask import current_app

# Base URLs for Finnhub API
PROFILE_URL = "https://finnhub.io/api/v1/stock/profile2"
PRICE_URL = "https://finnhub.io/api/v1/stock/candle"

def get_company_overview(ticker):
    """
    Fetch company profile data (name, exchange, ticker) from Finnhub.
    """
    try:
        params = {
            "symbol": ticker,
            "token": current_app.config["FINNHUB_API_KEY"]
        }
        response = requests.get(PROFILE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        # If no valid company profile is returned
        if not data or "name" not in data:
            print(f"⚠️ No company data for {ticker}: {data}")
            return None

        return {
            "stock_id": data.get("ticker", ticker),
            "company_name": data.get("name", "Unknown"),
            "exchange": data.get("exchange", "Unknown")
        }

    except Exception as e:
        print(f"⚠️ Finnhub API error for {ticker}: {e}")
        return None


def get_price_data(ticker):
    """
    Fetch recent daily price data for a given stock from Finnhub.
    """
    try:
        params = {
            "symbol": ticker,
            "resolution": "D",  
            "count": 100,       
            "token": current_app.config["FINNHUB_API_KEY"]
        }
        response = requests.get(PRICE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        # If error or empty data
        if data.get("s") != "ok":
            raise Exception(f"Could not retrieve price data for {ticker}: {data}")

        prices = {}
        timestamps = data.get("t", [])
        closing_prices = data.get("c", [])

        for t, c in zip(timestamps, closing_prices):
            prices[t] = c

        return prices

    except Exception as e:
        print(f"⚠️ Finnhub price data error for {ticker}: {e}")
        return {}
