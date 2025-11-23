# Medical Data

This folder contains the medical professional data for Tunisia.

## Dataset: `cleaned_doctor_profiles_info2.csv`

### Overview

This dataset contains information about **4,320+ medical professionals** practicing across Tunisia. The data has been cleaned and processed for use in the Medical AI Geospatial Assistant application.

### Data Fields

| Column | Type | Description |
|--------|------|-------------|
| `name` | string | Full name of the medical professional |
| `specialty` | string | Medical specialty (e.g., "Médecin dentiste", "Cardiologue") |
| `address` | string | Physical address of the practice |
| `phone` | string | Contact phone number |
| `x` | float | Latitude coordinate (30-38°N range for Tunisia) |
| `y` | float | Longitude coordinate (7-12°E range for Tunisia) |
| `url` | string | Source profile URL |
| `governorate_estimate` | string | Estimated governorate based on address parsing |

### Statistics

- **Total Records**: 4,320 doctors
- **Unique Specialties**: 48 different medical fields
- **Geographic Coverage**: All 24 governorates of Tunisia
- **Coordinate Range**: 
  - Latitude: 30°N - 38°N
  - Longitude: 7°E - 12°E

### Top Specialties

1. Médecin dentiste (Dentist) - ~450 doctors
2. Gynécologue Obstétricien - ~320 doctors
3. Ophtalmologue - ~280 doctors
4. Chirurgien Orthopédiste - ~210 doctors
5. Dermatologue - ~195 doctors
6. Cardiologue - ~175 doctors
7. Oto-Rhino-Laryngologiste - ~160 doctors
8. Généraliste - ~140 doctors

### Regional Distribution

Most doctors are concentrated in:
1. **Tunis** - ~1,250 doctors
2. **Ariana** - ~680 doctors
3. **Ben Arous** - ~520 doctors
4. **Sfax** - ~450 doctors
5. **Sousse** - ~380 doctors

### Data Quality

✅ **Cleaned for**:
- Invalid coordinates removed (outside Tunisia bounds)
- Whitespace trimmed from specialty names
- Standardized address format
- Phone number formatting
- Duplicate removal

⚠️ **Known Limitations**:
- `governorate_estimate` is derived from address parsing and may not be 100% accurate
- Some records may have "Unknown" governorate
- Contact information may be outdated (data snapshot from 2024)

### Usage in Application

This data is used to:
- Display doctor markers on the interactive map
- Generate analytics in the Dashboard
- Provide AI chat recommendations
- Calculate specialty and regional statistics

### Data Processing

The data was processed using the Jupyter notebook in `/notebooks/visualisation.ipynb`, which includes:
- Data cleaning and validation
- Coordinate filtering
- Governorate extraction
- Statistical analysis
- Visualization generation

### Future Enhancements

- [ ] Add doctor ratings and reviews
- [ ] Include consultation fees
- [ ] Add office hours information
- [ ] Verify and update contact details
- [ ] Add profile photos
- [ ] Include accepted insurance providers
- [ ] Real-time availability status

### Data Source

Data sourced from Tunisia healthcare directory - publicly available information about licensed medical professionals.

### Privacy Notice

This dataset contains only publicly available professional information. No patient data or private medical information is included.

### Updates

- **Last Updated**: November 2024
- **Next Refresh**: Quarterly updates planned

---

For data-related questions or corrections, please open an issue on the GitHub repository.
