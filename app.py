import streamlit as st
import pandas as pd
import requests
from geopy.geocoders import Nominatim # For real-time coordinates

# 1. INITIAL SETUP
st.set_page_config(page_title="AgriSmart AI Advisor", layout="wide", page_icon="🌱")

# --- PASTE YOUR API KEY HERE ---
WEATHER_API_KEY = "5088264507bac4a370b7e0ddc4418609"

# 2. CORE LOGIC FUNCTIONS
def get_pinpoint_weather(city_name):
    """Converts city to coordinates and fetches live weather"""
    try:
        # Step A: Get Coordinates
        geolocator = Nominatim(user_agent="agri_smart_v1")
        location = geolocator.geocode(city_name)
        
        if location:
            lat, lon = location.latitude, location.longitude
            # Step B: Get Live Weather via Lat/Lon
            url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
            data = requests.get(url).json()
            
            return {
                "temp": data['main']['temp'],
                "hum": data['main']['humidity'],
                "desc": data['weather'][0]['description'].title(),
                "lat": lat, "lon": lon, "success": True
            }
    except Exception:
        pass
    return {"success": False}

def generate_dynamic_advice(state, n, p, k, weather_desc, humidity):
    """Creates expert advice based on real-time factors"""
    advice = []
    # Soil logic
    if n < 60: advice.append("⚠️ **Soil Health:** Nitrogen is low. Apply organic mulch or Urea.")
    if p < 40: advice.append("🧪 **Nutrient Tip:** Phosphorus is below optimal. Use DAP fertilizer for root strength.")
    # Weather logic
    if "rain" in weather_desc.lower():
        advice.append("🌧️ **Action:** Rain detected. Stop irrigation to prevent waterlogging.")
    if humidity > 80:
        advice.append("🪲 **Pest Alert:** High humidity increases fungal risk. Monitor leaf undersides.")
    # State-specific legacy
    if state in ["Punjab", "Haryana"]:
        advice.append("🌾 **Regional:** Ideal for Wheat/Paddy. Check Mandi prices for current harvest.")
    
    return advice

# 3. SIDEBAR
st.sidebar.header("🚜 Farmer Dashboard")
state_choice = st.sidebar.selectbox("Home State", ["Gujarat", "Maharashtra", "Punjab", "Tamil Nadu", "Uttar Pradesh", "Karnataka"])
city_input = st.sidebar.text_input("Enter Nearby City/Village", state_choice)
# Add this inside the 'with st.sidebar:' block
st.sidebar.subheader("📡 Connection Status")
test_url = f"http://api.openweathermap.org/data/2.5/weather?q=London&appid={WEATHER_API_KEY}"
response = requests.get(test_url)

if response.status_code == 200:
    st.sidebar.success("API Connected: Live Mode")
elif response.status_code == 401:
    st.sidebar.warning("API Key Inactive (Wait 2 hours)")
else:
    st.sidebar.error(f"Error Code: {response.status_code}")

st.sidebar.divider()
st.sidebar.subheader("🧪 Real-Time Soil Data")
n = st.sidebar.slider("Nitrogen (N)", 0, 150, 70)
p = st.sidebar.slider("Phosphorus (P)", 0, 150, 50)
k = st.sidebar.slider("Potassium (K)", 0, 150, 40)

# 4. MAIN INTERFACE
st.title("🌱 AgriSmart: Small & Marginal Farmer Advisory")
st.markdown(f"**Analyzing conditions for {city_input}, {state_choice}...**")

# Fetch Data
weather = get_pinpoint_weather(city_input)

if weather["success"]:
    # Weather Metrics
    col1, col2, col3 = st.columns(3)
    col1.metric("Live Temperature", f"{weather['temp']}°C")
    col2.metric("Humidity", f"{weather['hum']}%")
    col3.metric("Sky Condition", weather['desc'])

    # Map Visualization
    st.divider()
    st.subheader("📍 Geolocation Analysis")
    map_df = pd.DataFrame({'lat': [weather['lat']], 'lon': [weather['lon']]})
    st.map(map_df)

    # Dynamic Advice
    st.divider()
    st.subheader("💡 Expert Recommendations")
    final_advices = generate_dynamic_advice(state_choice, n, p, k, weather['desc'], weather['hum'])
    for a in final_advices:
        st.info(a)

    # Soil Health Visual
    st.divider()
    st.subheader("📊 Soil Health Chart")
    st.bar_chart(pd.DataFrame({"Nutrient": ["N", "P", "K"], "Values": [n, p, k]}).set_index("Nutrient"))
else:
    st.error("⚠️ Connection Error: Please check your API key or City name.")
    st.info("Wait up to 2 hours for new API keys to activate.")

# 5. MARKET PRICES (FOOTER)
st.divider()
st.caption("Data sources: OpenWeatherMap, Geopy & Regional Agri-Mandi indices.")

st.sidebar.divider()
st.sidebar.subheader("📐 Seed Rate Calculator")
land_size = st.sidebar.number_input("Enter Land Size (Acres)", min_value=0.1, value=1.0)
# Example: Wheat typically needs 40kg per acre
seed_needed = land_size * 40 
st.sidebar.info(f"You will need approximately **{seed_needed} kg** of seeds.")