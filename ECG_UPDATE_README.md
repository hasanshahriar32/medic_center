# ECG Integration Update

## Changes Made

### ✅ Removed EEG Alpha Waves
- Removed EEG alpha wave display from homepage sidebar
- Updated interface to set `eegAlpha` to 0 (removed functionality)
- Removed EEG processing from MQTT data handlers

### ✅ Updated ECG Signal Functionality
- **MQTT Integration**: Connected to HiveMQ Cloud broker with hardcoded credentials
  - Broker: `d5e9ca698a2a4640b81af8b8e3e6e1e4.s1.eu.hivemq.cloud`
  - Port: `8883` (SSL/TLS)
  - Username: `Paradox`
  - Password: `Paradox1`
  - Topic: `mrhasan/heart`

### ✅ ECG Data Processing
The system now processes ECG analysis data with the following structure:
```json
{
  "userId": "BW8NUP21AWMkI0xrrI2nxBP6Xd92",
  "dataType": "ecg_analysis",
  "hp": 0,
  "threshold": 8,
  "bpm": 0,
  "baselineHR": 70,
  "rmssd": 0.0,
  "hrTrend": 55,
  "timestamp": "1546681",
  "deviceId": "ESP32_4B00"
}
```

### ✅ Real-time Display Updates
- **Heart Rate**: Displays BPM from ECG analysis
- **ECG Signal**: Shows normalized HP value (hp/10)
- **HP Value**: Raw HP signal strength
- **Anxiety Level**: Calculated based on heart rate and HP signal quality
  - High: Heart rate > 100 BPM OR HP < 5
  - Medium: Heart rate > 85 BPM OR HP < 10
  - Low: Normal ranges

### ✅ Maintained Heart Rate Functionality
- Previous heart rate functionality is preserved
- Heart rate alerts still trigger for values > 120 or < 50 BPM
- All existing patient monitoring features continue to work

## Technical Implementation

### Files Modified:
1. `app/page.tsx` - Removed EEG display, updated ECG status
2. `lib/mqtt-client.ts` - Updated with HiveMQ credentials and ECG processing
3. `app/api/mqtt/process/route.ts` - Added ECG analysis data handling
4. `hooks/useRealTimeData.ts` - Updated data structure for ECG integration

### MQTT Connection:
- Uses SSL/TLS connection to HiveMQ Cloud
- Processes `ecg_analysis` data type specially
- Normalizes HP signal for visualization
- Maintains existing real-time data store architecture

## Running the Application

```bash
pnpm dev
```

The application will:
1. Start Next.js on port 10000
2. Connect to HiveMQ Cloud MQTT broker
3. Subscribe to `mrhasan/heart` topic
4. Process incoming ECG analysis data in real-time
5. Display ECG metrics in the sidebar and monitoring pages

## Data Flow

1. ESP32 device publishes ECG analysis to `mrhasan/heart` topic
2. MQTT client receives and processes the data
3. ECG data is stored in real-time store
4. Frontend polls `/api/realtime` endpoint for updates
5. UI updates with latest ECG metrics and heart rate data
